import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Set auth persistence to local storage (default, but explicit for reliability)
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Error setting auth persistence:', error);
});
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Expose db and cleanup utility in development for debugging
if (import.meta.env.DEV) {
  (window as any).__FIREBASE_DB__ = db;
  (window as any).__FIREBASE_AUTH__ = auth;
  
  // Cleanup utility function
  (window as any).cleanupOrphanedLists = async (userId?: string) => {
    const { collection, query, where, getDocs, deleteDoc, doc } = await import('firebase/firestore');
    const targetUserId = userId || auth.currentUser?.uid;
    
    if (!targetUserId) {
      console.error('No user ID provided and no user is signed in');
      return;
    }
    
    console.log('Starting cleanup for userId:', targetUserId);
    
    try {
      const listsRef = collection(db, 'lists');
      const q = query(listsRef, where('ownerId', '==', targetUserId));
      
      const snapshot = await getDocs(q);
      const totalCount = snapshot.size;
      console.log(`Found ${totalCount} lists to delete`);
      
      if (totalCount === 0) {
        console.log('No lists found. Nothing to clean up.');
        return;
      }
      
      const confirmed = confirm(`Are you sure you want to delete ${totalCount} lists? This cannot be undone!`);
      if (!confirmed) {
        console.log('Cleanup cancelled by user');
        return;
      }
      
      // Delete in batches
      const batchSize = 100;
      let deletedCount = 0;
      const docs = snapshot.docs;
      
      for (let i = 0; i < docs.length; i += batchSize) {
        const batch = docs.slice(i, i + batchSize);
        const deletePromises = batch.map(d => deleteDoc(doc(db, 'lists', d.id)));
        await Promise.all(deletePromises);
        deletedCount += batch.length;
        console.log(`Deleted ${deletedCount}/${totalCount} lists...`);
      }
      
      console.log(`✅ Cleanup complete! Deleted ${deletedCount} lists.`);
      alert(`Cleanup complete! Deleted ${deletedCount} lists.`);
    } catch (error: any) {
      console.error('Error during cleanup:', error);
      alert(`Error during cleanup: ${error.message}`);
    }
  };
  
  console.log('🔧 Development mode: Cleanup utility available');
  console.log('Run: cleanupOrphanedLists() to clean up lists for the current user');
  console.log('Or: cleanupOrphanedLists("USER_ID") to clean up for a specific user');
}

