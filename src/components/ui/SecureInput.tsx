
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { sanitizeHtml } from '@/utils/validation';
import { cn } from '@/lib/utils';

interface SecureInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  sanitize?: boolean;
  maxLength?: number;
  allowedChars?: RegExp;
  preventXSS?: boolean;
  validateSqlInjection?: boolean;
}

export const SecureInput: React.FC<SecureInputProps> = ({
  sanitize = true,
  maxLength = 1000,
  allowedChars,
  preventXSS = true,
  validateSqlInjection = true,
  onChange,
  className,
  ...props
}) => {
  const [hasSecurityWarning, setHasSecurityWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    let warning = '';
    
    // Check for XSS patterns
    if (preventXSS) {
      const xssPatterns = [
        /<script[^>]*>.*?<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<iframe/gi,
        /<object/gi,
        /<embed/gi,
        /data:text\/html/gi,
        /vbscript:/gi,
        /expression\s*\(/gi
      ];
      
      const hasXSS = xssPatterns.some(pattern => pattern.test(value));
      if (hasXSS) {
        warning = 'Potentially malicious content detected and blocked';
      }
    }
    
    // Check for SQL injection patterns
    if (validateSqlInjection) {
      const sqlPatterns = [
        /('|(\\')|(;)|(\\;)|(')|(\\'))/gi,
        /\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b/gi,
        /(--)|(\/\*)|(\*\/)/gi,
        /\bor\b\s+\b\d+\s*=\s*\d+/gi,
        /\band\b\s+\b\d+\s*=\s*\d+/gi
      ];
      
      const hasSQLInjection = sqlPatterns.some(pattern => pattern.test(value));
      if (hasSQLInjection && !warning) {
        warning = 'Potentially unsafe database query detected';
      }
    }
    
    // Apply sanitization if enabled
    if (sanitize && (warning || preventXSS)) {
      value = sanitizeHtml(value);
    }
    
    // Apply character restrictions
    if (allowedChars && !allowedChars.test(value)) {
      return; // Don't update if characters aren't allowed
    }
    
    // Apply max length
    if (value.length > maxLength) {
      value = value.substring(0, maxLength);
      if (!warning) warning = `Input truncated to ${maxLength} characters`;
    }
    
    setHasSecurityWarning(!!warning);
    setWarningMessage(warning);
    
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value
      }
    };
    
    onChange?.(syntheticEvent);
  };

  return (
    <div className="space-y-1">
      <Input
        {...props}
        onChange={handleChange}
        className={cn(
          className,
          hasSecurityWarning && "border-red-500 focus:border-red-500 focus:ring-red-500"
        )}
      />
      {hasSecurityWarning && warningMessage && (
        <p className="text-xs text-red-600 font-medium">
          {warningMessage}
        </p>
      )}
    </div>
  );
};
