
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import CreateJobModal from '@/components/admin/CreateJobModal';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const JobBoard: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['admin-jobs', searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%`);
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });

  const { data: applications = [] } = useQuery({
    queryKey: ['job-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_applications')
        .select('job_id')
        .eq('status', 'pending');
      
      if (error) throw error;
      return data || [];
    }
  });

  const deleteJobMutation = useMutation({
    mutationFn: async (jobId: number) => {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Job deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to delete job: ${error.message}`);
    }
  });

  const toggleJobStatusMutation = useMutation({
    mutationFn: async ({ jobId, newStatus }: { jobId: number; newStatus: string }) => {
      const { error } = await supabase
        .from('jobs')
        .update({ status: newStatus })
        .eq('id', jobId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Job status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to update job: ${error.message}`);
    }
  });

  const getApplicationCount = (jobId: number) => {
    return applications.filter(app => app.job_id === jobId).length;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-500';
      case 'closed': return 'bg-red-500';
      case 'paused': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredJobs = jobs;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Management</h1>
          <p className="text-gray-600 mt-1">Manage job postings and applications</p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Post New Job
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading jobs...</p>
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="grid gap-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {job.title}
                      </h3>
                      <Badge className={`${getStatusColor(job.status)} text-white`}>
                        {job.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      {job.company && (
                        <div>
                          <span className="font-medium">Company:</span> {job.company}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Location:</span> {job.location || 'Remote'}
                      </div>
                      <div>
                        <span className="font-medium">Type:</span> {job.job_type}
                      </div>
                      <div>
                        <span className="font-medium">Applications:</span> {getApplicationCount(job.id)}
                      </div>
                    </div>

                    {job.salary && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Salary:</span> {job.salary}
                      </div>
                    )}

                    <p className="mt-3 text-gray-700 line-clamp-2">
                      {job.description}
                    </p>

                    <div className="mt-3 text-xs text-gray-500">
                      Posted on {new Date(job.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newStatus = job.status === 'open' ? 'closed' : 'open';
                        toggleJobStatusMutation.mutate({ jobId: job.id, newStatus });
                      }}
                      className={job.status === 'open' ? 'text-red-600' : 'text-green-600'}
                    >
                      {job.status === 'open' ? 'Close' : 'Open'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteJobMutation.mutate(job.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Filter className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Start by posting your first job'}
            </p>
          </CardContent>
        </Card>
      )}

      <CreateJobModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default JobBoard;
