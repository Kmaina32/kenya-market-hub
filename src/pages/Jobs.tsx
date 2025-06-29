
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Heart,
  Filter,
  Bookmark
} from 'lucide-react';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  posted: string;
  requirements: string[];
  benefits: string[];
  saved?: boolean;
}

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('all');
  const [savedJobs, setSavedJobs] = useState<number[]>([]);

  // Mock data for jobs
  const mockJobs: Job[] = [
    {
      id: 1,
      title: 'Software Developer',
      company: 'Tech Solutions Ltd',
      location: 'Nairobi, Kenya',
      type: 'Full-time',
      salary: 'KSh 80,000 - 120,000',
      description: 'We are looking for a talented software developer to join our growing team.',
      posted: '2 days ago',
      requirements: ['React', 'TypeScript', 'Node.js', '3+ years experience'],
      benefits: ['Health Insurance', 'Flexible Hours', 'Remote Work']
    },
    {
      id: 2,
      title: 'Marketing Manager',
      company: 'Brand Masters',
      location: 'Mombasa, Kenya',
      type: 'Full-time',
      salary: 'KSh 70,000 - 100,000',
      description: 'Lead our marketing initiatives and drive brand growth.',
      posted: '1 week ago',
      requirements: ['Marketing degree', 'Digital marketing', '5+ years experience'],
      benefits: ['Performance bonus', 'Travel allowance', 'Training opportunities']
    },
    {
      id: 3,
      title: 'Graphic Designer',
      company: 'Creative Studio',
      location: 'Nairobi, Kenya',
      type: 'Part-time',
      salary: 'KSh 40,000 - 60,000',
      description: 'Create stunning visual designs for our clients.',
      posted: '3 days ago',
      requirements: ['Adobe Creative Suite', 'Portfolio', '2+ years experience'],
      benefits: ['Flexible schedule', 'Creative freedom', 'Project bonuses']
    }
  ];

  const { data: jobs = mockJobs, isLoading } = useQuery({
    queryKey: ['jobs', searchTerm, locationFilter, jobTypeFilter],
    queryFn: async () => {
      // Simulate API call with filtering
      return mockJobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            job.company.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation = !locationFilter || job.location.includes(locationFilter);
        const matchesType = !jobTypeFilter || job.type === jobTypeFilter;
        return matchesSearch && matchesLocation && matchesType;
      });
    }
  });

  const handleSaveJob = (jobId: number) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleApplyNow = (jobId: number) => {
    console.log('Applying to job:', jobId);
    // Handle job application logic here
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Find Your Dream Job
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Discover opportunities that match your skills and aspirations
              </p>
              
              {/* Search Bar */}
              <div className="max-w-4xl mx-auto bg-white rounded-xl p-6 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative md:col-span-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Job title, keywords, or company"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 h-12 text-gray-900 border-gray-200"
                    />
                  </div>
                  
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Location"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="pl-12 h-12 text-gray-900 border-gray-200"
                    />
                  </div>
                  
                  <Button 
                    size="lg" 
                    className="h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Search Jobs
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>

          {/* Job Results */}
          <div className="grid gap-6">
            {jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-orange-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                        <Badge variant="outline" className="text-orange-600 border-orange-200">
                          {job.type}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          <span>{job.company}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{job.posted}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 mb-4">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-600">{job.salary}</span>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                      {/* Requirements */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.requirements.slice(0, 3).map((req, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                        {job.requirements.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{job.requirements.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 ml-6">
                      <Button
                        onClick={() => handleApplyNow(job.id)}
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
                        {savedJobs.includes(job.id) ? 'Saved' : 'Save Job'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {jobs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Jobs;
