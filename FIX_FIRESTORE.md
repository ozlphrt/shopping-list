# Fix Firestore Rules and Index

## Step 1: Update Firestore Rules

1. Go to: https://console.firebase.google.com/project/shopping-list-1bb2c/firestore/rules

2. **Replace ALL the rules with this:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
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

## Step 2: Create Firestore Index (if needed)

The error message includes a link to create the index. Click it, or:

1. Go to: https://console.firebase.google.com/project/shopping-list-1bb2c/firestore/indexes
2. Click "Create Index" if prompted
3. Wait for it to build (usually 1-2 minutes)

**Note:** I've updated the code to sort client-side, so the index may not be needed anymore. But if you see the error, click the link in the console to create it.

## Step 3: Refresh Your App

After updating rules, refresh the app and the errors should be gone!


