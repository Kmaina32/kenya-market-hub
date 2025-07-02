import React, { useState, useCallback, useMemo, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import {
  Hospital, Pill, Stethoscope, Clock, MapPin, Star, Phone,
  Search, Filter, Loader2, ArrowDownUp, CheckCircle, Eye, ShoppingCart, Info, Building,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Fixed: Adjust import paths based on your clarification - assuming direct in components/

import AppointmentBookingModal from '@/components/AppointmentBookingModal';
import MedicationDetailsModal from '@/components/MedicationDetailsModal';


// --- Interfaces for data types ---
// Fixed: Align MedicalProvider with Supabase medical_providers table structure + joins
interface MedicalProvider {
  id: string;
  full_name: string; // Direct from DB table
  provider_type: string; // Direct from DB table (can be enum)
  rating?: number; // From DB table
  is_verified?: boolean; // From DB table
  created_at: string; // From DB table

  // Joined/derived properties:
  specialty: string; // From medical_specializations (name) or derived from provider_type
  reviews: number; // Placeholder/derived (e.g., from a reviews table count)
  location: string; // From medical_facilities (address) or profiles
  distance?: string; // Runtime calculated
  phone: string; // From medical_facilities or profiles
  hours: string; // Mocked or fetched from another table
  services: string[]; // Mocked or fetched from another table (e.g., many-to-many relationship)
  profile_image_url?: string; // From profiles (avatar_url) or specific provider image storage
  facility_name?: string; // From medical_facilities (name)
}

// Fixed: Align Medication with Supabase medications table structure + joins
interface Medication {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  prescription_required: boolean; // Corresponds to requires_prescription in DB
  image_url?: string; // From DB
  // Joined/derived properties:
  in_stock: boolean; // Derived from stock_quantity in DB
  pharmacy: string; // From joined medical_facilities (name)
  stock_quantity?: number; // From DB (used to derive in_stock)
}


// --- Constants for filters and sorts ---
const PROVIDER_SPECIALTIES = ['All', 'General Hospital', 'Pediatrician', 'Multi-specialty Hospital', 'Family Medicine', 'Dentist', 'Dermatologist', 'Physiotherapist', 'Optician'];
const MEDICATION_CATEGORIES = ['All', 'Pain Relief', 'Antibiotic', 'Supplement', 'Diabetes', 'Digestive Health', 'Vitamins', 'Allergy'];

const PROVIDER_SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'rating_desc', label: 'Highest Rated' },
  { value: 'distance_asc', label: 'Closest' }, // Requires user's geolocation and provider coordinates
  { value: 'name_asc', label: 'Name (A-Z)' },
];

const MEDICATION_SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name (A-Z)' },
];


const MedicalPage = () => {
  const [activeTab, setActiveTab] = useState('providers');
  const [searchTerm, setSearchTerm] = useState('');
  const [providerSpecialtyFilter, setProviderSpecialtyFilter] = useState('All');
  const [medicationCategoryFilter, setMedicationCategoryFilter] = useState('All');
  const [providerSortBy, setProviderSortBy] = useState('relevance');
  const [medicationSortBy, setMedicationSortBy] = useState('relevance');
  const [prescriptionFilter, setPrescriptionFilter] = useState<'all' | 'required' | 'not_required'>('all');

  const [selectedProvider, setSelectedProvider] = useState<MedicalProvider | null>(null);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showMedicationDetailsModal, setShowMedicationDetailsModal] = useState(false);

  // Debounced search term for better performance
  const [debouncedSearchTerm, setSearchTermDebounced] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTermDebounced(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // --- Fetch Medical Providers from Supabase ---
  const { data: providers = [], isLoading: isLoadingProviders, isFetching: isFetchingProviders } = useQuery<MedicalProvider[]>({
    queryKey: ['medicalProviders', debouncedSearchTerm, providerSpecialtyFilter, providerSortBy],
    queryFn: async () => {
      // Adjusted select to explicitly get related data needed for MedicalProvider interface
      let query = supabase.from('medical_providers')
        .select(`
          id, full_name, provider_type, rating, is_verified, created_at,
          medical_specializations(name), -- Assumes join for specialty name
          medical_facilities(name, address, phone), -- Assumes join for facility info
          profiles(avatar_url, phone) -- Assumes join for profile image and phone
        `)
        .eq('is_active', true);

      // Apply filters
      if (debouncedSearchTerm) {
        query = query.or(`full_name.ilike.%${debouncedSearchTerm}%,provider_type.ilike.%${debouncedSearchTerm}%`);
        // Note: Filtering by joined table columns like medical_specializations.name usually requires rpc functions or separate queries
        // For simplicity in client-side filtering mock, we'll keep direct column access where possible.
      }
      if (providerSpecialtyFilter !== 'All') {
        // Direct filter on the joined table's name (requires advanced RLS or RPC)
        // For current context, assuming `provider_type` can be used or a pre-defined filter.
        // A more robust solution might use a function to get specialty_id from name.
        query = query.eq('medical_specializations.name', providerSpecialtyFilter);
      }

      // Apply sorting
      switch (providerSortBy) {
        case 'rating_desc': query = query.order('rating', { ascending: false, nullsFirst: true }); break;
        case 'name_asc': query = query.order('full_name', { ascending: true }); break; // Sort by DB column
        // 'distance_asc' would require client-side calculation after fetching or PostGIS function
        default: query = query.order('full_name', { ascending: true }); // Default sort by full_name
      }

      const { data, error } = await query;
      if (error) throw error;

      // Fixed: Explicitly map raw Supabase data to MedicalProvider interface
      // Ensure all properties are correctly mapped and handled for nulls/undefined
      return (data || []).map((p: any) => ({
        id: p.id,
        full_name: p.full_name,
        provider_type: p.provider_type,
        rating: p.rating || 0, // Default rating to 0 if null
        is_verified: p.is_verified || false, // Default to false if null
        created_at: p.created_at, // Assuming created_at exists
        specialty: p.medical_specializations?.name || p.provider_type, // Use joined specialty name
        reviews: 0, // Placeholder: implement actual review count logic if needed
        location: p.medical_facilities?.address || 'Nairobi, Kenya', // From joined facility or default
        distance: 'N/A', // Runtime calculated
        phone: p.medical_facilities?.phone || p.profiles?.phone || 'N/A', // From joined facility or profile
        hours: 'Mon-Fri, 9AM-5PM', // Placeholder: fetch real hours
        services: [], // Placeholder: fetch real services if applicable
        profile_image_url: p.profiles?.avatar_url || 'https://via.placeholder.com/150', // From joined profile
        facility_name: p.medical_facilities?.name,
      })) as MedicalProvider[];
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  // --- Fetch Medications from Supabase ---
  const { data: meds = [], isLoading: isLoadingMeds, isFetching: isFetchingMeds } = useQuery<Medication[]>({
    queryKey: ['medications', debouncedSearchTerm, medicationCategoryFilter, medicationSortBy, prescriptionFilter],
    queryFn: async () => {
      let query = supabase.from('medications')
        .select(`*, medical_facilities(name)`) // Join to get pharmacy name
        .eq('is_active', true);

      // Apply filters
      if (debouncedSearchTerm) {
        query = query.or(`name.ilike.%${debouncedSearchTerm}%,description.ilike.%${debouncedSearchTerm}%,category.ilike.%${debouncedSearchTerm}%`);
      }
      if (medicationCategoryFilter !== 'All') {
        query = query.eq('category', medicationCategoryFilter);
      }
      if (prescriptionFilter === 'required') {
        query = query.eq('requires_prescription', true);
      } else if (prescriptionFilter === 'not_required') {
        query = query.eq('requires_prescription', false);
      }

      // Apply sorting
      switch (medicationSortBy) {
        case 'price_asc': query = query.order('price', { ascending: true }); break;
        case 'price_desc': query = query.order('price', { ascending: false }); break;
        case 'name_asc': query = query.order('name', { ascending: true }); break;
        default: query = query.order('name', { ascending: true });
      }

      const { data, error } = await query;
      if (error) throw error;

      // Fixed: Explicitly map raw Supabase data to Medication interface
      return (data || []).map((m: any) => ({
        id: m.id,
        name: m.name,
        category: m.category,
        price: m.price,
        in_stock: m.stock_quantity > 0, // Derive in_stock from stock_quantity
        pharmacy: m.medical_facilities?.name || 'Unknown Pharmacy',
        description: m.description || '',
        prescription_required: m.requires_prescription || false, // Default to false if null
        image_url: m.image_url || 'https://via.placeholder.com/150/FF8C00/FFFFFF?text=Med',
        stock_quantity: m.stock_quantity // Keep for internal logic if needed
      })) as Medication[];
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });


  // --- Handlers for Medical Providers ---
  const handleBookAppointment = useCallback((provider: MedicalProvider) => {
    setSelectedProvider(provider);
    setShowAppointmentModal(true);
    toast.success(`Booking appointment with ${provider.full_name}.`); // Use full_name
  }, []);

  const handleCallProvider = useCallback((provider: MedicalProvider) => {
    if (provider.phone && provider.phone !== 'N/A') {
      window.location.href = `tel:${provider.phone}`;
      toast.success(`Calling ${provider.full_name}...`); // Use full_name
    } else {
      toast.error('Phone number not available for this provider.');
    }
  }, []);

  const handleViewProviderDetails = useCallback((provider: MedicalProvider) => {
    toast.info(`Opening details for ${provider.full_name} (feature in development).`); // Use full_name
  }, []);

  // --- Handlers for Medications ---
  const handleAddToCart = useCallback((medication: Medication) => {
    toast.success(`Added ${medication.name} to cart.`);
  }, []);

  const handleNotifyWhenAvailable = useCallback((medication: Medication) => {
    toast.info(`You will be notified when ${medication.name} is back in stock.`);
  }, []);

  const handleViewMedicationDetails = useCallback((medication: Medication) => {
    setSelectedMedication(medication);
    setShowMedicationDetailsModal(true);
    toast.info(`Viewing details for ${medication.name}.`);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setProviderSpecialtyFilter('All');
    setMedicationCategoryFilter('All');
    setProviderSortBy('relevance');
    setMedicationSortBy('relevance');
    setPrescriptionFilter('all');
    toast.info("All filters cleared!");
  }, [activeTab]);


  // --- Medical Provider Card Component ---
  const MedicalProviderCard = React.memo(({ provider }: { provider: MedicalProvider }) => (
    <Card className="group relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:border-orange-400 bg-white">
      <div className="aspect-video bg-gray-100 relative overflow-hidden flex items-center justify-center p-4">
        {provider.profile_image_url ? (
          <img
            src={provider.profile_image_url}
            alt={provider.full_name} // Use full_name for alt text
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <Hospital className="h-20 w-20 text-gray-400/50" />
        )}
        {provider.is_verified && (
          <Badge className="absolute top-3 left-3 bg-blue-500 text-white text-xs px-3 py-1 font-semibold shadow">
            <CheckCircle className="h-3 w-3 mr-1" /> Verified
          </Badge>
        )}
      </div>

      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-orange-700 transition-colors">
            {provider.full_name} {/* Fixed: Use full_name for display */}
          </CardTitle>
          <div className="flex items-center flex-shrink-0 ml-2">
            <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
            <span className="text-sm font-semibold text-gray-700">{provider.rating?.toFixed(1) || 'N/A'}</span>
            <span className="text-xs text-gray-500 ml-1">({provider.reviews})</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 line-clamp-1">{provider.specialty}</p>
        <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">{provider.facility_name || 'Provides specialized medical care.'}</p> {/* Use facility name or generic desc */}
      </CardHeader>

      <CardContent className="space-y-3 px-4 pb-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <MapPin className="h-4 w-4 text-orange-500 flex-shrink-0" />
            <span className="truncate">{provider.location} {provider.distance && `• ${provider.distance}`}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Clock className="h-4 w-4 text-orange-500 flex-shrink-0" />
            <span>{provider.hours}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {provider.services?.map((service, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {service}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            size="sm"
            onClick={() => handleBookAppointment(provider)}
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-md"
          >
            <Stethoscope className="h-4 w-4 mr-1" />
            Book Appointment
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleCallProvider(provider)}
            className="border-orange-200 text-orange-600 hover:bg-orange-50 shadow-sm"
            disabled={!provider.phone || provider.phone === 'N/A'}
          >
            <Phone className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  ));


  // --- Medication Card Component ---
  const MedicationCard = React.memo(({ medication }: { medication: Medication }) => (
    <Card className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:border-orange-400 bg-white ${!medication.in_stock ? 'opacity-70' : ''}`}>
      <div className="aspect-square bg-gray-100 relative overflow-hidden flex items-center justify-center">
        {medication.image_url ? (
          <img
            src={medication.image_url}
            alt={medication.name}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <Pill className="h-20 w-20 text-gray-400/50" />
        )}
        {medication.prescription_required && (
          <Badge variant="destructive" className="absolute top-3 right-3 text-xs px-3 py-1 font-semibold shadow">
            Prescription Required
          </Badge>
        )}
      </div>

      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-orange-700 transition-colors">
            {medication.name}
          </CardTitle>
          <span className="text-lg font-bold text-orange-600 flex-shrink-0 ml-2">
            KSh {medication.price.toLocaleString()}
          </span>
        </div>
        <Badge variant="outline" className="text-xs text-gray-600 w-fit">{medication.category}</Badge>
        <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">{medication.description}</p>
      </CardHeader>

      <CardContent className="space-y-3 px-4 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-700">
            <Building className="h-4 w-4 text-orange-500 mr-2" />
            <span className="truncate">{medication.pharmacy}</span>
          </div>
          <Badge variant={medication.in_stock ? "default" : "destructive"} className="text-xs">
            {medication.in_stock ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            size="sm"
            onClick={() => medication.in_stock ? handleAddToCart(medication) : handleNotifyWhenAvailable(medication)}
            className={`flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-md ${!medication.in_stock ? 'opacity-80 cursor-not-allowed' : ''}`}
            disabled={!medication.in_stock}
          >
            {medication.in_stock ? (
              <>
                <ShoppingCart className="h-4 w-4 mr-1" /> Add to Cart
              </>
            ) : (
              <>
                <Info className="h-4 w-4 mr-1" /> Notify When Available
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleViewMedicationDetails(medication)}
            className="border-orange-200 text-orange-600 hover:bg-orange-50 shadow-sm"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  ));


  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Hero Section */}
        <div
          className="relative h-64 overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 px-4 sm:px-6 lg:px-8 shadow-xl"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="relative z-10 flex items-center justify-center h-full px-6 sm:px-8 lg:px-12">
            <div className="text-center text-white max-w-3xl mx-auto">
              <Hospital className="h-16 w-16 mx-auto mb-4 text-orange-100 drop-shadow-lg" />
              <h1 className="text-3xl md:text-4xl font-bold mb-3 drop-shadow-lg">Your Health, Our Priority</h1>
              <p className="text-lg text-orange-100 font-light leading-relaxed">
                Connect with trusted medical professionals and find essential medications near you in Nairobi.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Main Tabs */}
          <Tabs defaultValue="providers" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-0 w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder={`Search ${activeTab === 'providers' ? 'hospitals or doctors...' : 'medications or pharmacies...'}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                  aria-label={`Search ${activeTab}`}
                />
              </div>

              {/* Tabs List */}
              <TabsList className="grid grid-cols-2 flex-shrink-0 w-full sm:w-auto p-1 bg-orange-100 rounded-lg">
                <TabsTrigger
                  value="providers"
                  className="flex items-center gap-2 p-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white text-sm font-medium rounded-md transition-all"
                >
                  <Stethoscope className="h-4 w-4" /> Providers
                </TabsTrigger>
                <TabsTrigger
                  value="medications"
                  className="flex items-center gap-2 p-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white text-sm font-medium rounded-md transition-all"
                >
                  <Pill className="h-4 w-4" /> Pharmacy
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Filter and Sort Controls */}
            <Card className="mb-8 p-6 shadow-lg border border-gray-100">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 items-end">
                  {/* Category Filter */}
                  {activeTab === 'providers' && (
                    <div className="col-span-full sm:col-span-1">
                      <label htmlFor="provider-specialty-select" className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                      <Select value={providerSpecialtyFilter} onValueChange={setProviderSpecialtyFilter}>
                        <SelectTrigger id="provider-specialty-select" className="w-full">
                          <SelectValue placeholder="All Specialties" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROVIDER_SPECIALTIES.map(specialty => (
                            <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {activeTab === 'medications' && (
                    <div className="col-span-full sm:col-span-1">
                      <label htmlFor="medication-category-select" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <Select value={medicationCategoryFilter} onValueChange={setMedicationCategoryFilter}>
                        <SelectTrigger id="medication-category-select" className="w-full">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          {MEDICATION_CATEGORIES.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Sort By */}
                  {activeTab === 'providers' && (
                    <div className="col-span-full sm:col-span-1">
                      <label htmlFor="provider-sort-select" className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                      <Select value={providerSortBy} onValueChange={setProviderSortBy}>
                        <SelectTrigger id="provider-sort-select" className="w-full">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROVIDER_SORT_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {activeTab === 'medications' && (
                    <div className="col-span-full sm:col-span-1">
                      <label htmlFor="medication-sort-select" className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                      <Select value={medicationSortBy} onValueChange={setMedicationSortBy}>
                        <SelectTrigger id="medication-sort-select" className="w-full">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          {MEDICATION_SORT_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Prescription Filter (Medications Only) */}
                  {activeTab === 'medications' && (
                    <div className="col-span-full sm:col-span-1">
                      <label htmlFor="prescription-filter" className="block text-sm font-medium text-gray-700 mb-2">Prescription</label>
                      <Select
                        value={prescriptionFilter}
                        onValueChange={(value) => setPrescriptionFilter(value as "all" | "required" | "not_required")}
                      >
                        <SelectTrigger id="prescription-filter" className="w-full">
                          <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="required">Required</SelectItem>
                          <SelectItem value="not_required">Not Required</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Mobile Filters Trigger (Sheet) */}
                  <div className="sm:hidden col-span-full">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" className="w-full flex items-center gap-2 shadow-sm">
                          <Filter className="h-5 w-5" /> More Filters
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="right">
                        <SheetHeader>
                          <SheetTitle className="flex items-center gap-2">
                            <Filter /> Filters
                          </SheetTitle>
                        </SheetHeader>
                        <div className="py-6 space-y-6">
                          {activeTab === 'providers' && (
                            <>
                              <div>
                                <label htmlFor="mobile-provider-specialty-select" className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                                <Select value={providerSpecialtyFilter} onValueChange={setProviderSpecialtyFilter}>
                                  <SelectTrigger id="mobile-provider-specialty-select" className="w-full">
                                    <SelectValue placeholder="All Specialties" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {PROVIDER_SPECIALTIES.map(specialty => (
                                      <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <label htmlFor="mobile-provider-sort-select" className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                                <Select value={providerSortBy} onValueChange={setProviderSortBy}>
                                  <SelectTrigger id="mobile-provider-sort-select" className="w-full">
                                    <SelectValue placeholder="Sort by" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {PROVIDER_SORT_OPTIONS.map(option => (
                                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </>
                          )}
                          {activeTab === 'medications' && (
                            <>
                              <div>
                                <label htmlFor="mobile-medication-category-select" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <Select value={medicationCategoryFilter} onValueChange={setMedicationCategoryFilter}>
                                  <SelectTrigger id="mobile-medication-category-select" className="w-full">
                                    <SelectValue placeholder="All Categories" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {MEDICATION_CATEGORIES.map(category => (
                                      <SelectItem key={category} value={category}>{category}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <label htmlFor="mobile-medication-sort-select" className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                                <Select value={medicationSortBy} onValueChange={setMedicationSortBy}>
                                  <SelectTrigger id="mobile-medication-sort-select" className="w-full">
                                    <SelectValue placeholder="Sort by" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {MEDICATION_SORT_OPTIONS.map(option => (
                                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <label htmlFor="mobile-prescription-filter" className="block text-sm font-medium text-gray-700 mb-2">Prescription</label>
                                <Select
                                  value={prescriptionFilter}
                                  onValueChange={(value) => setPrescriptionFilter(value as "all" | "required" | "not_required")}
                                >
                                  <SelectTrigger id="mobile-prescription-filter" className="w-full">
                                    <SelectValue placeholder="All" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="required">Required</SelectItem>
                                    <SelectItem value="not_required">Not Required</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </>
                          )}
                          <Button onClick={handleClearFilters} variant="outline" className="w-full mt-4">
                            Clear All Filters
                          </Button>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content for Tabs */}
            <TabsContent value="providers">
              {(isLoadingProviders || isFetchingProviders) ? (
                <div className="text-center py-12">
                  <Loader2 className="h-10 w-10 text-orange-600 animate-spin mx-auto mb-4" />
                  <p className="text-lg text-gray-600">Loading medical providers...</p>
                </div>
              ) : providers.length === 0 ? (
                <div className="text-center py-12">
                  <Stethoscope className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No Medical Providers Found</h3>
                  <p className="text-md text-gray-600 mb-8">
                    {debouncedSearchTerm || providerSpecialtyFilter !== 'All'
                      ? 'No providers match your current search and filter criteria. Try adjusting them!'
                      : 'It looks a bit empty here. Medical providers will be added soon. Check back later!'
                    }
                  </p>
                  <Button onClick={handleClearFilters} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-md flex items-center gap-2">
                    <Filter className="h-5 w-5" /> Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {providers.map((provider) => (
                    <MedicalProviderCard key={provider.id} provider={provider} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="medications">
              {(isLoadingMeds || isFetchingMeds) ? (
                <div className="text-center py-12">
                  <Loader2 className="h-10 w-10 text-orange-600 animate-spin mx-auto mb-4" />
                  <p className="text-lg text-gray-600">Loading medications...</p>
                </div>
              ) : meds.length === 0 ? (
                <div className="text-center py-12">
                  <Pill className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No Medications Found</h3>
                  <p className="text-md text-gray-600 mb-8">
                    {debouncedSearchTerm || medicationCategoryFilter !== 'All' || prescriptionFilter !== 'all'
                      ? 'No medications match your current search and filter criteria. Try adjusting them!'
                      : 'It looks a bit empty here. Medications will be added soon. Check back later!'
                    }
                  </p>
                  <Button onClick={handleClearFilters} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-md flex items-center gap-2">
                    <Filter className="h-5 w-5" /> Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {meds.map((medication) => (
                    <MedicationCard key={medication.id} medication={medication} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Modals */}
        <AppointmentBookingModal
          isOpen={showAppointmentModal}
          onClose={() => setShowAppointmentModal(false)}
          provider={selectedProvider}
        />
        <MedicationDetailsModal
          isOpen={showMedicationDetailsModal}
          onClose={() => setShowMedicationDetailsModal(false)}
          medication={selectedMedication}
        />
      </div>
    </MainLayout>
  );
};

export default MedicalPage;