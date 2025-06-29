
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  maxFiles?: number;
  className?: string;
}

const ImageUpload = ({ 
  onFilesSelected, 
  multiple = true, 
  accept = "image/*",
  maxFiles = 5,
  className = ""
}: ImageUploadProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive"
      });
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        return false;
      }
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is too large. Maximum size is 5MB.`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    });

    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid file type",
        description: "Only image files under 5MB are allowed",
        variant: "destructive"
      });
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        className="w-full"
      >
        <Upload className="h-4 w-4 mr-2" />
        Upload Images
      </Button>
    </div>
  );
};

export default ImageUpload;
