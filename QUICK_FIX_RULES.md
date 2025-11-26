# Quick Fix: Update Firestore Rules

## Direct Link:
Go to: https://console.firebase.google.com/project/shopping-list-1bb2c/firestore/rules

## Steps:

1. **Open the link above** (or go to Firebase Console → Your Project → Firestore Database → Rules tab)

2. **You should see rules that look like this:**
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /items/{itemId} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

3. **Replace ALL of it with this:**
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /items/{itemId} {
         allow read, write: if true;
       }
     }
   }
   ```

4. **Click the "Publish" button** (usually at the top right)

5. **Wait a few seconds** for the rules to deploy

6. **Refresh your app** - the error should be gone!

## What Changed?
- Changed `if request.auth != null` to `if true`
- This allows anyone to read/write (no authentication required)


