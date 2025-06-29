
import { useState, useCallback } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

interface ValidationSchema {
  [key: string]: ValidationRule;
}

export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  validationSchema: ValidationSchema
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback((name: string, value: any): string | null => {
    const rule = validationSchema[name];
    if (!rule) return null;

    if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return `${name} is required`;
    }

    if (typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        return `${name} must be at least ${rule.minLength} characters`;
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        return `${name} must not exceed ${rule.maxLength} characters`;
      }

      if (rule.pattern && !rule.pattern.test(value)) {
        return `${name} format is invalid`;
      }
    }

    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  }, [validationSchema]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    
    Object.keys(validationSchema).forEach(field => {
      const error = validateField(field, values[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validateField, validationSchema]);

  const handleChange = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleBlur = useCallback((name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, values[name]);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [values, validateField]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    reset,
    isValid: Object.keys(errors).length === 0
  };
};
