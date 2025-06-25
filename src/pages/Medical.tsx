
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, MapPin, Clock, Star, Phone, Calendar, Search } from 'lucide-react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const Medical = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const { toast } = useToast();

  // Seed data for medical providers
  const medicalProviders = [
    {
      id: '1',
      name: 'Dr. Sarah Wanjiku',
      specialty: 'General Medicine',
      rating: 4.8,
      reviews: 124,
      location: 'Nairobi CBD',
      image: 'photo-1559839734-2b71ea197ec2',
      availability: 'Available Today',
      phone: '+254 700 123 456',
      experience: '8 years',
      consultationFee: 2500
    },
    {
      id: '2',
      name: 'Dr. John Kamau',
      specialty: 'Cardiology',
      rating: 4.9,
      reviews: 89,
      location: 'Westlands',
      image: 'photo-1612349317150-e413f6a5b16d',
      availability: 'Available Tomorrow',
      phone: '+254 700 234 567',
      experience: '12 years',
      consultationFee: 4000
    },
    {
      id: '3',
      name: 'Dr. Grace Akinyi',
      specialty: 'Pediatrics',
      rating: 4.7,
      reviews: 156,
      location: 'Karen',
      image: 'photo-1594824375832-5ee55e7b4e69',
      availability: 'Available Today',
      phone: '+254 700 345 678',
      experience: '10 years',
      consultationFee: 3000
    }
  ];

  // Seed data for medications
  const medications = [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      category: 'Pain Relief',
      price: 150,
      stock: 100,
      image: 'photo-1584308666744-24d5c474f2ae',
      requiresPrescription: false,
      description: 'Pain and fever relief medication'
    },
    {
      id: '2',
      name: 'Amoxicillin 250mg',
      category: 'Antibiotics',
      price: 350,
      stock: 50,
      image: 'photo-1471864190281-a93a3070b6de',
      requiresPrescription: true,
      description: 'Antibiotic for bacterial infections'
    },
    {
      id: '3',
      name: 'Vitamin C Tablets',
      category: 'Supplements',
      price: 800,
      stock: 75,
      image: 'photo-1550572017-edd951b55104',
      requiresPrescription: false,
      description: 'Immune system support supplement'
    }
  ];

  const specialties = ['General Medicine', 'Cardiology', 'Pediatrics', 'Dermatology', 'Orthopedics'];

  const filteredProviders = medicalProviders.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || provider.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleBookAppointment = (providerId: string) => {
    toast({
      title: "Appointment Request",
      description: "Your appointment request has been sent to the doctor.",
    });
  };

  const handleOrderMedication = (medicationId: string) => {
    toast({
      title: "Medication Added",
      description: "Medication has been added to your cart.",
    });
  };

  return (
    <FrontendLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        {/* Hero Section */}
        <div 
          className="relative bg-gradient-to-r from-blue-600 to-green-600 text-white py-16 rounded-b-2xl mb-8 mx-4 sm:mx-6 lg:mx-8 mt-4 px-8 sm:px-12 lg:px-16"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-b-2xl" />
          
          {/* Content */}
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <Stethoscope className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Medical Services</h1>
            <p className="text-xl text-blue-100 mb-8">
              Connect with qualified doctors and access medications online
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 pb-8">
          {/* Search and Filters */}
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search doctors or specialties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {specialties.map(specialty => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Medical Providers Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Find a Doctor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProviders.map((provider) => (
                <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-4">
                      <img
                        src={`https://images.unsplash.com/${provider.image}?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80`}
                        alt={provider.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <CardTitle className="text-lg">{provider.name}</CardTitle>
                        <p className="text-blue-600 font-medium">{provider.specialty}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{provider.rating}</span>
                          <span className="text-sm text-gray-500">({provider.reviews})</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <span>{provider.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4 text-green-500" />
                      <span>{provider.availability}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4 text-orange-500" />
                      <span>{provider.phone}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-lg font-bold text-green-600">
                        KSh {provider.consultationFee.toLocaleString()}
                      </span>
                      <Button 
                        size="sm"
                        onClick={() => handleBookAppointment(provider.id)}
                        className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        Book
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Pharmacy Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Online Pharmacy</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medications.map((medication) => (
                <Card key={medication.id} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-100">
                    <img
                      src={`https://images.unsplash.com/${medication.image}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`}
                      alt={medication.name}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{medication.name}</CardTitle>
                    <Badge variant="secondary">{medication.category}</Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600">{medication.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Stock: {medication.stock}</span>
                      {medication.requiresPrescription && (
                        <Badge variant="outline" className="text-red-600 border-red-200">
                          Prescription Required
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xl font-bold text-blue-600">
                        KSh {medication.price.toLocaleString()}
                      </span>
                      <Button 
                        size="sm"
                        onClick={() => handleOrderMedication(medication.id)}
                        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FrontendLayout>
  );
};

export default Medical;
