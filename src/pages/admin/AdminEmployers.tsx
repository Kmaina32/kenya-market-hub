
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Building2, Search, Edit, Trash2, Eye, Briefcase } from 'lucide-react';

const AdminEmployers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch jobs to simulate employers data
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['admin-employers', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`company.ilike.%${searchTerm}%,title.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Group by company to simulate employers
      const employers = data?.reduce((acc, job) => {
        const company = job.company || 'Unknown Company';
        if (!acc[company]) {
          acc[company] = {
            id: job.id,
            company,
            jobCount: 0,
            activeJobs: 0,
            posted_by: job.posted_by,
            created_at: job.created_at
          };
        }
        acc[company].jobCount++;
        if (job.status === 'open') acc[company].activeJobs++;
        return acc;
      }, {} as Record<string, any>);
      
      return Object.values(employers || {});
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employer Management</h1>
          <p className="text-gray-600">Manage all employers and job postings</p>
        </div>
        <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Employer
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search employers..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            All Employers ({jobs?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <span className="ml-2">Loading employers...</span>
            </div>
          ) : jobs && jobs.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Posted By</TableHead>
                    <TableHead>Total Jobs</TableHead>
                    <TableHead>Active Jobs</TableHead>
                    <TableHead>Member Since</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((employer: any) => (
                    <TableRow key={employer.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="font-medium">{employer.company}</span>
                        </div>
                      </TableCell>
                      <TableCell>User {employer.posted_by?.slice(-8) || 'Unknown'}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Briefcase className="h-3 w-3 mr-1 text-gray-400" />
                          <span>{employer.jobCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">{employer.activeJobs} active</Badge>
                      </TableCell>
                      <TableCell>
                        {employer.created_at ? new Date(employer.created_at).toLocaleDateString() : 'Unknown'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Employers Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No employers match your search criteria.' : 'Employers will appear here once they register to post jobs.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminEmployers;
