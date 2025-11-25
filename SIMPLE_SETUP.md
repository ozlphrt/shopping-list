# Simple Setup - 3 Steps

## Step 1: Get Firebase Config (2 minutes)

See **`GET_FIREBASE_CONFIG.md`** for detailed step-by-step instructions with screenshots guide.

Quick version:
1. Go to https://console.firebase.google.com/
2. Click your project (or create one)
3. Click the gear icon ⚙️ → **Project settings**
4. Scroll down to **Your apps** section
5. Click the **Web** icon (`</>`)
6. Register app (name it "Shopping List")
7. Copy the 6 config values that appear

## Step 2: Create .env.local File

1. Copy `env.template` to `.env.local`
2. Fill in the values from Step 1

Or create `.env.local` manually and paste your Firebase config values.

## Step 3: Enable Google Sign-In & Create Database

1. In Firebase Console → **Authentication** → **Get started**
2. Go to **Sign-in method** tab → Enable **Google** → Save
3. Go to **Firestore Database** → **Create database** → **Test mode** → Choose location

## Done! 

Run `npm run dev` and open http://localhost:5173

That's it! No CLI needed.

