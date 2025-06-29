
import { toast } from 'sonner';
import { PostgrestError } from '@supabase/supabase-js';

interface ErrorHandlerOptions {
  showToast?: boolean;
  customMessage?: string;
  onError?: (error: any) => void;
}

export const useErrorHandler = () => {
  const handleError = (error: any, options: ErrorHandlerOptions = {}) => {
    const { showToast = true, customMessage, onError } = options;
    
    console.error('Error occurred:', error);
    
    let message = customMessage || 'An unexpected error occurred';
    
    // Handle Supabase PostgrestError
    if (error && typeof error === 'object' && 'message' in error) {
      const pgError = error as PostgrestError;
      
      // Map common database errors to user-friendly messages
      switch (pgError.code) {
        case '23505': // unique_violation
          message = 'This item already exists';
          break;
        case '23503': // foreign_key_violation
          message = 'Referenced item not found';
          break;
        case '23514': // check_violation
          message = 'Invalid data provided';
          break;
        case '42501': // insufficient_privilege
          message = 'You do not have permission to perform this action';
          break;
        default:
          message = pgError.message || message;
      }
    }
    
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      message = 'Network error. Please check your connection and try again.';
    }
    
    if (showToast) {
      toast.error(message);
    }
    
    if (onError) {
      onError(error);
    }
    
    return message;
  };

  const handleSuccess = (message: string = 'Operation completed successfully') => {
    toast.success(message);
  };

  return {
    handleError,
    handleSuccess
  };
};
