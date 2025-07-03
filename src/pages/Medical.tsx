
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Star, Clock, Stethoscope, Plus, Filter, Search, Heart, Calendar, User, Shield, Building, Award } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AppointmentBookingModal from '@/components/AppointmentBookingModal';

interface MedicalProvider {
  id: string;
  full_name: string;
  provider_type: 'doctor' | 'nurse' | 'pharmacist' | 'therapist';
  specialization_id?: string;
  rating: number;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  facility_id?: string;
}

interface MedicalSpecialization {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

interface MedicalFacility {
  id: string;
  name: string;
  facility_type: 'hospital' | 'clinic' | 'pharmacy' | 'lab';
  address: string;
  phone?: string;
  email?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  location_coordinates?: any;
}

interface Medication {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  stock_quantity: number;
  requires_prescription: boolean;
  image_url?: string;
  pharmacy_id: string;
  created_at: string;
  updated_at: string;
}

const Medical: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'providers' | 'facilities' | 'medications'>('providers');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('all');
  const [selectedProvider, setSelectedProvider] = useState<MedicalProvider | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const { data: providers, isLoading: providersLoading } = useQuery({
    queryKey: ['medical-providers', searchTerm, selectedSpecialization],
    queryFn: async () => {
      let query = supabase
        .from('medical_providers')
        .select('*')
        .eq('is_active', true)
        .eq('is_verified', true);

      if (searchTerm) {
        query = query.ilike('full_name', `%${searchTerm}%`);
      }

      if (selectedSpecialization !== 'all') {
        query = query.eq('specialization_id', selectedSpecialization);
      }

      const { data, error } = await query.order('rating', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: specializations } = useQuery({
    queryKey: ['medical-specializations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medical_specializations')
        .select('*')
        .order('name');
      if (error) throw error;
      return data || [];
    },
  });

  const { data: facilities, isLoading: facilitiesLoading } = useQuery({
    queryKey: ['medical-facilities', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('medical_facilities')
        .select('*')
        .eq('is_verified', true);

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      const { data, error } = await query.order('name');
      if (error) throw error;
      return data || [];
    },
  });

  const { data: medications, isLoading: medicationsLoading } = useQuery({
    queryKey: ['medications', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('medications')
        .select('*');

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      const { data, error } = await query.order('name');
      if (error) throw error;
      return data || [];
    },
  });

  const handleBookAppointment = (provider: MedicalProvider) => {
    // Map database provider type to frontend provider type
    const mappedProvider: MedicalProvider = {
      ...provider,
      provider_type: mapProviderType(provider.provider_type as any)
    };
    setSelectedProvider(mappedProvider);
    setIsBookingModalOpen(true);
  };

  // Helper function to map database provider types to frontend types
  const mapProviderType = (dbType: string): 'doctor' | 'nurse' | 'pharmacist' | 'therapist' => {
    switch (dbType) {
      case 'lab_technician':
      case 'ambulance_driver':
      case 'dentist':
      case 'physiotherapist':
        return 'therapist';
      default:
        return dbType as 'doctor' | 'nurse' | 'pharmacist' | 'therapist';
    }
  };

  const renderProviders = () => {
    if (providersLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (!providers || providers.length === 0) {
      return (
        <div className="text-center py-12">
          <Stethoscope className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Medical Providers Found</h3>
          <p className="text-gray-600">Try adjusting your search criteria.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider) => (
          <Card key={provider.id} className="hover:shadow-lg transition-shadow border border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{provider.full_name}</h3>
                  <Badge variant="outline" className="text-xs capitalize mb-2">
                    {provider.provider_type}
                  </Badge>
                  {provider.is_verified && (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{provider.rating?.toFixed(1) || '0.0'}</span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4 text-blue-500" />
                  <span className="capitalize">{provider.provider_type}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span>Available for appointments</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleBookAppointment(provider)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
                <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderFacilities = () => {
    if (facilitiesLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (!facilities || facilities.length === 0) {
      return (
        <div className="text-center py-12">
          <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Medical Facilities Found</h3>
          <p className="text-gray-600">Try adjusting your search criteria.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((facility) => (
          <Card key={facility.id} className="hover:shadow-lg transition-shadow border border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{facility.name}</h3>
                  <Badge variant="outline" className="text-xs capitalize mb-2">
                    {facility.facility_type}
                  </Badge>
                  {facility.is_verified && (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <span>{facility.address}</span>
                </div>
                {facility.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4 text-blue-500" />
                    <span>{facility.phone}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  View Location
                </Button>
                <Button variant="outline" size="sm" className="border-green-200 text-green-600 hover:bg-green-50">
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderMedications = () => {
    if (medicationsLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (!medications || medications.length === 0) {
      return (
        <div className="text-center py-12">
          <Plus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Medications Found</h3>
          <p className="text-gray-600">Try adjusting your search criteria.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {medications.map((medication) => (
          <Card key={medication.id} className="hover:shadow-lg transition-shadow border border-gray-100">
            <CardContent className="p-4">
              <div className="mb-4">
                {medication.image_url ? (
                  <img
                    src={medication.image_url}
                    alt={medication.name}
                    className="w-full h-32 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center">
                    <Plus className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">{medication.name}</h3>
                <Badge variant="outline" className="text-xs mb-2">
                  {medication.category}
                </Badge>
                {medication.requires_prescription && (
                  <Badge variant="destructive" className="text-xs ml-2">
                    Prescription Required
                  </Badge>
                )}
              </div>

              {medication.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{medication.description}</p>
              )}

              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-green-600">KSh {medication.price}</span>
                <span className="text-sm text-gray-500">Stock: {medication.stock_quantity}</span>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                disabled={medication.stock_quantity === 0}
              >
                {medication.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        {/* Hero Section */}
        <div
          className="relative h-64 overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 shadow-xl"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="relative z-10 flex items-center justify-center h-full px-6 sm:px-8 lg:px-12">
            <div className="text-center text-white max-w-3xl mx-auto">
              <Stethoscope className="h-16 w-16 mx-auto mb-4 text-blue-100" />
              <h1 className="text-3xl md:text-4xl font-bold mb-3 drop-shadow-lg">Medical Services</h1>
              <p className="text-lg text-blue-100 font-light leading-relaxed">
                Connect with verified healthcare providers, find medical facilities, and order medications.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-4 mb-8">
            {[
              { key: 'providers', label: 'Healthcare Providers', icon: Stethoscope },
              { key: 'facilities', label: 'Medical Facilities', icon: Building },
              { key: 'medications', label: 'Medications', icon: Plus }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === key
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-200'
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            ))}
          </div>

          {/* Search and Filters */}
          <Card className="mb-8 p-6 shadow-lg border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {activeTab === 'providers' && (
                <div className="md:w-64">
                  <select
                    value={selectedSpecialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Specializations</option>
                    {specializations?.map((spec) => (
                      <option key={spec.id} value={spec.id}>
                        {spec.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </Card>

          {/* Content */}
          <div className="space-y-6">
            {activeTab === 'providers' && renderProviders()}
            {activeTab === 'facilities' && renderFacilities()}
            {activeTab === 'medications' && renderMedications()}
          </div>
        </div>

        {/* Appointment Booking Modal */}
        {selectedProvider && (
          <AppointmentBookingModal
            open={isBookingModalOpen}
            onOpenChange={(open) => {
              setIsBookingModalOpen(open);
              if (!open) setSelectedProvider(null);
            }}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default Medical;
