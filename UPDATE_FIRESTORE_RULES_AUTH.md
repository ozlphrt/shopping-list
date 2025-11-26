# Update Firestore Rules for Authentication

## Quick Fix:

1. Go to: https://console.firebase.google.com/project/shopping-list-1bb2c/firestore/rules

2. **Replace ALL the rules with this:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Items collection - users can read/write items in lists they own or are shared with
    match /items/{itemId} {
      allow read, write: if request.auth != null && (
        resource.data.userId == request.auth.uid ||
        exists(/databases/$(database)/documents/lists/$(resource.data.listId)) &&
        (
          get(/databases/$(database)/documents/lists/$(resource.data.listId)).data.ownerId == request.auth.uid ||
          request.auth.token.email in get(/databases/$(database)/documents/lists/$(resource.data.listId)).data.sharedWith
        )
      );
      
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    
    // Lists collection - users can read lists they own or are shared with, only owners can write
    match /lists/{listId} {
      allow read: if request.auth != null && (
        resource.data.ownerId == request.auth.uid ||
        request.auth.token.email in resource.data.sharedWith
      );
      
      allow create: if request.auth != null && request.resource.data.ownerId == request.auth.uid;
      
      allow update: if request.auth != null && resource.data.ownerId == request.auth.uid;
      
      allow delete: if request.auth != null && resource.data.ownerId == request.auth.uid;
    }
  }
}
```

3. Click **"Publish"** button

4. Wait a few seconds for rules to deploy

5. Refresh your app - the permission error should be gone!

## What These Rules Do:

- **Items**: Users can only read/write items in lists they own or are shared with
- **Lists**: Users can only read lists they own or are shared with
- **Security**: Only list owners can create, update, or delete lists


