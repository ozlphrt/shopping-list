# Shopping List App

Real-time shared grocery shopping list PWA built with React, TypeScript, Vite, and Firebase.

## Features

- ✅ Real-time synchronization via Firebase Firestore
- ✅ Google Sign-In authentication
- ✅ Add items with name, quantity, category, and notes
- ✅ Mark items as picked (checkbox)
- ✅ Edit and delete items
- ✅ Clear all picked items
- ✅ Two sections: "Needed" and "Picked" with category grouping
- ✅ Mobile-first PWA design
- ✅ Offline support

## Setup (3 Simple Steps)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create one)
3. Click ⚙️ → **Project settings** → Scroll to **Your apps** → Click **Web** icon
4. Register app → Copy the config values
5. Create `.env.local` file with your config (copy `env.template` and fill in values)
6. Enable **Authentication** → **Google Sign-In**
7. Create **Firestore Database** → **Test mode**

### 3. Run the App

```bash
npm run dev
```

Open http://localhost:5173

**That's it!** See `SIMPLE_SETUP.md` for detailed instructions.

## Firebase Configuration

### Firestore Security Rules

After creating the database, update the rules in Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /items/{itemId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

This ensures only authenticated users can read/write items.

## Project Structure

```
src/
├── components/      # React components
├── config/         # Firebase configuration
├── hooks/          # Custom React hooks
├── types/          # TypeScript types
└── App.tsx         # Main app component
```

## PWA Features

The app is configured as a PWA with:
- Service worker for offline support
- Web app manifest
- Install prompt

To install on mobile:
- iOS: Share → Add to Home Screen
- Android: Browser menu → Install app

## License

MIT

