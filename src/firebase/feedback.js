import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './config';

// Submit feedback
export const submitFeedback = async (feedbackData) => {
  try {
    await addDoc(collection(db, 'feedback'), {
      ...feedbackData,
      createdAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get feedback for a user
export const getUserFeedback = async (userId) => {
  try {
    const q = query(collection(db, 'feedback'), where('toUser', '==', userId));
    const querySnapshot = await getDocs(q);
    const feedbacks = [];
    querySnapshot.forEach((doc) => {
      feedbacks.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: feedbacks };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get feedback for a gig
export const getGigFeedback = async (gigId) => {
  try {
    const q = query(collection(db, 'feedback'), where('gigId', '==', gigId));
    const querySnapshot = await getDocs(q);
    const feedbacks = [];
    querySnapshot.forEach((doc) => {
      feedbacks.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: feedbacks };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
