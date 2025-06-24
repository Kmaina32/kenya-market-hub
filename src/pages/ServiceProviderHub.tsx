
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useAllServiceProviderProfiles } from '@/hooks/useServiceProviders';
import { 
  Wrench, 
  Car, 
  Hammer, 
  Scissors, 
  Home, 
  Laptop, 
  Camera,
  Search,
  Plus,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import ServiceProviderCard from '@/components/ServiceProviderCard';

const SERVICE_CATEGORIES = [
  {
    id: 'plumbing',
    title: 'Plumbing Services',
    description: 'Water, drainage, and pipe repairs',
    icon: Wrench,
    color: 'bg-blue-500',
    dashboardUrl: '/service-provider/plumbing'
  },
  {
    id: 'automotive',
    title: 'Automotive Services',
    description: 'Car repairs and maintenance',
    icon: Car,
    color: 'bg-red-500',
    dashboardUrl: '/service-provider/automotive'
  },
  {
    id: 'construction',
    title: 'Construction & Repair',
    description: 'Building and renovation services',
    icon: Hammer,
    color: 'bg-orange-500',
    dashboardUrl: '/service-provider/construction'
  },
  {
    id: 'beauty',
    title: 'Beauty & Wellness',
    description: 'Hair, nails, and spa services',
    icon: Scissors,
    color: 'bg-pink-500',
    dashboardUrl: '/service-provider/beauty'
  },
  {
    id: 'cleaning',
    title: 'Cleaning Services',
    description: 'House and office cleaning',
    icon: Home,
    color: 'bg-green-500',
    dashboardUrl: '/service-provider/cleaning'
  },
  {
    id: 'tech',
    title: 'Tech Support',
    description: 'Computer and device repairs',
    icon: Laptop,
    color: 'bg-purple-500',
    dashboardUrl: '/service-provider/tech'
  },
  {
    id: 'photography',
    title: 'Photography',
    description: 'Event and portrait photography',
    icon: Camera,
    color: 'bg-indigo-500',
    dashboardUrl: '/service-provider/photography'
  }
];

const ServiceProviderHub = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const { data: myProfiles, isLoading: profilesLoading } = useAllServiceProviderProfiles();

  const handleApplyAsProvider = (providerType: string) => {
    console.log('Apply as provider for:', providerType);
    // Navigate to application form
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const filteredCategories = SERVICE_CATEGORIES.filter(category => 
    selectedCategory === 'all' || category.id === selectedCategory
  ).filter(category =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Provider Hub</h1>
          <p className="text-gray-600">Discover opportunities and manage your service provider profiles</p>
        </div>

        {/* User's Service Provider Profiles */}
        {user && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                My Service Provider Profiles
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profilesLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                  <span className="ml-2">Loading your profiles...</span>
                </div>
              ) : myProfiles && myProfiles.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {myProfiles.map((profile) => {
                    const category = SERVICE_CATEGORIES.find(cat => cat.id === profile.provider_type);
                    return (
                      <Card key={profile.id} className="border-l-4 border-l-orange-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{profile.provider_type}</h3>
                            {getStatusIcon(profile.verification_status)}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {profile.business_name || 'No business name set'}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {profile.verification_status}
                          </Badge>
                          <Button 
                            size="sm" 
                            className="w-full mt-3"
                            onClick={() => window.location.href = category?.dashboardUrl || '#'}
                          >
                            Manage Profile
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">You haven't applied for any service provider categories yet.</p>
                  <p className="text-sm text-gray-400">Browse the categories below to get started!</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search service categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Categories</option>
            {SERVICE_CATEGORIES.map(category => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </div>

        {/* Service Categories Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category) => {
            const hasProfile = myProfiles?.some(profile => profile.provider_type === category.id);
            return (
              <ServiceProviderCard
                key={category.id}
                provider={{
                  id: category.id,
                  business_name: category.title,
                  provider_type: category.id,
                  business_description: category.description,
                  is_verified: hasProfile || false,
                  is_active: true
                }}
                onApply={handleApplyAsProvider}
              />
            );
          })}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceProviderHub;
