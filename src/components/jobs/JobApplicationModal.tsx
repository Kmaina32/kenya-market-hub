
import React, { useState } from 'react';
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

interface JobApplicationModalProps {
  jobId: number;
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
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    coverLetter: '',
    experience: '',
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      if (file.type === 'application/pdf' || file.type.includes('document')) {
        setResumeFile(file);
      } else {
        toast.error('Please upload a PDF or document file');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // For now, we'll store the file name since we don't have storage bucket set up
      const resumeUrl = resumeFile ? resumeFile.name : null;
      
      const { error } = await supabase
        .from('job_applications')
        .insert({
          job_id: jobId,
          applicant_name: formData.fullName,
          applicant_email: formData.email,
          applicant_phone: formData.phone || null,
          cover_letter: formData.coverLetter,
          experience: formData.experience || null,
          resume_url: resumeUrl,
          status: 'pending'
        });

      if (error) throw error;
      
      toast.success('Application submitted successfully!');
      onClose();
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        coverLetter: '',
        experience: '',
      });
      setResumeFile(null);
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
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
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
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
              disabled={isSubmitting}
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
