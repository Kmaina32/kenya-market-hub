
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Wrench,
  User,
  Star,
  MapPin,
  Phone,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Loader2,
  Mail,
  Copy,
  MoreHorizontal,
  Edit,
  Trash2,
  Ban,
  Check,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ServiceProvider {
  id: string;
  user_id: string;
  business_name: string;
  description: string;
  email: string;
  phone: string;
  location_address: string;
  hourly_rate_min: number;
  hourly_rate_max: number;
  is_active: boolean;
  verification_status: string;
  created_at: string;
  updated_at: string;
}

const AdminServiceProviders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch service providers
  const { data: providers, isLoading: providersLoading } = useQuery({
    queryKey: ['service-providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_provider_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ServiceProvider[];
    },
  });

  // Update provider status mutation
  const updateProviderStatusMutation = useMutation({
    mutationFn: async ({ providerId, status }: { providerId: string; status: boolean }) => {
      const { data, error } = await supabase
        .from('service_provider_profiles')
        .update({ is_active: status })
        .eq('id', providerId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-providers'] });
      toast({
        title: 'Provider Status Updated',
        description: 'Service provider status has been updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to update provider status: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const filteredProviders = providers?.filter(provider =>
    provider.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.email.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(provider => selectedStatus ? provider.verification_status === selectedStatus : true) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Service Providers</h2>
          <p className="text-gray-600">Manage service provider profiles</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <Input
          placeholder="Search providers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Providers List */}
      <Card>
        <CardHeader>
          <CardTitle>Service Providers</CardTitle>
        </CardHeader>
        <CardContent>
          {providersLoading ? (
            <div className="text-center py-8">Loading providers...</div>
          ) : filteredProviders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No providers found</div>
          ) : (
            <div className="space-y-4">
              {filteredProviders.map((provider) => (
                <div key={provider.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{provider.business_name}</h3>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          <strong>Description:</strong> {provider.description || 'No description provided'}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Location:</strong> {provider.location_address || 'Not specified'}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Email:</strong> {provider.email || 'Not provided'}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Phone:</strong> {provider.phone || 'Not provided'}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Hourly Rate:</strong> KSh {provider.hourly_rate_min || 0} - {provider.hourly_rate_max || 0}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant={provider.is_active ? 'default' : 'outline'}>
                            {provider.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge variant={provider.verification_status === 'verified' ? 'default' : provider.verification_status === 'rejected' ? 'destructive' : 'secondary'}>
                            {provider.verification_status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateProviderStatusMutation.mutate({
                            providerId: provider.id,
                            status: !provider.is_active
                          })}
                        >
                          {provider.is_active ? (
                            <>
                              <Ban className="h-4 w-4 mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Profile
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminServiceProviders;
