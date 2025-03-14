// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, signOut } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3V2ytsA5ud91kbk-xc3pfex4KrgmfXss",
  authDomain: "focusflow-43e1a.firebaseapp.com",
  projectId: "focusflow-43e1a",
  storageBucket: "focusflow-43e1a.firebasestorage.app",
  messagingSenderId: "690461926461",
  appId: "1:690461926461:web:ae6d51f602873dc9df3654"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});


const db = getFirestore(app);

export { auth, db };