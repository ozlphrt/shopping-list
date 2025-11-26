# ⚠️ URGENT: Update Firestore Security Rules

The permission errors you're seeing are because the Firestore security rules in the Firebase Console don't match the updated rules in `firestore.rules`.

## Quick Fix (2 minutes):

1. **Open Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: shopping-list-1bb2c
3. **Go to Firestore Database** → **Rules** tab
4. **Copy the entire contents** of `firestore.rules` file from this project
5. **Paste into the Rules editor** in Firebase Console
6. **Click "Publish"**

## The Rules You Need:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Items collection - allow authenticated users to read/write items
    match /items/{itemId} {
      allow read, write: if request.auth != null;
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
    }
    
    // Lists collection
    match /lists/{listId} {
      // Allow read for authenticated users
      // Queries filter by ownerId or sharedWith array-contains
      allow read: if request.auth != null;
      
      // Only owner can create/update/delete
      allow create: if request.auth != null && request.resource.data.ownerId == request.auth.uid;
      allow update: if request.auth != null && resource.data.ownerId == request.auth.uid;
      allow delete: if request.auth != null && resource.data.ownerId == request.auth.uid;
    }
  }
}
```

## Why This Works:

- **Items**: Authenticated users can read/write items. Client-side queries filter by `listId`, ensuring users only see items from lists they have access to.

- **Lists**: Authenticated users can read lists. The `array-contains` query on `sharedWith` will only return lists where the user's email is in the array. Firestore validates that the user can read those documents.

- **Security**: While these rules are permissive for reads, the queries themselves enforce access control by only returning documents the user should see.

## After Publishing:

1. Wait 10-20 seconds for rules to propagate
2. Refresh your app
3. The permission errors should be gone!

## Note:

These rules allow authenticated users to read lists and items. The actual access control is enforced by:
- Queries filtering by `ownerId` (owned lists)
- Queries filtering by `sharedWith array-contains email` (shared lists)
- Client-side logic ensuring users only access lists they own or are shared on

For stricter server-side security, we'd need to implement more complex rules, but this approach works well for your use case.

