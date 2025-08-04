
import { z } from 'zod';

// Input validation schemas
export const emailSchema = z.string().email('Invalid email format');

export const phoneSchema = z.string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
  .optional();

export const userInputSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: emailSchema,
  phone: phoneSchema,
});

export const productSchema = z.object({
  name: z.string()
    .min(3, 'Product name must be at least 3 characters')
    .max(200, 'Product name must be less than 200 characters'),
  description: z.string()
    .max(2000, 'Description must be less than 2000 characters')
    .optional(),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string()
    .max(1000, 'Comment must be less than 1000 characters')
    .optional(),
});

export const forumPostSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be less than 200 characters'),
  content: z.string()
    .min(10, 'Content must be at least 10 characters')
    .max(10000, 'Content must be less than 10000 characters'),
});

// HTML sanitization function
export const sanitizeHtml = (input: string): string => {
  // Remove script tags and dangerous attributes
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/<iframe/gi, '&lt;iframe')
    .replace(/<object/gi, '&lt;object')
    .replace(/<embed/gi, '&lt;embed');
};

// File validation
export const validateFileUpload = (file: File, allowedTypes: string[], maxSizeMB: number = 10): boolean => {
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} is not allowed`);
  }
  
  if (file.size > maxSizeMB * 1024 * 1024) {
    throw new Error(`File size must be less than ${maxSizeMB}MB`);
  }
  
  return true;
};

// SQL injection prevention (additional layer)
export const sanitizeSqlInput = (input: string): string => {
  return input.replace(/['";\\]/g, '');
};
