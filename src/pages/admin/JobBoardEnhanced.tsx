
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { getJobs, deleteJob } from '@/integrations/supabase/jobBoardApi';
import { Job } from '@/types/job';
import { 
  PlusCircle, 
  Search, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Briefcase, 
  Edit2, 
  Trash2,
  TrendingUp,
  Users,
  Building
} from 'lucide-react';
import ModernAdminLayout from '@/components/admin/ModernAdminLayout';

const JobBoardEnhanced: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await getJobs();
      // Handle both array and paginated response formats
      const jobData = Array.isArray(response) ? response : response?.data || [];
      // Ensure all jobs have required fields
      const formattedJobs = jobData.map((job: any) => ({
        ...job,
        location: job.location || 'Not specified'
      }));
      setJobs(formattedJobs);
    } catch (error) {
      toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    (job.location && job.location.toLowerCase().includes(search.toLowerCase())) ||
    job.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteJob = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await deleteJob(id);
        toast({ title: 'Success', description: 'Job deleted successfully' });
        fetchJobs();
      } catch (error) {
        toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'default';
      case 'closed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const stats = [
    {
      title: 'Total Jobs',
      value: jobs.length.toString(),
      change: '+12%',
      icon: Briefcase,
      color: 'text-blue-600'
    },
    {
      title: 'Open Positions',
      value: jobs.filter(job => job.status?.toLowerCase() === 'open').length.toString(),
      change: '+8%',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Applications',
      value: '0',
      change: '+0%',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Companies',
      value: new Set(jobs.map(job => job.company || 'N/A')).size.toString(),
      change: '+15%',
      icon: Building,
      color: 'text-orange-600'
    }
  ];

  return (
    <ModernAdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Board Management</h1>
            <p className="text-gray-600">Manage job postings and applications</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Job
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change} from last month</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
            <CardDescription>Find specific jobs quickly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search jobs by title, location, or category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jobs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Job Listings</CardTitle>
            <CardDescription>Manage all job postings</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600 mb-4">
                  {search ? 'Try adjusting your search criteria' : 'Get started by creating your first job posting'}
                </p>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Your First Job
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{job.title}</p>
                          <p className="text-sm text-gray-600 line-clamp-1">{job.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>{job.company || 'N/A'}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="mr-1 h-3 w-3 text-gray-400" />
                          {job.location || 'Not specified'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{job.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <DollarSign className="mr-1 h-3 w-3 text-gray-400" />
                          {job.salary}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(job.status || 'open')}>
                          {job.status || 'open'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="mr-1 h-3 w-3" />
                          {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleDeleteJob(job.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </ModernAdminLayout>
  );
};

export default JobBoardEnhanced;
