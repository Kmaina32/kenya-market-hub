
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Search,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Filter,
  Loader2
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEOManager from '@/components/seo/SEOManager';
import JobApplicationModal from '@/components/JobApplicationModal';

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

const JOB_CATEGORIES = ['Technology', 'Marketing', 'Finance', 'Healthcare', 'Education', 'Engineering', 'Sales', 'Customer Service'];
const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];

const Jobs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['jobs', searchTerm, selectedCategory, selectedType],
    queryFn: async () => {
      let query = supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open');

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }
      if (selectedType !== 'all') {
        query = query.eq('job_type', selectedType);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) {
        console.error("Error fetching jobs:", error.message);
        throw error;
      }
      return data || [];
    },
    staleTime: 60 * 1000,
  });

  const filteredJobs = jobs ? jobs.filter(job => {
    const searchRegex = new RegExp(searchTerm, 'i');
    const matchesSearch = searchRegex.test(job.title) || searchRegex.test(job.description);

    const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
    const matchesType = selectedType === 'all' || job.job_type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  }) : [];

  const handleApplyClick = (job: Job) => {
    setSelectedJob(job);
    setIsApplicationModalOpen(true);
  };

  return (
    <MainLayout>
      <SEOManager
        title="Find Your Dream Job in Kenya | Sokko Sasa Job Portal"
        description="Search and apply for the latest job openings in Kenya. Connect with top employers and advance your career."
        keywords="jobs Kenya, job search, employment, career, hiring"
        url={`${window.location.origin}/jobs`}
        type="website"
      />

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Job Opportunities
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto">
              Find your next career move with top companies across Kenya
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {JOB_CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {JOB_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Jobs Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-10 w-10 text-orange-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading job listings...</p>
            </div>
          ) : filteredJobs && filteredJobs.length > 0 ? (
            <div className="grid gap-6">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h2>
                    <p className="text-gray-600">{job.company}</p>

                    <div className="flex items-center space-x-2 mt-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{job.location}</span>
                    </div>

                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{job.job_type}</span>
                    </div>

                    <div className="flex items-center space-x-2 mt-1">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{job.salary}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex space-x-2">
                        <Badge>{job.category}</Badge>
                      </div>
                      <Button 
                        onClick={() => handleApplyClick(job)}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      >
                        Apply Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Job Openings Found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory !== 'all' || selectedType !== 'all'
                  ? 'No jobs match your search criteria. Try adjusting your filters.'
                  : 'No job openings available at the moment. Please check back later.'}
              </p>
            </div>
          )}
        </div>

        <JobApplicationModal
          open={isApplicationModalOpen}
          onOpenChange={setIsApplicationModalOpen}
          job={selectedJob}
        />
      </div>
    </MainLayout>
  );
};

export default Jobs;
