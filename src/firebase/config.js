import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcok2l4w1EboNzeNhGoCr1d1Pj3c23NqA",
  authDomain: "giglink-3a91d.firebaseapp.com",
  projectId: "giglink-3a91d",
  storageBucket: "giglink-3a91d.firebasestorage.app",
  messagingSenderId: "960069120135",
  appId: "1:960069120135:web:27a689ab12a65f63f08822"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
