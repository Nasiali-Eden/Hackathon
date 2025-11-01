import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Gig operations
export const createGig = async (gigData) => {
  const gigRef = await addDoc(collection(db, 'gigs'), {
    ...gigData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    status: 'open',
    applicants: [],
    selectedApplicant: null
  });
  return gigRef.id;
};

export const getGig = async (gigId) => {
  const gigDoc = await getDoc(doc(db, 'gigs', gigId));
  if (gigDoc.exists()) {
    const data = gigDoc.data();
    // Convert Firestore timestamps to ISO strings
    if (data.createdAt?.toDate) {
      data.createdAt = data.createdAt.toDate().toISOString();
    }
    if (data.updatedAt?.toDate) {
      data.updatedAt = data.updatedAt.toDate().toISOString();
    }
    return { id: gigDoc.id, ...data };
  }
  return null;
};

export const getGigs = async (filters = {}) => {
  let q = query(collection(db, 'gigs'));
  
  if (filters.status) {
    q = query(q, where('status', '==', filters.status));
  }
  
  if (filters.providerId) {
    q = query(q, where('providerId', '==', filters.providerId));
  }
  
  if (filters.category) {
    q = query(q, where('category', '==', filters.category));
  }
  
  if (filters.location) {
    q = query(q, where('location', '==', filters.location));
  }
  
  q = query(q, orderBy('createdAt', 'desc'));
  
  if (filters.limit) {
    q = query(q, limit(filters.limit));
  }
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt
  }));
};

export const updateGig = async (gigId, updates) => {
  await updateDoc(doc(db, 'gigs', gigId), {
    ...updates,
    updatedAt: serverTimestamp()
  });
};

export const deleteGig = async (gigId) => {
  await deleteDoc(doc(db, 'gigs', gigId));
};

// Application operations
export const applyToGig = async (gigId, applicantId, applicationData) => {
  const gig = await getGig(gigId);
  if (!gig) throw new Error('Gig not found');
  
  const applicants = gig.applicants || [];
  if (applicants.includes(applicantId)) {
    throw new Error('Already applied to this gig');
  }
  
  await updateDoc(doc(db, 'gigs', gigId), {
    applicants: [...applicants, applicantId]
  });
  
  // Create application document
  await addDoc(collection(db, 'applications'), {
    gigId,
    applicantId,
    status: 'pending',
    ...applicationData,
    appliedAt: serverTimestamp()
  });
};

export const getApplicationsByGig = async (gigId) => {
  const q = query(
    collection(db, 'applications'),
    where('gigId', '==', gigId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    appliedAt: doc.data().appliedAt?.toDate?.()?.toISOString() || doc.data().appliedAt
  }));
};

export const getApplicationsByUser = async (userId) => {
  const q = query(
    collection(db, 'applications'),
    where('applicantId', '==', userId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    appliedAt: doc.data().appliedAt?.toDate?.()?.toISOString() || doc.data().appliedAt
  }));
};

export const updateApplication = async (applicationId, updates) => {
  await updateDoc(doc(db, 'applications', applicationId), {
    ...updates,
    updatedAt: serverTimestamp()
  });
};

