import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import React, { useEffect, useMemo, useState } from 'react';
import { auth } from '../config/firebase.config';
import { AuthContext } from '../contexts/AuthContext';

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create User
  const createUser = async (email, password) => {
    setLoading(true);
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  // Sign In with Email & Password
  const signInUser = async (email, password) => {
    setLoading(true);
    return await signInWithEmailAndPassword(auth, email, password);
  };

  // Google Sign In
  const googleSignIn = async () => {
    setLoading(true);
    return await signInWithPopup(auth, googleProvider);
  };

  // Update User Profile
  const updateUserProfile = (profile) => {
    return updateProfile(auth.currentUser, profile);
  };

  // Forgot User Password
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Sign Out User
  const signOutUser = async () => {
    setLoading(true);
    return signOut(auth);
  };

  // Firebase Auth Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Memorize Context Value - (avoid unnecessary re-renders)
  const authInfo = useMemo(
    () => ({
      createUser,
      signInUser,
      googleSignIn,
      updateUserProfile,
      resetPassword,
      signOutUser,
      user,
      loading,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
