
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Car, Search, MapPin, Clock, DollarSign } from 'lucide-react';
import { EditButton, DeleteButton, ViewButton } from '@/components/ui/action-buttons';
import { ViewModal, EditModal, DeleteModal } from '@/components/admin/ActionModals';
import { toast } from 'sonner';

type RideStatus = 'requested' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';

const AdminRides = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRide, setSelectedRide] = useState<any>(null);
  const [modalType, setModalType] = useState<'view' | 'edit' | 'delete' | null>(null);
  const queryClient = useQueryClient();

  // Fetch rides
  const { data: rides, isLoading } = useQuery({
    queryKey: ['admin-rides', searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('rides')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`pickup_address.ilike.%${searchTerm}%,destination_address.ilike.%${searchTerm}%`);
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as RideStatus);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });

  // Update ride status mutation
  const updateRideStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: RideStatus }) => {
      const { error } = await supabase
        .from('rides')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rides'] });
      toast.success('Ride status updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update ride status: ${error.message}`);
    }
  });

  // Update ride mutation
  const updateRide = useMutation({
    mutationFn: async ({ id, ...rideData }: any) => {
      const { error } = await supabase
        .from('rides')
        .update(rideData)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rides'] });
      toast.success('Ride updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update ride: ${error.message}`);
    }
  });

  const handleView = (ride: any) => {
    setSelectedRide(ride);
    setModalType('view');
  };

  const handleEdit = (ride: any) => {
    setSelectedRide(ride);
    setModalType('edit');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const editFields = [
    { 
      key: 'status', 
      label: 'Status', 
      type: 'select' as const,
      options: [
        { value: 'requested', label: 'Requested' },
        { value: 'accepted', label: 'Accepted' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
      ]
    },
    { key: 'pickup_address', label: 'Pickup Address', type: 'text' as const },
    { key: 'destination_address', label: 'Destination Address', type: 'text' as const },
    { key: 'estimated_fare', label: 'Estimated Fare', type: 'number' as const },
    { key: 'actual_fare', label: 'Actual Fare', type: 'number' as const }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ride Management</h1>
          <p className="text-gray-600">Monitor and manage all ride requests</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search rides..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="requested">Requested</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Car className="h-5 w-5 mr-2" />
            All Rides ({rides?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <span className="ml-2">Loading rides...</span>
            </div>
          ) : rides && rides.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ride ID</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Vehicle Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Fare</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rides.map((ride) => (
                    <TableRow key={ride.id}>
                      <TableCell className="font-mono text-sm">
                        {ride.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <MapPin className="h-3 w-3 mr-1 text-green-500" />
                            <span className="truncate max-w-32">{ride.pickup_address}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <MapPin className="h-3 w-3 mr-1 text-red-500" />
                            <span className="truncate max-w-32">{ride.destination_address}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{ride.vehicle_type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary"
                          className={getStatusColor(ride.status)}
                        >
                          {ride.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Est: KSh {ride.estimated_fare || 0}</div>
                          {ride.actual_fare && (
                            <div className="text-green-600">Act: KSh {ride.actual_fare}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-gray-400" />
                          <span className="text-sm">{ride.duration_minutes || 0}m</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(ride.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <ViewButton onClick={() => handleView(ride)} />
                          <EditButton onClick={() => handleEdit(ride)} />
                          <Select
                            value={ride.status}
                            onValueChange={(status) => updateRideStatus.mutate({ id: ride.id, status })}
                          >
                            <SelectTrigger className="w-24 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="requested">Requested</SelectItem>
                              <SelectItem value="accepted">Accepted</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Car className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Rides Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No rides match your search criteria.' : 'Ride requests will appear here.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {selectedRide && (
        <>
          <ViewModal
            isOpen={modalType === 'view'}
            onClose={() => setModalType(null)}
            title={`Ride Details - ${selectedRide.id.slice(0, 8)}`}
            data={selectedRide}
          />

          <EditModal
            isOpen={modalType === 'edit'}
            onClose={() => setModalType(null)}
            title={`Edit Ride - ${selectedRide.id.slice(0, 8)}`}
            data={selectedRide}
            fields={editFields}
            onSave={(data) => updateRide.mutate({ id: selectedRide.id, ...data })}
          />
        </>
      )}
    </div>
  );
};

export default AdminRides;
