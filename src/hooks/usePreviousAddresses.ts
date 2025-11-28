import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

/**
 * Hook to manage previously used email addresses for sharing lists
 * Stores addresses in the user's Firestore document
 */
export const usePreviousAddresses = () => {
  const [previousAddresses, setPreviousAddresses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setPreviousAddresses([]);
      setLoading(false);
      return;
    }

    const fetchPreviousAddresses = async () => {
      try {
        const userRef = doc(db, 'users', auth.currentUser!.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const data = userSnap.data();
          const addresses = data.previousSharedAddresses || [];
          // Filter out current user's email and normalize
          const normalizedAddresses = addresses
            .map((addr: string) => addr.toLowerCase().trim())
            .filter((addr: string) => addr && addr !== auth.currentUser?.email?.toLowerCase());
          setPreviousAddresses(normalizedAddresses);
        } else {
          setPreviousAddresses([]);
        }
      } catch (error) {
        console.error('Error fetching previous addresses:', error);
        setPreviousAddresses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPreviousAddresses();
  }, [auth.currentUser]);

  /**
   * Add a new email address to the user's previously used addresses
   * Removes duplicates and limits to last 20 addresses
   */
  const addAddress = async (email: string) => {
    if (!auth.currentUser) return;

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || normalizedEmail === auth.currentUser.email?.toLowerCase()) {
      return;
    }

    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      
      // Get current addresses
      const userSnap = await getDoc(userRef);
      const currentAddresses = userSnap.exists() 
        ? (userSnap.data().previousSharedAddresses || [])
        : [];
      
      // Remove duplicate and add to front (most recent first)
      const updatedAddresses = [
        normalizedEmail,
        ...currentAddresses.filter((addr: string) => addr.toLowerCase() !== normalizedEmail)
      ].slice(0, 20); // Keep only last 20 addresses

      if (userSnap.exists()) {
        await updateDoc(userRef, {
          previousSharedAddresses: updatedAddresses
        });
      } else {
        await setDoc(userRef, {
          email: auth.currentUser.email?.toLowerCase() || '',
          previousSharedAddresses: updatedAddresses
        });
      }

      // Update local state
      setPreviousAddresses(updatedAddresses);
    } catch (error) {
      console.error('Error saving previous address:', error);
      // Don't throw - this is a convenience feature, shouldn't block sharing
    }
  };

  return { previousAddresses, loading, addAddress };
};

