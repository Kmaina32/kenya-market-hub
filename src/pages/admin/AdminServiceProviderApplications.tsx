
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Eye,
  FileText,
  Award,
  TrendingUp
} from 'lucide-react';
import { 
  useServiceProviderApplications,
  useApproveServiceProviderApplication,
  useRejectServiceProviderApplication,
  useServiceProviderApplicationStats 
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
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [selectedApplicationId, setSelectedApplicationId] = useState<string>('');

  const { data: applications = [], isLoading } = useServiceProviderApplications();
  const { data: stats } = useServiceProviderApplicationStats();
  const approveApplicationMutation = useApproveServiceProviderApplication();
  const rejectApplicationMutation = useRejectServiceProviderApplication();

  const filteredApplications = applications.filter(app => 
    (app.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     app.business_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     app.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedStatus ? app.status === selectedStatus : true) &&
    (selectedCategory ? app.service_type === selectedCategory : true)
  );

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

  const getCategoryDisplayName = (category: string) => {
    const names: Record<string, string> = {
      vendor: 'Product Vendor',
      event_promoter: 'Event Promoter',
      driver: 'Driver',
      service_provider: 'Service Provider',
      real_estate_agent: 'Real Estate Agent',
      medical_provider: 'Medical Provider',
      insurance_broker: 'Insurance Broker'
    };
    return names[category] || category;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Service Provider Applications</h2>
          <p className="text-gray-600">Review and manage service provider applications across all categories</p>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="vendor">Product Vendor</SelectItem>
                <SelectItem value="event_promoter">Event Promoter</SelectItem>
                <SelectItem value="driver">Driver</SelectItem>
                <SelectItem value="service_provider">Service Provider</SelectItem>
                <SelectItem value="real_estate_agent">Real Estate Agent</SelectItem>
                <SelectItem value="medical_provider">Medical Provider</SelectItem>
                <SelectItem value="insurance_broker">Insurance Broker</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Applications ({filteredApplications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              Loading applications...
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No applications found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredApplications.map((application) => (
                <div key={application.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {application.business_name}
                        </h3>
                        {getStatusBadge(application.status)}
                        <Badge variant="outline">
                          {getCategoryDisplayName(application.service_type)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-600">
                            <User className="w-4 h-4" />
                            <span>Applicant:</span>
                          </div>
                          <p className="font-medium">
                            {application.user?.profiles?.full_name || application.user?.email?.split('@')[0] || 'N/A'}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span>Email:</span>
                          </div>
                          <p className="font-medium">{application.business_email}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>Phone:</span>
                          </div>
                          <p className="font-medium">{application.business_phone}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>Submitted:</span>
                          </div>
                          <p className="font-medium">
                            {new Date(application.submitted_at).toLocaleDateString()}
                          </p>
                        </div>
                        
                        {application.experience_years && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Award className="w-4 h-4" />
                              <span>Experience:</span>
                            </div>
                            <p className="font-medium">{application.experience_years} years</p>
                          </div>
                        )}
                        
                        {application.specialization && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-600">
                              <TrendingUp className="w-4 h-4" />
                              <span>Specialization:</span>
                            </div>
                            <p className="font-medium">{application.specialization}</p>
                          </div>
                        )}
                      </div>

                      {application.business_description && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-1">Description:</p>
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {application.business_description}
                          </p>
                        </div>
                      )}

                      {application.service_areas && application.service_areas.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Service Areas:</p>
                          <div className="flex flex-wrap gap-2">
                            {application.service_areas.map((area, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                <MapPin className="w-3 h-3 mr-1" />
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {application.admin_notes && (
                        <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                          <p className="text-sm font-medium text-red-800 mb-1">Admin Notes:</p>
                          <p className="text-sm text-red-700">{application.admin_notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>
                                  Application Details - {application.business_name}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Business Name:</label>
                                    <p className="text-sm">{application.business_name}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Category:</label>
                                    <p className="text-sm">{getCategoryDisplayName(application.service_type)}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Email:</label>
                                    <p className="text-sm">{application.business_email}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Phone:</label>
                                    <p className="text-sm">{application.business_phone}</p>
                                  </div>
                                </div>
                                
                                {application.business_description && (
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Description:</label>
                                    <p className="text-sm mt-1 p-3 bg-gray-50 rounded-lg">
                                      {application.business_description}
                                    </p>
                                  </div>
                                )}
                                
                                {application.business_address && (
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Address:</label>
                                    <p className="text-sm mt-1">{application.business_address}</p>
                                  </div>
                                )}

                                {application.license_number && (
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">License Number:</label>
                                    <p className="text-sm">{application.license_number}</p>
                                  </div>
                                )}

                                {application.experience_years && (
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Years of Experience:</label>
                                    <p className="text-sm">{application.experience_years}</p>
                                  </div>
                                )}

                                {application.specialization && (
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Specialization:</label>
                                    <p className="text-sm">{application.specialization}</p>
                                  </div>
                                )}

                                {application.service_areas && application.service_areas.length > 0 && (
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Service Areas:</label>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      {application.service_areas.map((area, index) => (
                                        <Badge key={index} variant="secondary">
                                          {area}
                                        </Badge>
                                      ))}
                                    </div>
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
                                className="text-green-600"
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
                                      setRejectionNotes('');
                                    }}
                                    className="text-red-600"
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
                                    <p className="text-sm text-gray-600">
                                      Please provide a reason for rejecting this application:
                                    </p>
                                    <Textarea
                                      placeholder="Enter rejection reason..."
                                      value={rejectionNotes}
                                      onChange={(e) => setRejectionNotes(e.target.value)}
                                      rows={4}
                                    />
                                    <div className="flex justify-end gap-2">
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => {
                                          setSelectedApplicationId('');
                                          setRejectionNotes('');
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleReject(selectedApplicationId)}
                                        disabled={rejectApplicationMutation.isPending || !rejectionNotes.trim()}
                                      >
                                        {rejectApplicationMutation.isPending ? (
                                          <>
                                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2" />
                                            Rejecting...
                                          </>
                                        ) : (
                                          'Reject Application'
                                        )}
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
