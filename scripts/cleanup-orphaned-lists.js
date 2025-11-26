/**
 * Cleanup script to delete orphaned lists from Firestore
 * 
 * This script can be run in the browser console after signing in.
 * 
 * Usage:
 * 1. Open the app in your browser
 * 2. Sign in with your Google account
 * 3. Open the browser console (F12)
 * 4. Copy and paste this entire script
 * 5. Run: cleanupOrphanedLists('YOUR_USER_ID')
 * 
 * Or run it automatically for the current user:
 * cleanupOrphanedListsForCurrentUser()
 */

async function cleanupOrphanedLists(userId) {
  const { collection, query, where, getDocs, deleteDoc, doc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
  
  // Get the db instance from the window (you'll need to expose it)
  // Or import it from your firebase config
  console.log('Starting cleanup for userId:', userId);
  
  try {
    // Query all lists owned by this user
    const listsRef = collection(window.db, 'lists');
    const q = query(listsRef, where('ownerId', '==', userId));
    
    const snapshot = await getDocs(q);
    const totalCount = snapshot.size;
    console.log(`Found ${totalCount} lists to delete`);
    
    if (totalCount === 0) {
      console.log('No lists found. Nothing to clean up.');
      return;
    }
    
    // Confirm deletion
    const confirmed = confirm(`Are you sure you want to delete ${totalCount} lists? This cannot be undone!`);
    if (!confirmed) {
      console.log('Cleanup cancelled by user');
      return;
    }
    
    // Delete in batches to avoid overwhelming Firestore
    const batchSize = 100;
    let deletedCount = 0;
    let batch = [];
    
    snapshot.forEach((docSnap) => {
      batch.push(docSnap);
      
      if (batch.length >= batchSize) {
        // Delete this batch
        const deletePromises = batch.map(d => deleteDoc(doc(window.db, 'lists', d.id)));
        await Promise.all(deletePromises);
        deletedCount += batch.length;
        console.log(`Deleted ${deletedCount}/${totalCount} lists...`);
        batch = [];
      }
    });
    
    // Delete remaining items
    if (batch.length > 0) {
      const deletePromises = batch.map(d => deleteDoc(doc(window.db, 'lists', d.id)));
      await Promise.all(deletePromises);
      deletedCount += batch.length;
    }
    
    console.log(`✅ Cleanup complete! Deleted ${deletedCount} lists.`);
    alert(`Cleanup complete! Deleted ${deletedCount} lists.`);
  } catch (error) {
    console.error('Error during cleanup:', error);
    alert(`Error during cleanup: ${error.message}`);
  }
}

async function cleanupOrphanedListsForCurrentUser() {
  const { getAuth } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) {
    console.error('No user signed in. Please sign in first.');
    alert('No user signed in. Please sign in first.');
    return;
  }
  
  console.log('Current user:', user.email, '(', user.uid, ')');
  await cleanupOrphanedLists(user.uid);
}

// Make functions available globally
window.cleanupOrphanedLists = cleanupOrphanedLists;
window.cleanupOrphanedListsForCurrentUser = cleanupOrphanedListsForCurrentUser;

console.log('Cleanup functions loaded!');
console.log('Run: cleanupOrphanedListsForCurrentUser() to clean up lists for the current user');
console.log('Or: cleanupOrphanedLists("USER_ID") to clean up for a specific user');

