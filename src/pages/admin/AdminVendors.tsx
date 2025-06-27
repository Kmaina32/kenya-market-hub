
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useVendorApproval } from '@/hooks/useApprovalActions/useVendorApproval';
import { 
  Store, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner';

const AdminVendors = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<any>(null);

  const { updateVendorStatus } = useVendorApproval();

  const { data: vendors, isLoading, refetch } = useQuery({
    queryKey: ['admin-vendors-full'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select(`
          *,
          profiles(full_name, email, phone)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const { data: applications, refetch: refetchApplications } = useQuery({
    queryKey: ['vendor-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendor_applications')
        .select(`
          *,
          profiles(full_name, email, phone)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const { approveApplication, rejectApplication } = useVendorApproval();

  const filteredVendors = vendors?.filter(vendor => {
    const matchesFilter = filter === 'all' || vendor.verification_status === filter;
    const matchesSearch = vendor.business_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  }) || [];

  const handleApproveApplication = async (applicationId: string) => {
    try {
      await approveApplication.mutateAsync(applicationId);
      refetchApplications();
      refetch();
      toast.success('Vendor application approved successfully!');
    } catch (error) {
      toast.error('Failed to approve vendor application');
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    try {
      await rejectApplication.mutateAsync(applicationId);
      refetchApplications();
      toast.success('Vendor application rejected');
    } catch (error) {
      toast.error('Failed to reject vendor application');
    }
  };

  const handleUpdateStatus = async (vendorId: string, status: string) => {
    try {
      await updateVendorStatus.mutateAsync({ vendorId, status });
      refetch();
      toast.success('Vendor status updated successfully!');
    } catch (error) {
      toast.error('Failed to update vendor status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Store className="h-8 w-8" />
            Vendors Management
          </h1>
          <p className="text-green-100 mt-2">Manage vendor applications and existing vendors</p>
        </div>

        {/* Pending Applications */}
        {applications && applications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-orange-600">Pending Applications ({applications.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold">{app.business_name}</h4>
                      <p className="text-sm text-gray-600">{app.profiles?.full_name}</p>
                      <p className="text-sm text-gray-500">Applied: {new Date(app.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleApproveApplication(app.id)}
                        className="bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        onClick={() => handleRejectApplication(app.id)}
                        variant="destructive"
                        size="sm"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              
              <Button onClick={() => refetch()} variant="outline">
                Refresh Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Vendors List */}
        <div className="grid gap-6">
          {filteredVendors.length > 0 ? (
            filteredVendors.map((vendor) => (
              <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                          {vendor.business_name?.charAt(0) || 'V'}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {vendor.business_name}
                          </h3>
                          <p className="text-lg text-gray-600">{vendor.profiles?.full_name}</p>
                          <div className="flex items-center gap-4 mt-2">
                            {getStatusBadge(vendor.verification_status)}
                            <Badge variant={vendor.is_active ? 'default' : 'secondary'}>
                              {vendor.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>{vendor.business_email || vendor.profiles?.email || 'No email'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{vendor.business_phone || vendor.profiles?.phone || 'No phone'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{vendor.business_address || 'No address provided'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>Joined: {new Date(vendor.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {vendor.business_description && (
                        <p className="text-gray-700 mt-3 line-clamp-2">{vendor.business_description}</p>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2 min-w-[200px]">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedVendor(vendor)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Vendor Details</DialogTitle>
                          </DialogHeader>
                          {selectedVendor && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="font-medium">Business Name:</label>
                                  <p>{selectedVendor.business_name}</p>
                                </div>
                                <div>
                                  <label className="font-medium">Owner:</label>
                                  <p>{selectedVendor.profiles?.full_name || 'N/A'}</p>
                                </div>
                                <div>
                                  <label className="font-medium">Email:</label>
                                  <p>{selectedVendor.business_email || selectedVendor.profiles?.email || 'N/A'}</p>
                                </div>
                                <div>
                                  <label className="font-medium">Phone:</label>
                                  <p>{selectedVendor.business_phone || selectedVendor.profiles?.phone || 'N/A'}</p>
                                </div>
                                <div>
                                  <label className="font-medium">Status:</label>
                                  <p>{selectedVendor.verification_status}</p>
                                </div>
                                <div>
                                  <label className="font-medium">Active:</label>
                                  <p>{selectedVendor.is_active ? 'Yes' : 'No'}</p>
                                </div>
                              </div>
                              {selectedVendor.business_description && (
                                <div>
                                  <label className="font-medium">Description:</label>
                                  <p className="mt-1">{selectedVendor.business_description}</p>
                                </div>
                              )}
                              {selectedVendor.business_address && (
                                <div>
                                  <label className="font-medium">Address:</label>
                                  <p className="mt-1">{selectedVendor.business_address}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Select 
                        value={vendor.verification_status} 
                        onValueChange={(value) => handleUpdateStatus(vendor.id, value)}
                      >
                        <SelectTrigger size="sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No vendors found matching your criteria.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminVendors;
