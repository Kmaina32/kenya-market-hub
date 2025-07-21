
import { supabase } from '@/integrations/supabase/client';

export const checkUserRole = async (userId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.rpc('get_current_user_role');
    
    if (error) {
      console.error('Error checking user role:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in checkUserRole:', error);
    return null;
  }
};

export const isUserAdmin = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('is_admin', { check_user_id: userId });
    
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error in isUserAdmin:', error);
    return false;
  }
};

export const validateInput = (input: string, maxLength: number = 255): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Basic XSS prevention - strip HTML tags
  const sanitized = input.replace(/<[^>]*>/g, '');
  
  // Trim and limit length
  return sanitized.trim().substring(0, maxLength);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,15}$/;
  return phoneRegex.test(phone);
};

export const sanitizeUserInput = (input: any): any => {
  if (typeof input === 'string') {
    return validateInput(input);
  }
  if (Array.isArray(input)) {
    return input.map(sanitizeUserInput);
  }
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[validateInput(key, 50)] = sanitizeUserInput(value);
    }
    return sanitized;
  }
  return input;
};
