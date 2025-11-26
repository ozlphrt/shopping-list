# Cleanup Orphaned Lists

If you have orphaned lists in your Firestore database (e.g., 10,825 lists that were auto-created by a bug), you can clean them up using the built-in cleanup utility.

## Method 1: Browser Console (Recommended)

1. **Open your app in development mode** (run `npm run dev`)
2. **Sign in** with your Google account
3. **Open the browser console** (F12 or right-click → Inspect → Console)
4. **Run the cleanup function**:
   ```javascript
   cleanupOrphanedLists()
   ```
   This will clean up lists for the currently signed-in user.

   Or specify a user ID:
   ```javascript
   cleanupOrphanedLists('4TUk0OX2rdUrBTVeVgbr7tduFm83')
   ```

5. **Confirm the deletion** when prompted
6. The script will delete lists in batches of 100 and show progress in the console

## Method 2: Firebase Console (Manual)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database**
4. Click on the **`lists`** collection
5. Use the filter: `ownerId == YOUR_USER_ID`
6. Select all documents (use the checkbox at the top)
7. Click **Delete**

**Note**: If you have 10,825+ lists, the Firebase Console may be slow or unresponsive. Use Method 1 instead.

## Safety Features

- The app automatically ignores query results with more than 10 lists to prevent UI issues
- The cleanup function requires explicit confirmation before deleting
- Lists are deleted in batches to avoid overwhelming Firestore
- Progress is logged to the console

## After Cleanup

After cleaning up orphaned lists:
1. Refresh the app
2. You should see "No lists yet. Create your first list!"
3. Create a new list using the "Create New List" button
4. The app will now work normally

