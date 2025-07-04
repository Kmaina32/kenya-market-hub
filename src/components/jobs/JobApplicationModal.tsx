import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface JobApplicationModalProps {
  jobId: number; // Based on your DB schema, job_id is INTEGER
  jobTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

const JobApplicationModal: React.FC<JobApplicationModalProps> = ({
  jobId,
  jobTitle,
  isOpen,
  onClose,
}) => {
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: user?.email || '',
    phone: '',
    coverLetter: '',
    experience: '',
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.email && formData.email === '') {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
  }, [user, formData.email]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const acceptedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (acceptedTypes.includes(file.type)) {
        if (file.size <= 5 * 1024 * 1024) {
          setResumeFile(file);
        } else {
          toast.error('File size exceeds 5MB limit.');
        }
      } else {
        toast.error('Please upload a PDF, DOC, or DOCX file.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!user) {
      toast.error('You must be logged in to apply for a job.');
      setIsSubmitting(false);
      return;
    }
    if (!resumeFile) {
        toast.error('Please upload your resume/CV.');
        setIsSubmitting(false);
        return;
    }

    try {
      let resumeUrl: string | null = null;

      // In a production app, you would upload the file to Supabase Storage here.
      // Example:
      /*
      const filePath = `${user.id}/${jobId}/${resumeFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes') // Your Supabase storage bucket name for resumes
        .upload(filePath, resumeFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Error uploading resume:', uploadError.message);
        throw new Error('Failed to upload resume. Please try again.');
      }
      resumeUrl = supabase.storage.from('resumes').getPublicUrl(filePath).data.publicUrl;
      */
      
      // Fallback to filename for now (as per original code logic)
      resumeUrl = resumeFile.name;


      // FIX: Insert into job_applications table according to its ACTUAL schema (applicant_id, job_id, resume_url, cover_letter, status)
      // IMPORTANT: The TypeScript error indicates your local generated types expect applicant_name/email/phone.
      // The database schema (from your migration file) DOES NOT have these columns.
      // The true fix is to regenerate your Supabase types after deploying the RPC function.
      // For now, we'll use a @ts-ignore to bypass the type error and insert correctly according to DB schema.
      // If you WANT to store full name, email, phone, experience for applications,
      // you MUST create a new Supabase migration to ALTER TABLE public.job_applications and ADD these columns.
      // @ts-ignore
      const { error } = await supabase
        .from('job_applications')
        .insert({
          job_id: jobId, // This is `number` in DB, matching props
          applicant_id: user.id, // This is `UUID` in DB, matching user.id
          resume_url: resumeUrl,
          cover_letter: formData.coverLetter,
          status: 'pending',
          // DO NOT INSERT THESE UNLESS YOU ADD THEM TO YOUR DB SCHEMA VIA MIGRATION:
          // applicant_name: formData.fullName,
          // applicant_email: formData.email,
          // applicant_phone: formData.phone || null,
          // experience: formData.experience || null,
        });

      if (error) throw error;
      
      toast.success('Application submitted successfully!');
      onClose();
      
      // Reset form
      setFormData({
        fullName: '',
        email: user.email || '',
        phone: '',
        coverLetter: '',
        experience: '',
      });
      setResumeFile(null);
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast.error(error.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply for {jobTitle}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="border-orange-200 focus:border-orange-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="border-orange-200 focus:border-orange-400"
                disabled={!!user}
              />
              {user && <p className="text-xs text-gray-500">Your email is pre-filled.</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              className="border-orange-200 focus:border-orange-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Relevant Experience</Label>
            <Textarea
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              placeholder="Briefly describe your relevant work experience..."
              className="border-orange-200 focus:border-orange-400 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter *</Label>
            <Textarea
              id="coverLetter"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleInputChange}
              placeholder="Write a compelling cover letter explaining why you're perfect for this role..."
              required
              className="border-orange-200 focus:border-orange-400 min-h-[150px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume">Resume/CV *</Label>
            <div className="flex items-center gap-4">
              <Input
                id="resume"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                required
                className="border-orange-200 focus:border-orange-400"
              />
              {resumeFile && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <FileText className="h-4 w-4" />
                  <span>{resumeFile.name}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Accepted formats: PDF, DOC, DOCX (Max 5MB)
            </p>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || authLoading}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationModal;