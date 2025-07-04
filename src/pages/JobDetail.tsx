import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { getJobById } from '@/integrations/supabase/jobBoardApi';
import MainLayout from '@/components/MainLayout';
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  Building, 
  Users, 
  ArrowLeft,
  Briefcase,
  CheckCircle,
  Mail,
  Phone,
  Globe
} from 'lucide-react';

interface Job {
  id: number;
  title: string;
  description: string;
  location?: string;
  category?: string;
  salary?: string;
  job_type?: string;
  remote_option?: string;
  experience_level?: string;
  company_name?: string;
  responsibilities?: string;
  qualifications?: string;
  benefits?: string;
  application_instructions?: string;
  company_website?: string;
  contact_email?: string;
  contact_phone?: string;
  created_at: string;
}

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchJob(parseInt(id));
    }
  }, [id]);

  const fetchJob = async (jobId: number) => {
    setLoading(true);
    try {
      const data = await getJobById(jobId);
      setJob(data);
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to load job details', 
        variant: 'destructive' 
      });
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (!job) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Job not found.</p>
          <Button onClick={() => navigate('/jobs')} className="mt-4">
            Back to Jobs
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 sm:space-y-8 lg:space-y-12">
        {/* Header Section */}
        <section className="relative bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 sm:p-8 lg:p-12 rounded-xl shadow-2xl">
          <Button
            variant="ghost"
            onClick={() => navigate('/jobs')}
            className="absolute top-4 left-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
          
          <div className="max-w-4xl mx-auto pt-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                  {job.title}
                </h1>
                
                {job.company_name && (
                  <div className="flex items-center text-lg sm:text-xl mb-4 opacity-90">
                    <Building className="h-5 w-5 mr-2" />
                    {job.company_name}
                  </div>
                )}

                <div className="flex flex-wrap gap-3 mb-6">
                  {job.job_type && (
                    <Badge className="bg-white/20 text-white border-white/30 text-sm px-3 py-1">
                      <Briefcase className="h-3 w-3 mr-1" />
                      {job.job_type}
                    </Badge>
                  )}
                  {job.remote_option && (
                    <Badge className="bg-white/20 text-white border-white/30 text-sm px-3 py-1">
                      {job.remote_option}
                    </Badge>
                  )}
                  {job.experience_level && (
                    <Badge className="bg-white/20 text-white border-white/30 text-sm px-3 py-1">
                      <Users className="h-3 w-3 mr-1" />
                      {job.experience_level}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 text-sm opacity-90">
                  {job.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </div>
                  )}
                  {job.salary && (
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {job.salary}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Posted {formatDate(job.created_at)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            {job.responsibilities && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Key Responsibilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {job.responsibilities.split('\n').map((responsibility, index) => (
                      <div key={index} className="flex items-start mb-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                        <span>{responsibility}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Qualifications */}
            {job.qualifications && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Required Qualifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {job.qualifications.split('\n').map((qualification, index) => (
                      <div key={index} className="flex items-start mb-2">
                        <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                        <span>{qualification}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Instructions */}
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg text-center">Apply for this Position</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {job.application_instructions && (
                  <div>
                    <h4 className="font-semibold mb-2">Application Instructions</h4>
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                      {job.application_instructions}
                    </p>
                  </div>
                )}

                <Separator />

                {/* Contact Information */}
                <div>
                  <h4 className="font-semibold mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    {job.contact_email && (
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        <a 
                          href={`mailto:${job.contact_email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {job.contact_email}
                        </a>
                      </div>
                    )}
                    {job.contact_phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        <a 
                          href={`tel:${job.contact_phone}`}
                          className="text-blue-600 hover:underline"
                        >
                          {job.contact_phone}
                        </a>
                      </div>
                    )}
                    {job.company_website && (
                      <div className="flex items-center text-sm">
                        <Globe className="h-4 w-4 mr-2 text-gray-500" />
                        <a 
                          href={job.company_website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Company Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                  onClick={() => job.contact_email && window.open(`mailto:${job.contact_email}?subject=Application for ${job.title}`, '_blank')}
                >
                  Apply Now
                </Button>
              </CardContent>
            </Card>

            {/* Benefits */}
            {job.benefits && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Benefits & Perks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {job.benefits.split('\n').map((benefit, index) => (
                      <div key={index} className="flex items-start mb-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Job Category */}
            {job.category && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Job Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                    {job.category}
                  </Badge>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default JobDetail;
