import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

/**
 * Hook to manage hidden/shared lists that user wants to remove from their view
 * Stores hidden list IDs in the user's Firestore document
 */
export const useHiddenLists = () => {
  const [hiddenListIds, setHiddenListIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setHiddenListIds([]);
      setLoading(false);
      return;
    }

    const fetchHiddenLists = async () => {
      try {
        const userRef = doc(db, 'users', auth.currentUser!.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const data = userSnap.data();
          const hidden = data.hiddenListIds || [];
          setHiddenListIds(hidden);
        } else {
          setHiddenListIds([]);
        }
      } catch (error) {
        console.error('Error fetching hidden lists:', error);
        setHiddenListIds([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHiddenLists();
  }, [auth.currentUser]);

  /**
   * Hide a list from the user's view (doesn't delete the list)
   */
  const hideList = async (listId: string) => {
    if (!auth.currentUser) return;

    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      
      // Get current hidden lists
      const userSnap = await getDoc(userRef);
      const currentHidden = userSnap.exists() 
        ? (userSnap.data().hiddenListIds || [])
        : [];
      
      // Add to hidden if not already hidden
      if (!currentHidden.includes(listId)) {
        const updatedHidden = [...currentHidden, listId];

        if (userSnap.exists()) {
          await updateDoc(userRef, {
            hiddenListIds: updatedHidden
          });
        } else {
          await setDoc(userRef, {
            email: auth.currentUser.email?.toLowerCase() || '',
            hiddenListIds: updatedHidden
          });
        }

        // Update local state
        setHiddenListIds(updatedHidden);
      }
    } catch (error) {
      console.error('Error hiding list:', error);
      throw error;
    }
  };

  /**
   * Show a previously hidden list (remove from hidden list)
   */
  const showList = async (listId: string) => {
    if (!auth.currentUser) return;

    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      
      // Get current hidden lists
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return;
      
      const currentHidden = userSnap.data().hiddenListIds || [];
      const updatedHidden = currentHidden.filter((id: string) => id !== listId);

      await updateDoc(userRef, {
        hiddenListIds: updatedHidden
      });

      // Update local state
      setHiddenListIds(updatedHidden);
    } catch (error) {
      console.error('Error showing list:', error);
      throw error;
    }
  };

  return { hiddenListIds, loading, hideList, showList };
};

