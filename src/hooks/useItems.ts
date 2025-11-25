import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Item } from '../types/item';

export const useItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'items'), orderBy('createdAt', 'desc'));
    
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
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          createdBy: data.createdBy || ''
        });
      });
      setItems(itemsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addItem = async (itemData: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => {
    await addDoc(collection(db, 'items'), {
      ...itemData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
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
    // Delete ALL items from the database (active, picked, and deleted)
    const deletePromises = items.map(item => deleteDoc(doc(db, 'items', item.id)));
    await Promise.all(deletePromises);
  };

  return { items, loading, addItem, updateItem, deleteItem, clearPicked, clearAll };
};

