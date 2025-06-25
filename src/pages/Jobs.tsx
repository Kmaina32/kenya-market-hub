
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, Clock, DollarSign, Search, Building } from 'lucide-react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useJobs } from '@/hooks/useJobs';
import { useToast } from '@/hooks/use-toast';

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const { jobs, loading } = useJobs();
  const { toast } = useToast();

  const categories = ['Technology', 'Healthcare', 'Finance', 'Education', 'Marketing', 'Sales'];
  const jobTypes = ['full-time', 'part-time', 'contract', 'remote'];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
    const matchesType = selectedType === 'all' || job.job_type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const handleApplyJob = (jobId: number) => {
    toast({
      title: "Application Submitted",
      description: "Your job application has been submitted successfully.",
    });
  };

  return (
    <FrontendLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        {/* Hero Section */}
        <div 
          className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16 rounded-b-2xl mb-8 mx-4 sm:mx-6 lg:mx-8 mt-4 px-8 sm:px-12 lg:px-16"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-b-2xl" />
          
          {/* Content */}
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <Briefcase className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Find Your Dream Job</h1>
            <p className="text-xl text-purple-100 mb-8">
              Discover career opportunities from top employers across Kenya
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 pb-8">
          {/* Search and Filters */}
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search jobs or companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {jobTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Job Listings */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading jobs...</p>
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="space-y-6">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl text-gray-900 mb-2">{job.title}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          {job.company && (
                            <div className="flex items-center gap-1">
                              <Building className="h-4 w-4 text-purple-500" />
                              <span className="font-medium">{job.company}</span>
                            </div>
                          )}
                          {job.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-red-500" />
                              <span>{job.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span>{new Date(job.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary">{job.category}</Badge>
                          <Badge variant="outline">{job.job_type}</Badge>
                          <Badge 
                            variant={job.status === 'open' ? 'default' : 'secondary'}
                            className={job.status === 'open' ? 'bg-green-100 text-green-800' : ''}
                          >
                            {job.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        {job.salary && (
                          <div className="flex items-center gap-1 text-green-600 font-semibold mb-2">
                            <DollarSign className="h-4 w-4" />
                            <span>{job.salary}</span>
                          </div>
                        )}
                        <Button 
                          onClick={() => handleApplyJob(job.id)}
                          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                        >
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 line-clamp-3">{job.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Jobs Found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedCategory !== 'all' || selectedType !== 'all'
                  ? 'No jobs match your current search criteria.'
                  : 'Job listings will be available soon. Check back later!'
                }
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedType('all');
                }}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </FrontendLayout>
  );
};

export default Jobs;
