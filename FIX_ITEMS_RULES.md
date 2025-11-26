# Fix Firestore Rules for Items

The current rules are blocking item queries. Update them in Firebase Console:

1. Go to: https://console.firebase.google.com/project/shopping-list-1bb2c/firestore/rules

2. **Replace ALL the rules with this:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /items/{itemId} {
      allow read: if request.auth != null && (
        resource.data.userId == request.auth.uid ||
        exists(/databases/$(database)/documents/lists/$(resource.data.listId)) &&
        (
          get(/databases/$(database)/documents/lists/$(resource.data.listId)).data.ownerId == request.auth.uid ||
          request.auth.token.email in get(/databases/$(database)/documents/lists/$(resource.data.listId)).data.sharedWith
        )
      );
      
      allow write: if request.auth != null && (
        resource.data.userId == request.auth.uid ||
        exists(/databases/$(database)/documents/lists/$(resource.data.listId)) &&
        (
          get(/databases/$(database)/documents/lists/$(resource.data.listId)).data.ownerId == request.auth.uid ||
          request.auth.token.email in get(/databases/$(database)/documents/lists/$(resource.data.listId)).data.sharedWith
        )
      );
      
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    
    match /lists/{listId} {
      allow read: if request.auth != null && resource.data.ownerId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.ownerId == request.auth.uid;
      allow update: if request.auth != null && resource.data.ownerId == request.auth.uid;
      allow delete: if request.auth != null && resource.data.ownerId == request.auth.uid;
    }
  }
}
```

3. Click **"Publish"**

4. Refresh your app

**Note:** The issue is that Firestore rules with complex conditions can block queries. The rules above separate `read` and `write` permissions explicitly.


