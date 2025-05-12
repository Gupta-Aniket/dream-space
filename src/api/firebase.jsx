

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, db } from '../config/firebaseConfig';

// ** Sign Up User: **
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // On successful sign-up, create a new node for this user in the database
    const userRef = ref(db, 'users/' + user.uid);
    await set(userRef, {
      email: user.email,
      dreams: [],  // Initialize with an empty dreams list
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
  try {
    await signOut(auth);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ** Get Current User: **
export const getCurrentUser = () => {
  return auth.currentUser;  // Returns the current authenticated user (if any)
};