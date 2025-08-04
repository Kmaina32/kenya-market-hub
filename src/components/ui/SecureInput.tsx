
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { sanitizeHtml } from '@/utils/validation';
import { cn } from '@/lib/utils';

interface SecureInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  sanitize?: boolean;
  maxLength?: number;
  allowedChars?: RegExp;
}

export const SecureInput: React.FC<SecureInputProps> = ({
  sanitize = true,
  maxLength = 1000,
  allowedChars,
  onChange,
  className,
  ...props
}) => {
  const [hasSecurityWarning, setHasSecurityWarning] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Check for suspicious content
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+=/i,
      /data:text\/html/i
    ];
    
    const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(value));
    setHasSecurityWarning(isSuspicious);
    
    // Apply sanitization if enabled
    if (sanitize) {
      value = sanitizeHtml(value);
    }
    
    // Apply character restrictions
    if (allowedChars && !allowedChars.test(value)) {
      return; // Don't update if characters aren't allowed
    }
    
    // Apply max length
    if (value.length > maxLength) {
      value = value.substring(0, maxLength);
    }
    
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
          hasSecurityWarning && "border-red-500 focus:border-red-500"
        )}
      />
      {hasSecurityWarning && (
        <p className="text-xs text-red-500">
          Potentially unsafe content detected and sanitized
        </p>
      )}
    </div>
  );
};
