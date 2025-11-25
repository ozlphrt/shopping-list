# Grocery Shopping List App

**Version:** 1.0.0  
**Type:** PWA (Progressive Web App)  
**Platform:** Mobile-first, cross-platform

## Purpose
Real-time shared grocery shopping list app for couples/families. Enables simultaneous collaboration where one person can shop while another adds items from home.

## Core Features
- **Real-time synchronization** via Firebase Firestore
- **Google Sign-In** authentication
- **Item management**: Name, quantity, category, notes
- **Status tracking**: Checkbox to mark items as picked (stays visible, grayed out)
- **Automatic sharing**: Single shared list for all authenticated users
- **Organization**: Two sections (Needed/Picked) with category grouping
- **Standard features**: Add, edit, delete items; clear all picked items

## Technical Stack
- **Frontend**: React + Vite
- **Backend**: Firebase (Firestore + Authentication)
- **Real-time**: Firestore real-time listeners
- **PWA**: Service Worker + Web App Manifest
- **Styling**: CSS (mobile-first, responsive)

## User Flow
1. User signs in with Google
2. Sees shared list with two sections: "Needed" and "Picked"
3. Items grouped by category within each section
4. Can add new items (name, quantity, category, notes)
5. Can mark items as picked (checkbox)
6. Can edit/delete items
7. Can clear all picked items
8. Changes sync in real-time across all devices

## Data Structure
```
items/{itemId}
  - name: string
  - quantity: string
  - category: string
  - notes: string
  - picked: boolean
  - createdAt: timestamp
  - updatedAt: timestamp
  - createdBy: string (userId)
```

## Deployment
- Firebase Hosting (recommended)
- Or any static hosting with PWA support

