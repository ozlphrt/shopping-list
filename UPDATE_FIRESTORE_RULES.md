# How to Update Firestore Rules

The Firestore security rules need to be updated in the Firebase Console to allow public access.

## Steps:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **shopping-list-1bb2c**
3. Click on **Firestore Database** in the left sidebar
4. Click on the **Rules** tab at the top
5. Replace the existing rules with:

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

6. Click **Publish** to save the changes

## Important Security Note:

These rules allow **anyone** to read and write to your Firestore database. Since this is just for you and your wife, this should be fine, but be aware that anyone with the app URL can access your shopping list.

If you want to restrict access later, you can:
- Add authentication back
- Use Firebase App Check
- Or restrict by IP/domain

