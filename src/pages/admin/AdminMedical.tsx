
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Stethoscope, Search, MapPin, Star } from 'lucide-react';

const AdminMedical = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch medical providers from database
  const { data: providers, isLoading: providersLoading } = useQuery({
    queryKey: ['admin-medical-providers', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('medical_providers')
        .select(`
          *,
          specialization:medical_specializations(name)
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,provider_type.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  // Fetch medical applications
  const { data: applications, isLoading: applicationsLoading } = useQuery({
    queryKey: ['admin-medical-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medical_provider_applications')
        .select(`
          *,
          specialization:medical_specializations(name)
        `)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medical Services Management</h1>
          <p className="text-gray-600">Manage all medical providers and applications</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search medical providers..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Medical Providers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Stethoscope className="h-5 w-5 mr-2" />
            Medical Providers ({providers?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {providersLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <span className="ml-2">Loading medical providers...</span>
            </div>
          ) : providers && providers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {providers.map((provider) => (
                    <TableRow key={provider.id}>
                      <TableCell>
                        <div className="font-medium">{provider.full_name}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{provider.provider_type}</Badge>
                      </TableCell>
                      <TableCell>
                        {provider.specialization?.name || 'General'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span>{Number(provider.rating || 0).toFixed(1)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={provider.is_verified ? 'default' : 'secondary'}>
                          {provider.is_verified ? 'Verified' : 'Not Verified'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={provider.is_active ? 'default' : 'secondary'}>
                          {provider.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Stethoscope className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Medical Providers Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No providers match your search criteria.' : 'Medical providers will appear here once they are approved.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Medical Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Provider Applications ({applications?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {applicationsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <span className="ml-2">Loading applications...</span>
            </div>
          ) : applications && applications.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>License</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{application.full_name}</div>
                          <div className="text-sm text-gray-500">{application.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{application.provider_type}</Badge>
                      </TableCell>
                      <TableCell>
                        {application.specialization?.name || 'General'}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {application.license_number}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(application.status)}>
                          {application.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(application.submitted_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Stethoscope className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Found</h3>
              <p className="text-gray-600 mb-4">Medical provider applications will appear here when submitted.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMedical;
