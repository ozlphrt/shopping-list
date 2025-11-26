# Fix Items Disappearing Issue

## Problem
Items disappear when adding a second item. This is likely due to Firestore query/index issues.

## Solution 1: Update Firestore Rules

1. Go to: https://console.firebase.google.com/project/shopping-list-1bb2c/firestore/rules

2. **Replace ALL the rules with this:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /items/{itemId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow write: if request.auth != null && resource.data.userId == request.auth.uid;
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

## Solution 2: Check Browser Console

After updating rules, check the browser console for:
- "Adding item: ..." messages when you add items
- "Snapshot received: X documents" messages
- "Loaded X items" messages
- Any error messages

The console will show exactly what's happening with items.

## Solution 3: Verify Items in Firestore

1. Go to: https://console.firebase.google.com/project/shopping-list-1bb2c/firestore/data
2. Check the `items` collection
3. Verify that items have:
   - `listId` field matching your list ID
   - `userId` field matching your user ID
   - Both items should be visible

If items exist but aren't showing, it's a query/security rules issue.
If items don't exist, it's an item creation issue.


