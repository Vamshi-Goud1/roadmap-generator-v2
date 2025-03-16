import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface HistoryItem {
  id?: string;
  userId: string;
  type: 'roadmap' | 'keywords';
  query: string;
  data: any;
  timestamp: number;
}

export const addToHistory = async (item: Omit<HistoryItem, 'id' | 'timestamp'>): Promise<string> => {
  try {
    console.log('Starting to add to history:', item);
    const historyRef = collection(db, 'history');
    const docRef = await addDoc(historyRef, {
      ...item,
      timestamp: Date.now() // Use client-side timestamp temporarily
    });
    console.log('Successfully added to history with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding to history:', error);
    throw error;
  }
};

export const getUserHistory = async (userId: string): Promise<HistoryItem[]> => {
  try {
    console.log('Fetching history for user:', userId);
    const historyRef = collection(db, 'history');
    // Temporarily remove orderBy to avoid requiring an index
    const q = query(
      historyRef,
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    const history = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Ensure timestamp is a number
        timestamp: typeof data.timestamp === 'number' 
          ? data.timestamp 
          : data.timestamp?.toMillis?.() 
          || Date.now()
      } as HistoryItem;
    });

    // Sort on client side temporarily
    history.sort((a, b) => b.timestamp - a.timestamp);

    console.log('Fetched history:', history);
    return history;
  } catch (error) {
    console.error('Error in getUserHistory:', error);
    throw new Error('Failed to load history. Please try again.');
  }
};

export const deleteHistoryItem = async (id: string): Promise<void> => {
  try {
    console.log('Deleting history item:', id);
    const docRef = doc(db, 'history', id);
    await deleteDoc(docRef);
    console.log('Successfully deleted history item');
  } catch (error) {
    console.error('Error deleting history item:', error);
    throw error;
  }
}; 