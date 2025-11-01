import { collection, addDoc, doc, getDoc, getDocs, updateDoc, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from './config';

// Create a new gig
export const createGig = async (gigData) => {
  try {
    const docRef = await addDoc(collection(db, 'gigs'), {
      ...gigData,
      status: 'open', // 'open', 'claimed', 'completed'
      claimedBy: null,
      createdAt: new Date().toISOString()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get a single gig by ID
export const getGig = async (gigId) => {
  try {
    const docSnap = await getDoc(doc(db, 'gigs', gigId));
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    }
    return { success: false, error: 'Gig not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all gigs (with optional filter)
export const getAllGigs = async (category = null) => {
  try {
    let q = query(collection(db, 'gigs'), orderBy('createdAt', 'desc'));
    if (category) {
      q = query(q, where('category', '==', category));
    }
    
    const querySnapshot = await getDocs(q);
    const gigs = [];
    querySnapshot.forEach((doc) => {
      gigs.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: gigs };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Subscribe to gigs (real-time)
export const subscribeToGigs = (category, callback) => {
  let q = query(collection(db, 'gigs'), orderBy('createdAt', 'desc'));
  if (category) {
    q = query(q, where('category', '==', category));
  }
  
  return onSnapshot(q, (snapshot) => {
    const gigs = [];
    snapshot.forEach((doc) => {
      gigs.push({ id: doc.id, ...doc.data() });
    });
    callback(gigs);
  });
};

// Claim a gig
export const claimGig = async (gigId, userId) => {
  try {
    await updateDoc(doc(db, 'gigs', gigId), {
      status: 'claimed',
      claimedBy: userId
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update gig status
export const updateGigStatus = async (gigId, status) => {
  try {
    await updateDoc(doc(db, 'gigs', gigId), { status });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update gig (for editing)
export const updateGig = async (gigId, gigData) => {
  try {
    await updateDoc(doc(db, 'gigs', gigId), gigData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get user's gigs (posted or claimed)
export const getUserGigs = async (userId, type = 'all') => {
  try {
    let q;
    if (type === 'posted') {
      q = query(collection(db, 'gigs'), where('postedBy', '==', userId));
    } else if (type === 'claimed') {
      q = query(collection(db, 'gigs'), where('claimedBy', '==', userId));
    } else {
      // Get both posted and claimed
      const postedQuery = query(collection(db, 'gigs'), where('postedBy', '==', userId));
      const claimedQuery = query(collection(db, 'gigs'), where('claimedBy', '==', userId));
      
      const [postedSnapshot, claimedSnapshot] = await Promise.all([
        getDocs(postedQuery),
        getDocs(claimedQuery)
      ]);
      
      const gigs = [];
      postedSnapshot.forEach((doc) => {
        gigs.push({ id: doc.id, ...doc.data(), type: 'posted' });
      });
      claimedSnapshot.forEach((doc) => {
        gigs.push({ id: doc.id, ...doc.data(), type: 'claimed' });
      });
      
      return { success: true, data: gigs };
    }
    
    const querySnapshot = await getDocs(q);
    const gigs = [];
    querySnapshot.forEach((doc) => {
      gigs.push({ id: doc.id, ...doc.data(), type });
    });
    return { success: true, data: gigs };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
