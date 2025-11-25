# Technical Setup

## Prerequisites
- Node.js 18+ and npm
- Firebase account (existing)

## Project Structure
```
shopping-list/
├── public/
│   ├── manifest.json
│   └── icons/
├── src/
│   ├── components/
│   │   ├── Auth.tsx
│   │   ├── ItemForm.tsx
│   │   ├── ItemCard.tsx
│   │   └── ItemList.tsx
│   ├── config/
│   │   └── firebase.ts
│   ├── hooks/
│   │   └── useItems.ts
│   ├── types/
│   │   └── item.ts
│   ├── App.tsx
│   └── main.tsx
├── firebase.json
├── .firebaserc
├── package.json
└── vite.config.ts
```

## Firebase Configuration

### 1. Create Firebase Project
1. Go to Firebase Console
2. Create new project (or use existing)
3. Enable Authentication → Google Sign-In
4. Create Firestore database (start in test mode, then update rules)

### 2. Get Firebase Config
1. Firebase Console → Project Settings → Your apps → Web icon
2. Register app → Copy config values

### 3. Firestore Rules
After creating database, update rules in Firebase Console → Firestore → Rules:
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

## Installation Steps
1. `npm create vite@latest . -- --template react-ts`
2. `npm install`
3. `npm install firebase`
4. Configure Firebase in `src/config/firebase.ts`
5. `npm run dev` to start development server

## Environment Variables
Create `.env.local`:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## PWA Configuration
- Manifest: `public/manifest.json`
- Service Worker: Vite PWA plugin or custom
- Icons: Generate at least 192x192 and 512x512

