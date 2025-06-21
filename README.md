# DreamSpace App - Expo + Firebase (Full Production Setup)

Welcome to the **DreamSpace** mobile app! This project is a fully working production-grade Expo Router + Firebase app designed for dream journaling, mood tracking, and analytics.

---

## 🚀 Features

* Full authentication (signup/login/logout) with persistent sessions using Firebase Auth + AsyncStorage
* Dream journaling with title, description, mood selection
* Monthly mood analytics with pie and line charts
* Realtime Database backend (structured per user)
* Firebase-safe CRUD operations
* Clean Expo Router structure with dynamic routing
* Fully responsive and styled for mobile

---

## 📂 Project Structure

```
├── app/
│   ├── (auth)/
│   │   ├── login.jsx
│   │   └── signup.jsx
│   ├── (tabs)/
│   │   ├── observatory.jsx
│   │   ├── analytics.jsx
│   │   └── profile.jsx
│   └── index.jsx
│
├── src/
│   ├── api/
│   │   └── firebase.js
│   ├── components/
│   │   ├── ObservatoryCard.jsx
│   │   ├── ObservatoryModal.jsx
│   │   ├── LinkedInput.jsx
│   │   ├── LinkedButton.jsx
│   │   └── MoodSelector.jsx
│   └── config/
│       └── firebaseConfig.js
│
├── app.json (or app.config.js)
└── package.json
```

---

## 🔑 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** -> Email/Password
4. Create a **Realtime Database** and set rules:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```

5. Copy your Firebase config keys into `/src/config/firebaseConfig.js`:

```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  databaseURL: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
  measurementId: "..."
};
```

---

## ⚙ Firebase Persistence (React Native Fix)

We use:

```javascript
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
```

✅ This ensures login sessions survive full app restarts.

---

## 📦 Install Dependencies

```bash
npm install

# or

yarn install
```

---

## 🧪 Running the App

```bash
npx expo start
```

---


## 🔥 Built With

* Expo (Managed Workflow)
* Expo Router
* Firebase (v9 Modular SDK)
* Realtime Database
* React Native Chart Kit
* AsyncStorage

---

## 💡 Future Improvements

* Password reset flow
* Profile management
* Notifications (Expo push)
* Daily reminders
* Exporting data
* Custom themes
