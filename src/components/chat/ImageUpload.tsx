
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Image, X, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  onRemoveImage: () => void;
  imageUrl?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  onRemoveImage,
  imageUrl
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `forum-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('hero-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('hero-images')
        .getPublicUrl(filePath);

      if (data.publicUrl) {
        onImageUpload(data.publicUrl);
        toast({
          title: 'Image uploaded',
          description: 'Your image has been uploaded successfully.',
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      // Reset the input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  return (
    <div className="space-y-3">
      {imageUrl ? (
        <div className="relative">
          <img
            src={imageUrl}
            alt="Post image"
            className="w-full max-h-48 sm:max-h-64 object-cover rounded-lg"
          />
          <Button
            variant="destructive"
            size="sm"
            onClick={onRemoveImage}
            className="absolute top-2 right-2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploading}
              className="cursor-pointer text-xs sm:text-sm"
              asChild
            >
              <span>
                {isUploading ? (
                  <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
                ) : (
                  <Image className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                )}
                {isUploading ? 'Uploading...' : 'Add Image'}
              </span>
            </Button>
          </label>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
