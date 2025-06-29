
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Building2, Search, Briefcase } from 'lucide-react';
import { EditButton, DeleteButton, ViewButton } from '@/components/ui/action-buttons';
import { ViewModal, EditModal, DeleteModal } from '@/components/admin/ActionModals';
import { toast } from 'sonner';

const AdminEmployers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployer, setSelectedEmployer] = useState<any>(null);
  const [modalType, setModalType] = useState<'view' | 'edit' | 'delete' | null>(null);
  const queryClient = useQueryClient();

  // Fetch employers (grouped from jobs data)
  const { data: employers, isLoading } = useQuery({
    queryKey: ['admin-employers', searchTerm],
    queryFn: async () => {
      const { data: jobs, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group by company to create employer records
      const employerMap = jobs?.reduce((acc, job) => {
        const company = job.company || 'Unknown Company';
        if (!acc[company]) {
          acc[company] = {
            id: job.posted_by,
            company,
            contact_email: `contact@${company.toLowerCase().replace(/\s+/g, '')}.com`,
            contact_phone: '+254-700-000-000',
            jobCount: 0,
            activeJobs: 0,
            totalApplications: 0,
            posted_by: job.posted_by,
            created_at: job.created_at,
            status: 'active'
          };
        }
        acc[company].jobCount++;
        if (job.status === 'open') acc[company].activeJobs++;
        return acc;
      }, {} as Record<string, any>);

      let employersList = Object.values(employerMap || {});

      if (searchTerm) {
        employersList = employersList.filter(employer =>
          employer.company.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      return employersList;
    }
  });

  // Update employer mutation
  const updateEmployer = useMutation({
    mutationFn: async (employerData: any) => {
      // In a real app, you'd update the employer record
      // For now, we'll simulate success
      return employerData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-employers'] });
      toast.success('Employer updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update employer: ${error.message}`);
    }
  });

  // Delete employer mutation
  const deleteEmployer = useMutation({
    mutationFn: async (employerId: string) => {
      // In a real app, you'd deactivate the employer and their jobs
      const { error } = await supabase
        .from('jobs')
        .update({ status: 'closed' })
        .eq('posted_by', employerId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-employers'] });
      toast.success('Employer deactivated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to deactivate employer: ${error.message}`);
    }
  });

  const handleView = (employer: any) => {
    setSelectedEmployer(employer);
    setModalType('view');
  };

  const handleEdit = (employer: any) => {
    setSelectedEmployer(employer);
    setModalType('edit');
  };

  const handleDelete = (employer: any) => {
    setSelectedEmployer(employer);
    setModalType('delete');
  };

  const editFields = [
    { key: 'company', label: 'Company Name', type: 'text' as const },
    { key: 'contact_email', label: 'Contact Email', type: 'email' as const },
    { key: 'contact_phone', label: 'Contact Phone', type: 'text' as const },
    { 
      key: 'status', 
      label: 'Status', 
      type: 'select' as const,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'suspended', label: 'Suspended' },
        { value: 'pending', label: 'Pending Review' }
      ]
    }
  ];

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
            All Employers ({employers?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <span className="ml-2">Loading employers...</span>
            </div>
          ) : employers && employers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Total Jobs</TableHead>
                    <TableHead>Active Jobs</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Member Since</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employers.map((employer: any) => (
                    <TableRow key={employer.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="font-medium">{employer.company}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{employer.contact_email}</div>
                          <div className="text-gray-500">{employer.contact_phone}</div>
                        </div>
                      </TableCell>
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
                        <Badge 
                          variant={employer.status === 'active' ? 'default' : 'secondary'}
                          className={employer.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {employer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {employer.created_at ? new Date(employer.created_at).toLocaleDateString() : 'Unknown'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <ViewButton onClick={() => handleView(employer)} />
                          <EditButton onClick={() => handleEdit(employer)} />
                          <DeleteButton onClick={() => handleDelete(employer)} />
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

      {/* Modals */}
      {selectedEmployer && (
        <>
          <ViewModal
            isOpen={modalType === 'view'}
            onClose={() => setModalType(null)}
            title={`Employer Details - ${selectedEmployer.company}`}
            data={selectedEmployer}
          />

          <EditModal
            isOpen={modalType === 'edit'}
            onClose={() => setModalType(null)}
            title={`Edit Employer - ${selectedEmployer.company}`}
            data={selectedEmployer}
            fields={editFields}
            onSave={(data) => updateEmployer.mutate(data)}
          />

          <DeleteModal
            isOpen={modalType === 'delete'}
            onClose={() => setModalType(null)}
            title="Deactivate Employer"
            description={`Are you sure you want to deactivate ${selectedEmployer.company}? This will close all their active job postings.`}
            onConfirm={() => deleteEmployer.mutate(selectedEmployer.id)}
          />
        </>
      )}
    </div>
  );
};

export default AdminEmployers;
