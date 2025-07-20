
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Car, Star, User, Phone, Mail, MapPin, Calendar, Award } from 'lucide-react';
import { useMyDriverProfile, useUpdateDriverProfile } from '@/hooks/useDriver';
import { useToast } from '@/hooks/use-toast';

const DriverProfile = () => {
  const { data: profile, isLoading } = useMyDriverProfile();
  const updateProfile = useUpdateDriverProfile();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    license_number: '',
    vehicle_make: '',
    vehicle_model: '',
    vehicle_year: '',
    license_plate: '',
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone_number: profile.phone_number || '',
        license_number: profile.license_number || '',
        vehicle_make: profile.vehicle_make || '',
        vehicle_model: profile.vehicle_model || '',
        vehicle_year: profile.vehicle_year?.toString() || '',
        license_plate: profile.license_plate || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync({
        license_number: formData.license_number,
        vehicle_make: formData.vehicle_make,
        vehicle_model: formData.vehicle_model,
        vehicle_year: formData.vehicle_year ? parseInt(formData.vehicle_year) : undefined,
        license_plate: formData.license_plate,
        phone_number: formData.phone_number,
      });
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600">Loading Profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Profile not found. Please contact support.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <User className="h-8 w-8" />
          Driver Profile
        </h1>
        <p className="text-blue-100 mt-2">Manage your driver information and vehicle details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <Avatar className="h-32 w-32 mx-auto mb-4">
              <AvatarImage src="" />
              <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                {profile.full_name?.charAt(0) || 'D'}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl">{profile.full_name || 'Driver'}</CardTitle>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-lg font-semibold">{(profile.rating || 0).toFixed(1)}</span>
            </div>
            <Badge variant="outline" className="mt-2">
              {profile.availability_status || 'Offline'}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Total Rides: {profile.total_rides || 0}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Award className="h-4 w-4" />
              <span>License: {profile.license_number || 'Not provided'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Profile Information</CardTitle>
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone_number">Phone</Label>
                    <Input
                      id="phone_number"
                      value={formData.phone_number}
                      onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="license_number">License Number</Label>
                    <Input
                      id="license_number"
                      value={formData.license_number}
                      onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="vehicle_make">Vehicle Make</Label>
                    <Input
                      id="vehicle_make"
                      value={formData.vehicle_make}
                      onChange={(e) => setFormData({ ...formData, vehicle_make: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehicle_model">Vehicle Model</Label>
                    <Input
                      id="vehicle_model"
                      value={formData.vehicle_model}
                      <Input id="editVehicleModel" value={formData.vehicle_model} onChange={(e) => setFormData({ ...formData, vehicle_model: e.target.value })} className="col-span-3" />
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehicle_year">Vehicle Year</Label>
                    <Input
                      id="vehicle_year"
                      type="number"
                      value={formData.vehicle_year}
                      onChange={(e) => setFormData({ ...formData, vehicle_year: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="license_plate">License Plate</Label>
                  <Input
                    id="license_plate"
                    value={formData.license_plate}
                    onChange={(e) => setFormData({ ...formData, license_plate: e.target.value })}
                  />
                </div>
                <Button type="submit" disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? 'Updating...' : 'Save Changes'}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Name:</span>
                    <span>{profile.full_name || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Email:</span>
                    <span>{profile.email || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Phone:</span>
                    <span>{profile.phone_number || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">License:</span>
                    <span>{profile.license_number || 'Not provided'}</span>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Vehicle Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm font-medium">Make:</span>
                      <p>{profile.vehicle_make || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Model:</span>
                      <p>{profile.vehicle_model || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Year:</span>
                      <p>{profile.vehicle_year || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm font-medium">License Plate:</span>
                    <p>{profile.license_plate || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverProfile;
