import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Check, X, Eye, Store, Car, Users } from 'lucide-react';
import { useVendorApplications, useApproveVendor, useRejectVendor, useDriverApplications, useApproveDriver, useRejectDriver } from '@/hooks/useAdminVendorApprovals';
import { formatDistanceToNow } from 'date-fns';

const AdminApprovals = () => {
  const [activeTab, setActiveTab] = useState<'vendors' | 'drivers'>('vendors');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionNotes, setRejectionNotes] = useState('');

  const { data: vendorApplications = [], isLoading: vendorLoading } = useVendorApplications();
  const { data: driverApplications = [], isLoading: driverLoading } = useDriverApplications();
  const approveVendor = useApproveVendor();
  const rejectVendor = useRejectVendor();
  const approveDriver = useApproveDriver();
  const rejectDriver = useRejectDriver();

  const filteredVendorApplications = vendorApplications.filter(app =>
    app.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.business_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDriverApplications = driverApplications.filter(app =>
    app.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.license_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = async (id: string, type: 'vendor' | 'driver') => {
    if (type === 'vendor') {
      await approveVendor.mutateAsync(id);
    } else {
      await approveDriver.mutateAsync(id);
    }
  };

  const handleReject = async () => {
    if (!selectedApplication) return;
    
    try {
      if (activeTab === 'vendors') {
        await rejectVendor.mutateAsync({
          applicationId: selectedApplication.id,
          notes: rejectionNotes
        });
      } else {
        await rejectDriver.mutateAsync({
          applicationId: selectedApplication.id,
          notes: rejectionNotes
        });
      }
      setIsRejectModalOpen(false);
      setRejectionNotes('');
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error rejecting application:', error);
    }
  };

  const openRejectModal = (application: any) => {
    setSelectedApplication(application);
    setIsRejectModalOpen(true);
  };

  const openViewModal = (application: any) => {
    setSelectedApplication(application);
    setIsViewModalOpen(true);
  };

  const renderVendorApplications = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Business Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Submitted</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredVendorApplications.map((application) => (
          <TableRow key={application.id}>
            <TableCell className="font-medium">
              {application.business_name}
            </TableCell>
            <TableCell>{application.business_email}</TableCell>
            <TableCell className="max-w-xs truncate">
              {application.business_description}
            </TableCell>
            <TableCell>
              <Badge 
                variant={
                  application.status === 'pending' ? 'default' :
                  application.status === 'approved' ? 'default' : 'destructive'
                }
                className={
                  application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  application.status === 'approved' ? 'bg-green-100 text-green-800' : ''
                }
              >
                {application.status}
              </Badge>
            </TableCell>
            <TableCell>
              {formatDistanceToNow(new Date(application.submitted_at), { addSuffix: true })}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openViewModal(application)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                {application.status === 'pending' && (
                  <>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(application.id, 'vendor')}
                      disabled={approveVendor.isPending}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openRejectModal(application)}
                      disabled={rejectVendor.isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderDriverApplications = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Driver Name</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>License</TableHead>
          <TableHead>Vehicle</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Submitted</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredDriverApplications.map((application) => (
          <TableRow key={application.id}>
            <TableCell className="font-medium">
              {application.full_name}
            </TableCell>
            <TableCell>{application.phone}</TableCell>
            <TableCell>{application.license_number}</TableCell>
            <TableCell>
              {application.vehicle_make} {application.vehicle_model} ({application.vehicle_year})
            </TableCell>
            <TableCell>
              <Badge 
                variant={
                  application.status === 'pending' ? 'default' :
                  application.status === 'approved' ? 'default' : 'destructive'
                }
                className={
                  application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  application.status === 'approved' ? 'bg-green-100 text-green-800' : ''
                }
              >
                {application.status}
              </Badge>
            </TableCell>
            <TableCell>
              {formatDistanceToNow(new Date(application.submitted_at), { addSuffix: true })}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openViewModal(application)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                {application.status === 'pending' && (
                  <>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(application.id, 'driver')}
                      disabled={approveDriver.isPending}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openRejectModal(application)}
                      disabled={rejectDriver.isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Applications & Approvals</h1>
        <p className="text-gray-600">Review and approve vendor and driver applications</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b">
        <button
          onClick={() => setActiveTab('vendors')}
          className={`pb-2 px-1 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'vendors'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Store className="h-4 w-4 inline mr-2" />
          Vendor Applications
        </button>
        <button
          onClick={() => setActiveTab('drivers')}
          className={`pb-2 px-1 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'drivers'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Car className="h-4 w-4 inline mr-2" />
          Driver Applications
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search applications..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {activeTab === 'vendors' ? (
              <>
                <Store className="h-5 w-5 mr-2" />
                Vendor Applications ({filteredVendorApplications.length})
              </>
            ) : (
              <>
                <Car className="h-5 w-5 mr-2" />
                Driver Applications ({filteredDriverApplications.length})
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {((activeTab === 'vendors' && vendorLoading) || (activeTab === 'drivers' && driverLoading)) ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <span className="ml-2">Loading applications...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {activeTab === 'vendors' ? renderVendorApplications() : renderDriverApplications()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {activeTab === 'vendors' ? 'Vendor Application Details' : 'Driver Application Details'}
            </DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              {activeTab === 'vendors' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-semibold">Business Name</Label>
                      <p>{selectedApplication.business_name}</p>
                    </div>
                    <div>
                      <Label className="font-semibold">Contact Email</Label>
                      <p>{selectedApplication.business_email}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="font-semibold">Business Description</Label>
                    <p>{selectedApplication.business_description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-semibold">Address</Label>
                      <p>{selectedApplication.business_address}</p>
                    </div>
                    <div>
                      <Label className="font-semibold">Phone</Label>
                      <p>{selectedApplication.business_phone}</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-semibold">Full Name</Label>
                      <p>{selectedApplication.full_name}</p>
                    </div>
                    <div>
                      <Label className="font-semibold">Phone</Label>
                      <p>{selectedApplication.phone}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-semibold">License Number</Label>
                      <p>{selectedApplication.license_number}</p>
                    </div>
                    <div>
                      <Label className="font-semibold">License Plate</Label>
                      <p>{selectedApplication.license_plate}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="font-semibold">Vehicle Make</Label>
                      <p>{selectedApplication.vehicle_make}</p>
                    </div>
                    <div>
                      <Label className="font-semibold">Vehicle Model</Label>
                      <p>{selectedApplication.vehicle_model}</p>
                    </div>
                    <div>
                      <Label className="font-semibold">Year</Label>
                      <p>{selectedApplication.vehicle_year}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejection-notes">Rejection Notes (Optional)</Label>
              <Textarea
                id="rejection-notes"
                value={rejectionNotes}
                onChange={(e) => setRejectionNotes(e.target.value)}
                placeholder="Provide reason for rejection..."
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsRejectModalOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleReject} className="flex-1">
                Reject Application
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminApprovals;