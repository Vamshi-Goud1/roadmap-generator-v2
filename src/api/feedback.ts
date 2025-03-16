import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface FeedbackResponse {
  success: boolean;
  message: string;
}

export const submitFeedback = async (feedback: string): Promise<FeedbackResponse> => {
  try {
    const feedbackRef = collection(db, 'feedback');
    await addDoc(feedbackRef, {
      feedback,
      createdAt: serverTimestamp(),
      status: 'NEW'
    });
    
    return {
      success: true,
      message: 'Thank you for your feedback! We appreciate your input.'
    };
  } catch (error: any) {
    console.error('Error submitting feedback:', error);
    return {
      success: false,
      message: 'Failed to submit feedback. Please try again.'
    };
  }
}; 