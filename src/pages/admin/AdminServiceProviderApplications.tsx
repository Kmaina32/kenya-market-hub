
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Eye
} from 'lucide-react';
import { 
  useServiceProviderApplications,
  useApproveServiceProviderApplication,
  useRejectServiceProviderApplication 
} from '@/hooks/useServiceProviderApplications';
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

const AdminServiceProviderApplications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [selectedApplicationId, setSelectedApplicationId] = useState<string>('');

  const { data: applications, isLoading } = useServiceProviderApplications();
  const approveApplicationMutation = useApproveServiceProviderApplication();
  const rejectApplicationMutation = useRejectServiceProviderApplication();

  const filteredApplications = applications?.filter(app => 
    (app.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     app.business_email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedStatus ? app.status === selectedStatus : true)
  ) || [];

  const handleApprove = (applicationId: string) => {
    approveApplicationMutation.mutate(applicationId);
  };

  const handleReject = (applicationId: string) => {
    rejectApplicationMutation.mutate({
      applicationId,
      notes: rejectionNotes
    });
    setRejectionNotes('');
    setSelectedApplicationId('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Service Provider Applications</h2>
          <p className="text-gray-600">Review and manage service provider applications</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <Input
          placeholder="Search applications..."
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
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Applications List */}
      <Card>
        <CardHeader>
          <CardTitle>Applications ({filteredApplications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading applications...</div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No applications found</div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <div key={application.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-lg">{application.business_name}</h3>
                        {getStatusBadge(application.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">Service Type:</span>
                            <span>{application.service_type}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">Email:</span>
                            <span>{application.business_email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">Phone:</span>
                            <span>{application.business_phone}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">Address:</span>
                            <span>{application.business_address}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">Submitted:</span>
                            <span>{new Date(application.submitted_at).toLocaleDateString()}</span>
                          </div>
                          {application.license_number && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">License:</span>
                              <span>{application.license_number}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {application.business_description && (
                        <div className="mt-3">
                          <span className="font-medium text-sm">Description:</span>
                          <p className="text-sm text-gray-600 mt-1">{application.business_description}</p>
                        </div>
                      )}

                      {application.admin_notes && (
                        <div className="mt-3 p-3 bg-red-50 rounded-lg">
                          <span className="font-medium text-sm text-red-800">Admin Notes:</span>
                          <p className="text-sm text-red-700 mt-1">{application.admin_notes}</p>
                        </div>
                      )}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Application Details - {application.business_name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="font-medium">Business Name:</label>
                                  <p>{application.business_name}</p>
                                </div>
                                <div>
                                  <label className="font-medium">Service Type:</label>
                                  <p>{application.service_type}</p>
                                </div>
                                <div>
                                  <label className="font-medium">Email:</label>
                                  <p>{application.business_email}</p>
                                </div>
                                <div>
                                  <label className="font-medium">Phone:</label>
                                  <p>{application.business_phone}</p>
                                </div>
                              </div>
                              
                              <div>
                                <label className="font-medium">Description:</label>
                                <p className="mt-1">{application.business_description}</p>
                              </div>
                              
                              <div>
                                <label className="font-medium">Address:</label>
                                <p className="mt-1">{application.business_address}</p>
                              </div>

                              {application.experience_years && (
                                <div>
                                  <label className="font-medium">Years of Experience:</label>
                                  <p>{application.experience_years}</p>
                                </div>
                              )}

                              {application.service_areas && application.service_areas.length > 0 && (
                                <div>
                                  <label className="font-medium">Service Areas:</label>
                                  <p>{application.service_areas.join(', ')}</p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        {application.status === 'pending' && (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleApprove(application.id)}
                              disabled={approveApplicationMutation.isPending}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem 
                                  onSelect={(e) => {
                                    e.preventDefault();
                                    setSelectedApplicationId(application.id);
                                  }}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Reject Application</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <label className="text-sm font-medium">Rejection Notes (Optional)</label>
                                    <Textarea
                                      placeholder="Provide reason for rejection..."
                                      value={rejectionNotes}
                                      onChange={(e) => setRejectionNotes(e.target.value)}
                                      className="mt-1"
                                    />
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" size="sm">Cancel</Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => handleReject(selectedApplicationId)}
                                      disabled={rejectApplicationMutation.isPending}
                                    >
                                      Reject Application
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </>
                        )}
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

export default AdminServiceProviderApplications;
