import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDBfMUCgGCqATGpSz1w0f-Yf3oWvWZ9Z1U",
  authDomain: "flower-db052.firebaseapp.com",
  projectId: "flower-db052",
  storageBucket: "flower-db052.firebasestorage.app",
  messagingSenderId: "794575781834",
  appId: "1:794575781834:web:56bd1828f2589b6fd6d933"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user; 
  } catch (error) {
    console.error("Google Giriş Hatası:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Çıkış Hatası:", error);
  }
};