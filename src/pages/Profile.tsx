
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Calendar, Star, Package, Heart } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: profile, isLoading, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: ''
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || ''
      });
    }
  }, [profile]);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync(formData);
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading profile...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your account information and preferences.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Info Card */}
            <div className="lg:col-span-1">
              <Card className="border-orange-200 rounded-xl">
                <CardHeader className="text-center bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-xl">
                  <Avatar className="w-16 h-16 mx-auto mb-3 border-4 border-white">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback className="bg-white text-orange-600 text-lg">
                      {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg">{profile?.full_name || 'User'}</CardTitle>
                  <CardDescription className="text-orange-100 text-sm">{user?.email}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Mail className="h-3 w-3 text-orange-500" />
                      <span>{user?.email}</span>
                    </div>
                    {profile?.phone && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Phone className="h-3 w-3 text-orange-500" />
                        <span>{profile.phone}</span>
                      </div>
                    )}
                    {profile?.address && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <MapPin className="h-3 w-3 text-orange-500" />
                        <span>{profile.address}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Calendar className="h-3 w-3 text-orange-500" />
                      <span>Joined {new Date(profile?.created_at || '').toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="personal" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4 bg-orange-100">
                  <TabsTrigger 
                    value="personal"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white text-xs"
                  >
                    Personal Info
                  </TabsTrigger>
                  <TabsTrigger 
                    value="orders"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white text-xs"
                  >
                    Orders
                  </TabsTrigger>
                  <TabsTrigger 
                    value="reviews"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white text-xs"
                  >
                    Reviews
                  </TabsTrigger>
                  <TabsTrigger 
                    value="wishlist"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white text-xs"
                  >
                    Wishlist
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="personal">
                  <Card className="border-orange-200 rounded-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <User className="h-4 w-4 text-orange-500" />
                        Personal Information
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Update your personal details and contact information.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="full_name" className="text-sm">Full Name</Label>
                          <Input
                            id="full_name"
                            value={formData.full_name}
                            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                            disabled={!isEditing}
                            className="border-orange-200 focus:border-orange-500 text-sm rounded-lg"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="phone" className="text-sm">Phone Number</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            disabled={!isEditing}
                            className="border-orange-200 focus:border-orange-500 text-sm rounded-lg"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="city" className="text-sm">City</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                            disabled={!isEditing}
                            className="border-orange-200 focus:border-orange-500 text-sm rounded-lg"
                          />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <Label htmlFor="address" className="text-sm">Address</Label>
                          <Textarea
                            id="address"
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            disabled={!isEditing}
                            className="border-orange-200 focus:border-orange-500 text-sm rounded-lg"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!isEditing ? (
                          <Button 
                            onClick={() => setIsEditing(true)}
                            size="sm"
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-sm px-4 py-2 rounded-lg"
                          >
                            Edit Profile
                          </Button>
                        ) : (
                          <>
                            <Button 
                              onClick={handleSave}
                              disabled={updateProfile.isPending}
                              size="sm"
                              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-sm px-4 py-2 rounded-lg"
                            >
                              {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setIsEditing(false)}
                              size="sm"
                              className="border-orange-200 text-orange-600 hover:bg-orange-50 text-sm px-4 py-2 rounded-lg"
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="orders">
                  <Card className="border-orange-200 rounded-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Package className="h-4 w-4 text-orange-500" />
                        Order History
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <Package className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-600">No orders found</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews">
                  <Card className="border-orange-200 rounded-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Star className="h-4 w-4 text-orange-500" />
                        My Reviews
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <Star className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-600">No reviews yet</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="wishlist">
                  <Card className="border-orange-200 rounded-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Heart className="h-4 w-4 text-orange-500" />
                        My Wishlist
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <Heart className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-600">No items in wishlist</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
