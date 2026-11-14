import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../services/firebase';
import { firestoreService } from '../services/firestoreService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isConfigured] = useState(isFirebaseConfigured());

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Learner',
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Learner',
          photoURL: firebaseUser.photoURL,
        };
        setUser(userData);
        try {
          await firestoreService.saveUserProfile(firebaseUser);
        } catch (e) {
          console.warn("User profile sync skipped:", e.message);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email, password, displayName) => {
    if (!auth) throw new Error("Firebase Auth is not configured. Please check your .env file.");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    await firestoreService.saveUserProfile(userCredential.user, { displayName });
    return userCredential.user;
  };

  const login = async (email, password) => {
    if (!auth) throw new Error("Firebase Auth is not configured. Please check your .env file.");
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  const loginWithGoogle = async () => {
    if (!auth || !googleProvider) throw new Error("Firebase Google Auth is not configured.");
    const result = await signInWithPopup(auth, googleProvider);
    await firestoreService.saveUserProfile(result.user);
    return result.user;
  };

  const logout = async () => {
    if (auth) {
      await signOut(auth);
    }
    setUser(null);
    sessionStorage.removeItem("currentRoadmap");
    sessionStorage.removeItem("pendingAction");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isConfigured,
        signup,
        login,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
