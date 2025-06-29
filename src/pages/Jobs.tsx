
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import HeroSection from '@/components/shared/HeroSection';
import JobApplicationModal from '@/components/jobs/JobApplicationModal';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  MapPin, 
  Clock, 
  DollarSign, 
  Building, 
  Bookmark,
  Filter,
  BriefcaseIcon
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [applicationModal, setApplicationModal] = useState<{
    isOpen: boolean;
    jobId: number | null;
    jobTitle: string;
  }>({
    isOpen: false,
    jobId: null,
    jobTitle: '',
  });

  // Fetch jobs from Supabase
  const { data: jobs = [], isLoading: loading, error } = useQuery({
    queryKey: ['jobs', searchTerm, locationFilter, jobTypeFilter, categoryFilter],
    queryFn: async () => {
      let query = supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%`);
      }

      if (locationFilter) {
        query = query.ilike('location', `%${locationFilter}%`);
      }

      if (jobTypeFilter !== 'all') {
        query = query.eq('job_type', jobTypeFilter);
      }

      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });

  const handleSaveJob = (jobId: number) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleApplyNow = (jobId: number, jobTitle: string) => {
    setApplicationModal({
      isOpen: true,
      jobId,
      jobTitle,
    });
  };

  const closeApplicationModal = () => {
    setApplicationModal({
      isOpen: false,
      jobId: null,
      jobTitle: '',
    });
  };

  if (error) {
    return (
      <FrontendLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading jobs: {error.message}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </FrontendLayout>
    );
  }

  return (
    <FrontendLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <HeroSection
          title="Find Your Dream Job"
          subtitle="Career Opportunities"
          description="Discover amazing job opportunities that match your skills and aspirations in Kenya's growing job market."
          imageUrl="photo-1521737711867-e3b97375f902"
          className="mb-8"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filter Section */}
          <Card className="mb-8 border-orange-100">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Job title or company"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-orange-200 focus:border-orange-400"
                  />
                </div>
                
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Location"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="pl-10 border-orange-200 focus:border-orange-400"
                  />
                </div>

                <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
                  <SelectTrigger className="border-orange-200 focus:border-orange-400">
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="border-orange-200 focus:border-orange-400">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Jobs Grid */}
          {loading ? (
            <div className="grid gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12">
              <BriefcaseIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria or check back later for new opportunities.</p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setLocationFilter('');
                  setJobTypeFilter('all');
                  setCategoryFilter('all');
                }}
                variant="outline"
                className="border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              {jobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-all duration-300 border-orange-100 hover:border-orange-200">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                          <Badge variant="outline" className="text-orange-600 border-orange-200">
                            {job.job_type}
                          </Badge>
                          {job.status === 'open' && (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              Open
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-gray-600 mb-3">
                          {job.company && (
                            <div className="flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              <span>{job.company}</span>
                            </div>
                          )}
                          {job.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{job.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{new Date(job.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {job.salary && (
                          <div className="flex items-center gap-1 mb-4">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="font-semibold text-green-600">{job.salary}</span>
                          </div>
                        )}

                        <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {job.category}
                          </Badge>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-3 ml-6">
                        <Button
                          onClick={() => handleApplyNow(job.id, job.title)}
                          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          Apply Now
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={() => handleSaveJob(job.id)}
                          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 border-2 ${
                            savedJobs.includes(job.id)
                              ? 'bg-orange-50 border-orange-200 text-orange-600'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <Bookmark className={`h-4 w-4 mr-2 ${savedJobs.includes(job.id) ? 'fill-current' : ''}`} />
                          {savedJobs.includes(job.id) ? 'Saved' : 'Save'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Job Application Modal */}
      {applicationModal.jobId && (
        <JobApplicationModal
          jobId={applicationModal.jobId}
          jobTitle={applicationModal.jobTitle}
          isOpen={applicationModal.isOpen}
          onClose={closeApplicationModal}
        />
      )}
    </FrontendLayout>
  );
};

export default Jobs;
