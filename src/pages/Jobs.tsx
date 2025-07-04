import React, { useState, useEffect, useCallback, useMemo } from 'react'; // Added useMemo for filteredJobs, useCallback for handlers
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Briefcase, MapPin, Clock, DollarSign, Building, Loader2 } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import HeroSection from '@/components/shared/HeroSection';
import { toast } from 'sonner';

// FIX: Updated Job interface to include 'company' and 'job_type'
interface Job {
  id: number;
  title: string;
  description: string;
  location?: string | null; // Made nullable
  category?: string | null; // Made nullable
  salary?: string | null;   // Made nullable
  status?: string | null;   // Made nullable
  created_at: string;
  company?: string | null;  // Added, made nullable
  job_type?: string | null; // Added, made nullable
  // Add any other properties your 'jobs' table returns from select('*')
}

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: jobs, isLoading, error } = useQuery<Job[]>({
    queryKey: ['jobs', debouncedSearchTerm, selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('jobs')
        .select(`
          id, title, description, location, category, salary, status, created_at,
          company, job_type, -- Explicitly selecting these as they are used in UI
          remote_option, experience_level, company_name, responsibilities, qualifications, benefits,
          application_instructions, company_website, contact_email, contact_phone
        `) 
        .eq('status', 'open');

      if (debouncedSearchTerm) {
        query = query.or(`title.ilike.%${debouncedSearchTerm}%,company.ilike.%${debouncedSearchTerm}%,category.ilike.%${debouncedSearchTerm}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching jobs:", error.message);
        toast.error("Failed to load jobs. Please try again.");
        throw error;
      }
      return data || [];
    }
  });

  // Since filtering is handled in queryFn, no need for client-side filteredJobs
  // The 'jobs' data already represents the filtered results.

  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <HeroSection
          title="Find Your Dream Job"
          subtitle="Discover career opportunities from top companies across Kenya"
          description=" " // Added a space or a proper description
          imageUrl="photo-1486312338219-ce68e2c6b696"
          className="mb-8 h-64 rounded-3xl mx-4 sm:mx-6 lg:mx-12 xl:mx-24"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search jobs by title, company, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 text-base border-orange-200 focus:ring-orange-500 focus:border-orange-500 rounded-xl"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></Loader2>
              <p className="mt-4 text-gray-600">Loading jobs...</p>
            </div>
          ) : (jobs || []).length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Jobs Available</h3>
              <p className="text-gray-600 mb-6">
                {debouncedSearchTerm ? 'No jobs match your search criteria.' : 'Job listings will be available soon. Check back later!'}
              </p>
              {debouncedSearchTerm && ( // Use debouncedSearchTerm for conditional rendering
                <Button onClick={handleClearSearch} variant="outline">
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(jobs || []).map((job) => (
                <Card key={job.id} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-orange-300">
                  {/* FIX: Make entire card content clickable using Link */}
                  <Link to={`/job/${job.id}`} className="block h-full w-full p-4"> {/* Added p-4 here to ensure content is inside the link */}
                    <CardHeader className="pb-3 px-0 pt-0"> {/* Adjusted padding for header within Link */}
                      <div className="flex items-start justify-between mb-2">
                        {job.category && (
                          <Badge variant="outline" className="text-orange-600 border-orange-200">
                            {job.category}
                          </Badge>
                        )}
                        {job.job_type && (
                          <Badge variant="secondary" className="text-xs">
                            {job.job_type}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg text-gray-900 line-clamp-2">
                        {job.title}
                      </CardTitle>
                      {job.company && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Building className="h-4 w-4 text-orange-500" />
                          <span>{job.company}</span>
                        </div>
                      )}
                    </CardHeader>

                    <CardContent className="space-y-3 px-0 pb-0"> {/* Adjusted padding for content within Link */}
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {job.description}
                      </p>
                      
                      {job.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4 text-orange-500" />
                          <span className="truncate">{job.location}</span>
                        </div>
                      )}

                      {job.salary && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <DollarSign className="h-4 w-4 text-orange-500" />
                          <span>{job.salary}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                      </div>

                      {/* FIX: Changed button to "View Details" */}
                      <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                        View Details
                      </Button>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Jobs;