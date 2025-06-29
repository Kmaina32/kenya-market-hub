
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Briefcase, Search } from 'lucide-react';
import { EditButton, DeleteButton, ViewButton } from '@/components/ui/action-buttons';
import { toast } from 'sonner';
import JobsStats from './JobsStats';

const JobManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['admin-jobs', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });

  const { data: applications } = useQuery({
    queryKey: ['job-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .order('applied_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const updateJobStatus = useMutation({
    mutationFn: async ({ jobId, status }: { jobId: number; status: string }) => {
      const { error } = await supabase
        .from('jobs')
        .update({ status })
        .eq('id', jobId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      toast.success('Job status updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update job status: ${error.message}`);
    }
  });

  const deleteJob = useMutation({
    mutationFn: async (jobId: number) => {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      toast.success('Job deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete job: ${error.message}`);
    }
  });

  const handleStatusToggle = (jobId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'open' ? 'closed' : 'open';
    updateJobStatus.mutate({ jobId, status: newStatus });
  };

  const handleEdit = (jobId: number) => {
    console.log('Edit job:', jobId);
    // TODO: Open edit modal
  };

  const handleDelete = (jobId: number) => {
    if (confirm('Are you sure you want to delete this job?')) {
      deleteJob.mutate(jobId);
    }
  };

  const handleView = (jobId: number) => {
    console.log('View job:', jobId);
    // TODO: Open view modal with applications
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Board Management</h1>
          <p className="text-gray-600">Manage job postings and applications</p>
        </div>
        <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Post New Job
        </Button>
      </div>

      <JobsStats />

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search jobs..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                All Jobs ({jobs?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  <span className="ml-2">Loading jobs...</span>
                </div>
              ) : jobs && jobs.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Applications</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobs.map((job) => {
                        const jobApplications = applications?.filter(app => app.job_id === job.id) || [];
                        return (
                          <TableRow key={job.id}>
                            <TableCell className="font-medium">{job.title}</TableCell>
                            <TableCell>{job.company || 'Not specified'}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{job.job_type}</Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusToggle(job.id, job.status)}
                                className={job.status === 'open' ? 'text-green-600' : 'text-red-600'}
                              >
                                <Badge 
                                  variant={job.status === 'open' ? 'default' : 'secondary'}
                                  className={job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                                >
                                  {job.status}
                                </Badge>
                              </Button>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {jobApplications.length}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <ViewButton onClick={() => handleView(job.id)} />
                                <EditButton onClick={() => handleEdit(job.id)} />
                                <DeleteButton onClick={() => handleDelete(job.id)} />
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-600 mb-4">Start by posting your first job opening.</p>
                  <Button 
                    onClick={() => {}}
                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Post Job
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications?.slice(0, 5).map((application) => {
                  const job = jobs?.find(j => j.id === application.job_id);
                  return (
                    <div key={application.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{application.applicant_name}</p>
                        <p className="text-xs text-gray-600">{job?.title || 'Unknown Job'}</p>
                      </div>
                      <Badge 
                        variant="outline"
                        className={
                          application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }
                      >
                        {application.status}
                      </Badge>
                    </div>
                  );
                }) || (
                  <p className="text-gray-500 text-sm">No recent applications</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobManagement;
