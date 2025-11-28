import { useState, useEffect, useCallback, useRef } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, doc, Timestamp, where, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ShoppingList } from '../types/list';

export const useLists = () => {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasOrphanedLists, setHasOrphanedLists] = useState(false);
  const hasLoggedOrphanedLists = useRef(false);

  useEffect(() => {
    let unsubscribeLists: (() => void) | null = null;
    let mounted = true;

    // Listen for auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!mounted) return;

      // Clean up previous listener if it exists
      if (unsubscribeLists) {
        unsubscribeLists();
        unsubscribeLists = null;
      }

      if (!user) {
        setLists([]);
        setLoading(false);
        return;
      }

      const userId = user.uid;
      const userEmail = user.email || '';

      if (!userId) {
        setLists([]);
        setLoading(false);
        return;
      }

      // Query lists owned by user OR lists shared with user
      // Note: Firestore doesn't support OR queries directly, so we need two separate queries
      // We'll combine the results client-side
      const ownedQuery = query(
        collection(db, 'lists'),
        where('ownerId', '==', userId)
      );
      
      const sharedQuery = userEmail ? query(
        collection(db, 'lists'),
        where('sharedWith', 'array-contains', userEmail.toLowerCase())
      ) : null;
      
      // Combine results from both queries
      // We'll merge results from both queries in a shared state
      let ownedLists: ShoppingList[] = [];
      let sharedLists: ShoppingList[] = [];
      
      const updateLists = () => {
        if (!mounted) return;
        
        // Combine and deduplicate lists using Map (keyed by list.id)
        // This ensures no duplicates even if queries return the same list
        const allListsMap = new Map<string, ShoppingList>();
        const normalizedUserEmail = userEmail?.toLowerCase() || '';
        
        // Process owned lists
        ownedLists.forEach(list => {
          // Final safety check: only include if user owns it
          if (list.ownerId === userId) {
            allListsMap.set(list.id, list);
          }
        });
        
        // Process shared lists (exclude if already added as owned)
        sharedLists.forEach(list => {
          // Final safety check: only include if user is NOT owner AND email is in sharedWith
          if (list.ownerId !== userId) {
            const sharedWithArray = (list.sharedWith || []).map((email: string) => email.toLowerCase());
            if (normalizedUserEmail && sharedWithArray.includes(normalizedUserEmail)) {
              // Only add if not already in map (avoid duplicates)
              if (!allListsMap.has(list.id)) {
                allListsMap.set(list.id, list);
              }
            }
          }
        });
        
        // Convert map to array and sort
        const listsData = Array.from(allListsMap.values());
        listsData.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
        
        // Final safety check: filter out any lists that shouldn't be here
        const finalFilteredLists = listsData.filter(list => {
          const isOwned = list.ownerId === userId;
          const normalizedUserEmail = userEmail?.toLowerCase() || '';
          const sharedWithArray = (list.sharedWith || []).map((email: string) => email.toLowerCase());
          const isShared = normalizedUserEmail && sharedWithArray.includes(normalizedUserEmail);
          
          if (isOwned || isShared) {
            return true;
          } else {
            console.error(`[useLists] CRITICAL: List ${list.id} passed through filters but shouldn't be visible! ownerId: ${list.ownerId}, userId: ${userId}, sharedWith: ${JSON.stringify(list.sharedWith)}`);
            return false;
          }
        });
        
        // Safety check: if we somehow get more than 100 lists, log a warning
        if (finalFilteredLists.length > 100) {
          console.error(`[useLists] ERROR: Found ${finalFilteredLists.length} lists for user ${userId}. This is way too many!`);
          console.error(`[useLists] Owned lists: ${ownedLists.length}, Shared lists: ${sharedLists.length}`);
        }
        
        // Only log final result in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`[useLists] Final result: ${finalFilteredLists.length} lists for user ${userId} (${userEmail})`);
        }
        
        // HARD LIMIT: Never show more than 50 lists (something is very wrong if we get more)
        const limitedLists = finalFilteredLists.slice(0, 50);
        if (finalFilteredLists.length > 50 && !hasLoggedOrphanedLists.current) {
          console.error(`[useLists] CRITICAL: Limiting lists from ${finalFilteredLists.length} to 50. Something is very wrong!`);
        }
        
        setLists(limitedLists);
        setLoading(false);
      };
      
      const processOwnedSnapshot = (snapshot: any) => {
        if (!mounted) return;
        
        ownedLists = [];
        const snapshotSize = snapshot.size;
        // Only log normal query results in development
        if (process.env.NODE_ENV === 'development' && snapshotSize <= 10) {
          console.log(`[useLists] Owned query returned ${snapshotSize} documents for userId: ${userId}`);
        }
        
        // If we got an unreasonable number of results, something is very wrong
        // User says they haven't created any lists, so if we get more than 10, ignore them all
        if (snapshotSize > 10) {
          setHasOrphanedLists(true);
          // Only log this critical error once per session to avoid console spam
          if (!hasLoggedOrphanedLists.current) {
            console.error(`[useLists] CRITICAL: Query returned ${snapshotSize} documents for user ${userId}, but user reports they haven't created any lists!`);
            console.error(`[useLists] This suggests: 1) Lists being auto-created in a loop, 2) Database corruption, or 3) Test data.`);
            console.error(`[useLists] Setting ownedLists to empty array to prevent showing thousands of lists.`);
            hasLoggedOrphanedLists.current = true;
          }
          ownedLists = [];
          updateLists();
          return;
        } else {
          setHasOrphanedLists(false);
        }
        
        snapshot.forEach((docSnap: any) => {
          const data = docSnap.data();
          // STRICT check: only include if this list is actually owned by the user
          if (data.ownerId === userId) {
            // Check if list is expired
            const expirationTime = data.expirationTime?.toDate();
            if (expirationTime && expirationTime < new Date()) {
              // Auto-delete expired list (only owner can delete)
              deleteDoc(doc(db, 'lists', docSnap.id)).catch(err => {
                console.error(`[useLists] Error deleting expired list ${docSnap.id}:`, err);
              });
              return; // Skip adding to lists
            }
            
            const list: ShoppingList = {
              id: docSnap.id,
              name: data.name,
              ownerId: data.ownerId,
              sharedWith: data.sharedWith || [],
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
              expirationTime: expirationTime
            };
            ownedLists.push(list);
          } else {
            console.error(`[useLists] CRITICAL: Query returned list ${docSnap.id} with ownerId ${data.ownerId} but query was for userId ${userId}! This means the query filter is NOT working!`);
          }
        });
        
        // Only log in development for normal cases
        if (process.env.NODE_ENV === 'development' && ownedLists.length <= 10) {
          console.log(`[useLists] Processed ${ownedLists.length} owned lists after filtering`);
        }
        updateLists();
      };
      
      const processSharedSnapshot = (snapshot: any) => {
        if (!mounted || !userEmail) return;
        
        sharedLists = [];
        const normalizedUserEmail = userEmail.toLowerCase();
        const snapshotSize = snapshot.size;
        // Only log normal query results in development
        if (process.env.NODE_ENV === 'development' && snapshotSize <= 10) {
          console.log(`[useLists] Shared query returned ${snapshotSize} documents for email: ${userEmail}`);
        }
        
        if (snapshotSize > 100 && !hasLoggedOrphanedLists.current) {
          console.error(`[useLists] CRITICAL: Shared query returned ${snapshotSize} documents! This should not happen. Query might not be filtering correctly.`);
        }
        
        snapshot.forEach((docSnap: any) => {
          const data = docSnap.data();
          // STRICT check: only include if user's email is actually in sharedWith
          // AND user is not the owner (to avoid duplicates)
          const sharedWithArray = (data.sharedWith || []).map((email: string) => email.toLowerCase());
          const isShared = sharedWithArray.includes(normalizedUserEmail);
          const isNotOwner = data.ownerId !== userId;
          
          if (isNotOwner && isShared) {
            // Check if list is expired
            const expirationTime = data.expirationTime?.toDate();
            if (expirationTime && expirationTime < new Date()) {
              // Auto-delete expired list (only if user has permission)
              // Note: Only owner can delete, but we can still filter it out
              return; // Skip adding to lists
            }
            
            const list: ShoppingList = {
              id: docSnap.id,
              name: data.name,
              ownerId: data.ownerId,
              sharedWith: data.sharedWith || [],
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
              expirationTime: expirationTime
            };
            sharedLists.push(list);
          } else {
            // Only log warnings in development
            if (process.env.NODE_ENV === 'development') {
              if (!isNotOwner) {
                console.warn(`[useLists] Skipping list ${docSnap.id}: user is owner (should be in owned lists)`);
              }
              if (!isShared) {
                console.error(`[useLists] CRITICAL: Query returned list ${docSnap.id} but email ${userEmail} not in sharedWith array! This means the array-contains query is NOT working!`);
              }
            }
          }
        });
        
        // Only log in development for normal cases
        if (process.env.NODE_ENV === 'development' && sharedLists.length <= 10) {
          console.log(`[useLists] Processed ${sharedLists.length} shared lists after filtering`);
        }
        updateLists();
      };
      
      // Only log setup in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[useLists] Setting up queries for userId: ${userId}, email: ${userEmail}`);
      }
      const unsubscribeOwned = onSnapshot(ownedQuery, processOwnedSnapshot, (error) => {
        if (!mounted) return;
        console.error('[useLists] Error fetching owned lists:', error);
        if (error.code === 'failed-precondition') {
          console.error('[useLists] Missing Firestore index! Check the error message for the link.');
        }
        setLoading(false);
      });
      
      // Subscribe to shared lists (if user has email)
      let unsubscribeShared: (() => void) | null = null;
      if (sharedQuery) {
        unsubscribeShared = onSnapshot(sharedQuery, processSharedSnapshot, (error) => {
          if (!mounted) return;
          console.error('[useLists] Error fetching shared lists:', error);
          if (error.code === 'failed-precondition') {
            console.error('[useLists] Missing Firestore index! Check the error message for the link.');
          }
          setLoading(false);
        });
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.log('[useLists] No shared query (user has no email)');
        }
      }
      
      unsubscribeLists = () => {
        unsubscribeOwned();
        if (unsubscribeShared) {
          unsubscribeShared();
        }
      };
    });

    return () => {
      mounted = false;
      unsubscribeAuth();
      if (unsubscribeLists) {
        unsubscribeLists();
      }
    };
  }, []);

  const createList = useCallback(async (name: string, expirationTime?: Date): Promise<string> => {
    if (!auth.currentUser) throw new Error('User must be authenticated');
    
    const listData: any = {
      name,
      ownerId: auth.currentUser.uid,
      sharedWith: [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    // Add expiration time if provided
    if (expirationTime) {
      listData.expirationTime = Timestamp.fromDate(expirationTime);
    }
    
    const docRef = await addDoc(collection(db, 'lists'), listData);
    
    return docRef.id;
  }, []);

  const shareList = async (listId: string, email: string) => {
    if (!auth.currentUser) throw new Error('User must be authenticated');
    
    const listRef = doc(db, 'lists', listId);
    const list = lists.find(l => l.id === listId);
    
    if (!list || list.ownerId !== auth.currentUser.uid) {
      throw new Error('Only list owner can share');
    }
    
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedSharedWith = list.sharedWith.map(e => e.toLowerCase());
    
    if (!normalizedSharedWith.includes(normalizedEmail)) {
      await updateDoc(listRef, {
        sharedWith: [...list.sharedWith, normalizedEmail],
        updatedAt: Timestamp.now()
      });
    }
  };

  const unshareList = async (listId: string, email: string) => {
    if (!auth.currentUser) throw new Error('User must be authenticated');
    
    const listRef = doc(db, 'lists', listId);
    const list = lists.find(l => l.id === listId);
    
    if (!list || list.ownerId !== auth.currentUser.uid) {
      throw new Error('Only list owner can unshare');
    }
    
    const normalizedEmail = email.trim().toLowerCase();
    
    await updateDoc(listRef, {
      sharedWith: list.sharedWith.filter(e => e.toLowerCase() !== normalizedEmail),
      updatedAt: Timestamp.now()
    });
  };

  return { lists, loading, hasOrphanedLists, createList, shareList, unshareList };
};

