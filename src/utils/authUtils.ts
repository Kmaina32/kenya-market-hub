
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
    // Check user role from user_roles table
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
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
