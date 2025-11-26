# How to Get Firebase Config

## Step-by-Step Instructions

### 1. Go to Firebase Console
Open https://console.firebase.google.com/ in your browser

### 2. Select Your Project
- Click on your existing project, OR
- Click "Add project" to create a new one

### 3. Open Project Settings
- Look for the **gear icon** ⚙️ (usually top left, next to "Project Overview")
- Click it → Select **"Project settings"**

### 4. Find Your Apps Section
- Scroll down to the section called **"Your apps"**
- You'll see icons for different platforms (iOS, Android, Web)

### 5. Add Web App (if not already added)
- Click the **Web icon** (`</>` or `</> </>`)
- A popup will appear asking for an app nickname
- Enter: **"Shopping List"** (or any name)
- Check "Also set up Firebase Hosting" is **unchecked** (we don't need it)
- Click **"Register app"**

### 6. Copy the Config
You'll see a code block that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 7. Copy Each Value
Copy these 6 values:
- `apiKey` → goes to `VITE_FIREBASE_API_KEY`
- `authDomain` → goes to `VITE_FIREBASE_AUTH_DOMAIN`
- `projectId` → goes to `VITE_FIREBASE_PROJECT_ID`
- `storageBucket` → goes to `VITE_FIREBASE_STORAGE_BUCKET`
- `messagingSenderId` → goes to `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `appId` → goes to `VITE_FIREBASE_APP_ID`

### 8. Paste into .env.local
1. Copy `env.template` to `.env.local`
2. Paste each value after the `=` sign

Example:
```env
VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

## Alternative: If You Already Have a Web App

If you already registered a web app:
1. Go to Project Settings
2. Scroll to "Your apps"
3. Click on your existing web app
4. You'll see the config values there

## Quick Visual Guide

```
Firebase Console
  └─ Your Project
      └─ ⚙️ Gear Icon
          └─ Project settings
              └─ Scroll down to "Your apps"
                  └─ Click Web icon </>
                      └─ Register app
                          └─ Copy config values
```

That's it! Once you have the config in `.env.local`, restart your dev server.


