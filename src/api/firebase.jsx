import {
  ref,
  set,
  get,
  update
} from 'firebase/database';
import { format } from 'date-fns';
import { auth, db } from '../config/firebaseConfig';
import { useRouter } from 'expo-router';

import {signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';



const getUserId = () => {
  const user = auth.currentUser;
  return user ? user.uid : null;
};

const getTodayDate = () => format(new Date(), 'yyyy-MM-dd');

export const signUp = async (name, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // On successful sign-up, create a new node for this user in the database
    const userRef = ref(db, 'users/' + user.uid);
    await set(userRef, {
      name: name,
      email: user.email,
      dreams: [], // Initialize with an empty dreams list
    });

    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};


// ** Log In User: **
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

// ** Log Out User: **
export const logout = async () => {
  const router = useRouter();
  console.log('Logging out...');

  try {
    await signOut(auth); // Sign out from Firebase
    await AsyncStorage.removeItem('user'); // Clear saved user data

    // Optional: Reset other stored items like mood data, authentication tokens, etc.
    // await AsyncStorage.clear(); // Use if you want to clear all stored data

    // Redirect to home or login screen after logout
    router.replace('./(auth)/login'); // Change this path based on your app's navigation structure
    return { success: true, error: null };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }
};

// ** Get Current User: **
export const getCurrentUser = () => {
  return auth.currentUser;  // Returns the current authenticated user (if any)
};

// 1. Check if there's a dream entry for today
export const getUserDataForToday = async () => {
  const userId = getUserId();
  if (!userId) return null;

  const today = getTodayDate();
  const dataRef = ref(db, `users/${userId}/dreams/${today}`);
  const snapshot = await get(dataRef);

  if (snapshot.exists()) {
    console.log('1. todays data:', snapshot.val());
    return snapshot.val();
  } else {
    console.log('1. no dream entry for today');
    return null;
  }
};

// 2. Get moods for the current month
export const getMonthlyAnalytics = async () => {
  const userId = getUserId();
  if (!userId) return null;

  const currentMonth = format(new Date(), 'yyyy-MM');
  const dataRef = ref(db, `users/${userId}/monthly_moods/${currentMonth}`);
  const snapshot = await get(dataRef);

  if (snapshot.exists()) {
    console.log('2. monthly data:', snapshot.val());
    return snapshot.val();
  } else {
    console.log('2. no monthly mood data found');
    return null;
  }
};

// 3. Add a dream and update mood tracking
export const addDream = async (title, description, mood) => {
  const userId = getUserId();
  if (!userId) return;

  const now = new Date();
  const today = format(now, 'yyyy-MM-dd');
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');

  const dreamRef = ref(db, `users/${userId}/dreams/${today}`);
  await set(dreamRef, {
    title,
    description,
    mood
  });
  console.log('3. dream added:', { title, description, mood });

  const dateKey = `${yyyy}-${mm}`;
  const dayKey = dd;
  const monthRef = ref(db, `users/${userId}/monthly_moods/${dateKey}`);
  const snapshot = await get(monthRef);

  if (snapshot.exists()) {
    console.log('3. monthly_moods entry exists, - try to update instead...');
    // await update(monthRef, {
    //   [dayKey]: { mood }
    // });

  } else {
    console.log('3. monthly_moods entry does not exist, creating...');
    await set(monthRef, {
      [dayKey]: { mood }
    });
    return true;
  }
};

// 4. Get all dreams for the current user
export const getAllDreams = async () => {
  const userId = getUserId();
  if (!userId) return [];

  const dataRef = ref(db, `users/${userId}/dreams`);
  const snapshot = await get(dataRef);

  if (snapshot.exists()) {
    console.log('4. all dreams:', snapshot.val());
    return snapshot.val();
  } else {
    console.log('4. no dreams found');
    return [];
  }
};

// 5. Get a specific dream by date
export const getDreamByDate = async (date) => {
  const userId = getUserId();
  if (!userId) return null;

  const dataRef = ref(db, `users/${userId}/dreams/${date}`);
  const snapshot = await get(dataRef);

  if (snapshot.exists()) {
    console.log('5. dream entry by date:', snapshot.val());
    return snapshot.val();
  } else {
    console.log('5. no dream entry found for date:', date);
    return null;
  }
};

// 6. Get mood count for the current month
export const getMonthlyMoodCount = async (monthParam) => {
  const userId = getUserId();
  if (!userId) return null;

  const month = monthParam || format(new Date(), 'yyyy-MM');
  const refPath = ref(db, `users/${userId}/monthly_moods/${month}`);
  const snapshot = await get(refPath);

  if (!snapshot.exists()) {
    console.log('No monthly moods found for count');
    return null;
  }

  const monthlyData = snapshot.val();
  const moodCount = {};
  const rawData = [];

  for (const day in monthlyData) {
    const mood = monthlyData[day].mood;
    moodCount[mood] = (moodCount[mood] || 0) + 1;
    rawData.push({ day, mood });
  }

  // Sort by ascending day (1–31)
  rawData.sort((a, b) => Number(a.day) - Number(b.day));

  console.log('Mood Count:', moodCount);
  console.log('Raw Mood Data:', rawData);

  return { moodCount, rawData };
};



// 7. Update a dream and its mood for a specific date
export const updateDream = async (date, title, description, mood) => {
  const userId = getUserId();
  if (!userId) return;

  const dreamRef = ref(db, `users/${userId}/dreams/${date}`);
  await set(dreamRef, { title, description, mood, date });
  console.log('7. dream updated:', { date, title, description, mood });

  const yyyyMM = date.slice(0, 7);
  const dd = date.slice(8, 10);

  const monthRef = ref(db, `users/${userId}/monthly_moods/${yyyyMM}`);
  const snapshot = await get(monthRef);

  if (snapshot.exists()) {
    console.log('7. monthly mood entry exists, updating...');
    await update(monthRef, {
      [dd]: { mood }
    });
  } else {
    console.log('7. monthly mood entry does not exist, creating...');
    await set(monthRef, {
      [dd]: { mood }
    });
  }
};
