
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
import { useServiceProviderApproval } from '@/hooks/useApprovalActions/useServiceProviderApproval';
import { 
  Users, 
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

const AdminServiceProviders = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [rejectionNotes, setRejectionNotes] = useState('');

  const { approveServiceProvider, rejectServiceProvider } = useServiceProviderApproval();

  const { data: providers, isLoading, refetch } = useQuery({
    queryKey: ['admin-service-providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_provider_profiles')
        .select(`
          *,
          profiles(full_name, email, phone)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data?.map(provider => ({
        ...provider,
        profile_name: provider.profiles?.full_name || 'Unknown',
        profile_email: provider.profiles?.email || provider.email || 'No email',
        profile_phone: provider.profiles?.phone || provider.phone_number || 'No phone'
      })) || [];
    }
  });

  const filteredProviders = providers?.filter(provider => {
    const matchesFilter = filter === 'all' || provider.verification_status === filter;
    const matchesSearch = provider.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.profile_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  }) || [];

  const handleApprove = async (providerId: string) => {
    try {
      await approveServiceProvider.mutateAsync({ providerId });
      refetch();
      toast.success('Service provider approved successfully!');
    } catch (error) {
      toast.error('Failed to approve service provider');
    }
  };

  const handleReject = async (providerId: string) => {
    if (!rejectionNotes.trim()) {
      toast.error('Please provide rejection notes');
      return;
    }
    
    try {
      await rejectServiceProvider.mutateAsync({ 
        providerId, 
        notes: rejectionNotes 
      });
      refetch();
      setRejectionNotes('');
      setSelectedProvider(null);
      toast.success('Service provider rejected');
    } catch (error) {
      toast.error('Failed to reject service provider');
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
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            Service Providers Management
          </h1>
          <p className="text-blue-100 mt-2">Manage and approve service provider applications</p>
        </div>

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
                  placeholder="Search providers..."
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

        {/* Providers List */}
        <div className="grid gap-6">
          {filteredProviders.length > 0 ? (
            filteredProviders.map((provider) => (
              <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                          {provider.business_name?.charAt(0) || provider.profile_name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {provider.business_name || 'No Business Name'}
                          </h3>
                          <p className="text-lg text-gray-600">{provider.profile_name}</p>
                          <div className="flex items-center gap-4 mt-2">
                            {getStatusBadge(provider.verification_status)}
                            <Badge variant="outline">{provider.provider_type}</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>{provider.profile_email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{provider.profile_phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{provider.location_address || 'No address provided'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>Applied: {new Date(provider.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {provider.business_description && (
                        <p className="text-gray-700 mt-3 line-clamp-2">{provider.business_description}</p>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2 min-w-[200px]">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedProvider(provider)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Service Provider Details</DialogTitle>
                          </DialogHeader>
                          {selectedProvider && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="font-medium">Business Name:</label>
                                  <p>{selectedProvider.business_name || 'N/A'}</p>
                                </div>
                                <div>
                                  <label className="font-medium">Provider Type:</label>
                                  <p>{selectedProvider.provider_type}</p>
                                </div>
                                <div>
                                  <label className="font-medium">Full Name:</label>
                                  <p>{selectedProvider.profile_name}</p>
                                </div>
                                <div>
                                  <label className="font-medium">Email:</label>
                                  <p>{selectedProvider.profile_email}</p>
                                </div>
                                <div>
                                  <label className="font-medium">Phone:</label>
                                  <p>{selectedProvider.profile_phone}</p>
                                </div>
                                <div>
                                  <label className="font-medium">Status:</label>
                                  <p>{selectedProvider.verification_status}</p>
                                </div>
                              </div>
                              {selectedProvider.business_description && (
                                <div>
                                  <label className="font-medium">Description:</label>
                                  <p className="mt-1">{selectedProvider.business_description}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      {provider.verification_status === 'pending' && (
                        <>
                          <Button 
                            onClick={() => handleApprove(provider.id)}
                            disabled={approveServiceProvider.isPending}
                            className="bg-green-600 hover:bg-green-700"
                            size="sm"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => setSelectedProvider(provider)}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reject Service Provider</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <p>Are you sure you want to reject this service provider application?</p>
                                <Textarea
                                  placeholder="Please provide a reason for rejection..."
                                  value={rejectionNotes}
                                  onChange={(e) => setRejectionNotes(e.target.value)}
                                />
                                <div className="flex gap-2">
                                  <Button 
                                    onClick={() => handleReject(provider.id)}
                                    disabled={rejectServiceProvider.isPending}
                                    variant="destructive"
                                  >
                                    Confirm Reject
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    onClick={() => {
                                      setSelectedProvider(null);
                                      setRejectionNotes('');
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No service providers found matching your criteria.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminServiceProviders;
