import { useState } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import './CleanupButton.css';

interface CleanupButtonProps {
  onCleanupComplete?: () => void;
}

export const CleanupButton = ({ onCleanupComplete }: CleanupButtonProps) => {
  const [isCleaning, setIsCleaning] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const handleCleanup = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert('Please sign in first');
      return;
    }

    const confirmed = confirm(
      `This will delete all orphaned lists for ${user.email}.\n\n` +
      `This action cannot be undone. Continue?`
    );

    if (!confirmed) return;

    setIsCleaning(true);
    setProgress({ current: 0, total: 0 });

    try {
      const listsRef = collection(db, 'lists');
      const q = query(listsRef, where('ownerId', '==', user.uid));
      
      const snapshot = await getDocs(q);
      const totalCount = snapshot.size;
      
      if (totalCount === 0) {
        alert('No lists found. Nothing to clean up.');
        setIsCleaning(false);
        return;
      }

      setProgress({ current: 0, total: totalCount });

      // Delete in batches
      const batchSize = 100;
      let deletedCount = 0;
      const docs = snapshot.docs;
      
      for (let i = 0; i < docs.length; i += batchSize) {
        const batch = docs.slice(i, i + batchSize);
        const deletePromises = batch.map(d => deleteDoc(doc(db, 'lists', d.id)));
        await Promise.all(deletePromises);
        deletedCount += batch.length;
        setProgress({ current: deletedCount, total: totalCount });
      }
      
      alert(`✅ Cleanup complete! Deleted ${deletedCount} lists.`);
      setIsCleaning(false);
      if (onCleanupComplete) {
        onCleanupComplete();
      }
    } catch (error: any) {
      console.error('Error during cleanup:', error);
      alert(`Error during cleanup: ${error.message}`);
      setIsCleaning(false);
    }
  };

  return (
    <div className="cleanup-button-container">
      <button
        onClick={handleCleanup}
        disabled={isCleaning}
        className="cleanup-button"
        title="Clean up orphaned lists"
      >
        {isCleaning ? (
          <>
            <span className="material-symbols-outlined cleanup-button-icon-spin">refresh</span>
            <span>Cleaning up... {progress.current}/{progress.total}</span>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined">delete_sweep</span>
            <span>Clean Up Orphaned Lists</span>
          </>
        )}
      </button>
    </div>
  );
};

