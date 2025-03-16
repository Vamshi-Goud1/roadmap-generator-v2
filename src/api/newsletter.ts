import axios from 'axios';

interface SubscriptionResponse {
  success: boolean;
  message: string;
}

export const subscribeToNewsletter = async (email: string): Promise<SubscriptionResponse> => {
  try {
    // You can replace this URL with your actual backend API endpoint
    const response = await axios.post('/api/newsletter/subscribe', { email });
    
    return {
      success: true,
      message: 'Successfully subscribed to the newsletter!'
    };
  } catch (error: any) {
    // Handle different types of errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const message = error.response.data?.message || 'Failed to subscribe. Please try again.';
      return {
        success: false,
        message
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        success: false,
        message: 'No response from server. Please check your connection.'
      };
    } else {
      // Something happened in setting up the request
      return {
        success: false,
        message: 'An error occurred. Please try again later.'
      };
    }
  }
}; 