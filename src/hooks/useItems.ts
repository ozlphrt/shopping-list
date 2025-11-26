import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, Timestamp, where } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { Item } from '../types/item';

export const useItems = (listId: string | null) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!listId || !auth.currentUser) {
      setItems([]);
      setLoading(false);
      return;
    }
    
    // Query ALL items for this list (not filtered by userId)
    // This allows all shared users to see all items in the list
    const q = query(
      collection(db, 'items'),
      where('listId', '==', listId)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const itemsData: Item[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
            itemsData.push({
              id: docSnap.id,
              name: data.name,
              quantity: data.quantity || '',
              category: data.category || 'Other',
              notes: data.notes || '',
              picked: data.picked || false,
              deleted: data.deleted || false,
              dimmed: data.dimmed || false,
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
              createdBy: data.createdBy || '',
              userId: data.userId || '',
              listId: data.listId || ''
            });
      });
      // Sort by createdAt descending client-side
      itemsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setItems(itemsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching items:', error);
      if (error.code === 'failed-precondition') {
        const errorMessage = error.message || '';
        const indexMatch = errorMessage.match(/https:\/\/console\.firebase\.google\.com[^\s]+/);
        if (indexMatch) {
          console.error('Index required! Click this link to create it:', indexMatch[0]);
          alert(`Index required! Please click this link to create it:\n${indexMatch[0]}`);
        }
      } else if (error.code === 'permission-denied') {
        console.error('Permission denied! Check Firestore security rules.');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [listId]);

  const addItem = async (itemData: Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'listId'>, listId: string) => {
    if (!auth.currentUser) throw new Error('User must be authenticated');
    
    const itemToAdd = {
      ...itemData,
      userId: auth.currentUser.uid,
      listId: listId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    await addDoc(collection(db, 'items'), itemToAdd);
  };

  const updateItem = async (id: string, updates: Partial<Item>) => {
    const itemRef = doc(db, 'items', id);
    await updateDoc(itemRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  };

  const deleteItem = async (id: string) => {
    const itemRef = doc(db, 'items', id);
    await updateDoc(itemRef, {
      deleted: true,
      updatedAt: Timestamp.now()
    });
  };

  const clearPicked = async () => {
    const pickedItems = items.filter(item => item.picked);
    const deletePromises = pickedItems.map(item => deleteItem(item.id));
    await Promise.all(deletePromises);
  };

  const clearAll = async () => {
    if (!listId) return;
    // Delete ALL items from the current list (active, picked, and deleted)
    const listItems = items.filter(item => item.listId === listId);
    const deletePromises = listItems.map(item => deleteDoc(doc(db, 'items', item.id)));
    await Promise.all(deletePromises);
  };

  return { items, loading, addItem, updateItem, deleteItem, clearPicked, clearAll };
};

