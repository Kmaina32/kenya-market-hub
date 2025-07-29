
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Loader2 } from 'lucide-react';

interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  job_type: string;
  salary: string;
  company: string;
  created_at: string;
  category: string;
  status: string;
  posted_by: string;
  updated_at: string;
}

interface JobApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job | null;
}

const JobApplicationModal = ({ open, onOpenChange, job }: JobApplicationModalProps) => {
  const [formData, setFormData] = useState({
    applicant_name: '',
    applicant_email: '',
    applicant_phone: '',
    cover_letter: '',
    experience: '',
    resume_url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;
    
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('job_applications')
        .insert({
          job_id: job.id,
          ...formData
        });

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: "Your job application has been submitted successfully!"
      });

      // Reset form
      setFormData({
        applicant_name: '',
        applicant_email: '',
        applicant_phone: '',
        cover_letter: '',
        experience: '',
        resume_url: ''
      });

      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply for {job.title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.applicant_name}
                onChange={(e) => handleInputChange('applicant_name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.applicant_email}
                onChange={(e) => handleInputChange('applicant_email', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.applicant_phone}
              onChange={(e) => handleInputChange('applicant_phone', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="experience">Work Experience</Label>
            <Textarea
              id="experience"
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              placeholder="Briefly describe your relevant work experience..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="resume">Resume URL</Label>
            <Input
              id="resume"
              value={formData.resume_url}
              onChange={(e) => handleInputChange('resume_url', e.target.value)}
              placeholder="Link to your resume (Google Drive, Dropbox, etc.)"
            />
          </div>

          <div>
            <Label htmlFor="cover_letter">Cover Letter *</Label>
            <Textarea
              id="cover_letter"
              value={formData.cover_letter}
              onChange={(e) => handleInputChange('cover_letter', e.target.value)}
              placeholder="Why are you interested in this position? What makes you a good fit?"
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Submit Application
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationModal;
