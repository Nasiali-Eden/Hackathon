import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './config';

// Get user data
export const getUserData = async (userId) => {
  try {
    const docSnap = await getDoc(doc(db, 'users', userId));
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    }
    return { success: false, error: 'User not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update user data
export const updateUserData = async (userId, userData) => {
  try {
    await updateDoc(doc(db, 'users', userId), userData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
