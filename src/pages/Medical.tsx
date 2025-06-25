
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Hospital, Pill, MapPin, Star, Clock, Phone } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import HeroSection from '@/components/shared/HeroSection';

const MedicalPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Seed data for medical providers
  const medicalProviders = [
    {
      id: 1,
      name: 'Dr. Sarah Wanjiku',
      specialty: 'General Practice',
      hospital: 'Nairobi Hospital',
      location: 'Upper Hill, Nairobi',
      rating: 4.8,
      reviews: 156,
      experience: '8 years',
      available: true,
      phone: '+254 700 123 456',
      image: 'photo-1559839734-2b71ea197ec2'
    },
    {
      id: 2,
      name: 'Dr. James Kiprotich',
      specialty: 'Cardiology',
      hospital: 'Aga Khan Hospital',
      location: 'Parklands, Nairobi',
      rating: 4.9,
      reviews: 203,
      experience: '12 years',
      available: false,
      phone: '+254 700 789 012',
      image: 'photo-1612349317150-e413f6a5b16d'
    },
    {
      id: 3,
      name: 'Dr. Grace Muthoni',
      specialty: 'Pediatrics',
      hospital: 'Kenyatta National Hospital',
      location: 'Upper Hill, Nairobi',
      rating: 4.7,
      reviews: 89,
      experience: '6 years',
      available: true,
      phone: '+254 700 345 678',
      image: 'photo-1594824804732-5f629aa30aa0'
    },
    {
      id: 4,
      name: 'Dr. Peter Ochieng',
      specialty: 'Orthopedics',
      hospital: 'MP Shah Hospital',
      location: 'Parklands, Nairobi',
      rating: 4.6,
      reviews: 134,
      experience: '10 years',
      available: true,
      phone: '+254 700 901 234',
      image: 'photo-1582750433449-648ed127bb54'
    }
  ];

  // Seed data for medications
  const medications = [
    {
      id: 1,
      name: 'Paracetamol 500mg',
      category: 'Pain Relief',
      price: 120,
      pharmacy: 'Goodlife Pharmacy',
      location: 'Westlands, Nairobi',
      inStock: true,
      prescription: false,
      description: 'Effective pain relief and fever reducer',
      image: 'photo-1471864190281-a93a3070b6de'
    },
    {
      id: 2,
      name: 'Amoxicillin 250mg',
      category: 'Antibiotics',
      price: 450,
      pharmacy: 'Cosmos Pharmacy',
      location: 'CBD, Nairobi',
      inStock: true,
      prescription: true,
      description: 'Broad-spectrum antibiotic for bacterial infections',
      image: 'photo-1559757148-5c350d0d3c56'
    },
    {
      id: 3,
      name: 'Vitamin C Tablets',
      category: 'Supplements',
      price: 350,
      pharmacy: 'Dawa Life Pharmacy',
      location: 'Karen, Nairobi',
      inStock: true,
      prescription: false,
      description: 'Immune system support supplement',
      image: 'photo-1584308666744-24d5c474f2ae'
    },
    {
      id: 4,
      name: 'Insulin Injection',
      category: 'Diabetes',
      price: 2800,
      pharmacy: 'Avenue Healthcare',
      location: 'Kilimani, Nairobi',
      inStock: false,
      prescription: true,
      description: 'Fast-acting insulin for diabetes management',
      image: 'photo-1576671081837-49000212a370'
    },
    {
      id: 5,
      name: 'Blood Pressure Monitor',
      category: 'Medical Devices',
      price: 4500,
      pharmacy: 'Medplus Pharmacy',
      location: 'Eastleigh, Nairobi',
      inStock: true,
      prescription: false,
      description: 'Digital blood pressure monitoring device',
      image: 'photo-1559757175-8a5a8f3c0c3d'
    },
    {
      id: 6,
      name: 'Cough Syrup',
      category: 'Cold & Flu',
      price: 280,
      pharmacy: 'City Pharmacy',
      location: 'Town Center, Nairobi',
      inStock: true,
      prescription: false,
      description: 'Effective cough suppressant and expectorant',
      image: 'photo-1628771065518-0d82f1938462'
    }
  ];

  const categories = ['all', 'Pain Relief', 'Antibiotics', 'Supplements', 'Diabetes', 'Medical Devices', 'Cold & Flu'];

  const filteredMedications = selectedCategory === 'all' 
    ? medications 
    : medications.filter(med => med.category === selectedCategory);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        {/* Hero Section with Image Backdrop */}
        <HeroSection
          title="Medical Services"
          subtitle="Healthcare & Pharmacy"
          description="Connect with trusted medical professionals and find medications."
          imageUrl="photo-1576091160399-112ba8d25d1f"
          className="mb-0 rounded-b-3xl mx-6 sm:mx-8 lg:mx-12 mt-6"
        />

        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
          <Tabs defaultValue="providers" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 max-w-sm mx-auto bg-blue-100">
              <TabsTrigger 
                value="providers" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white text-sm"
              >
                Medical Providers
              </TabsTrigger>
              <TabsTrigger 
                value="medications"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white text-sm"
              >
                Pharmacy & Medications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="providers">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {medicalProviders.map((provider) => (
                  <Card key={provider.id} className="hover:shadow-lg transition-all duration-300">
                    <div className="aspect-square bg-gradient-to-br from-blue-100 to-indigo-100 relative">
                      <img 
                        src={`https://images.unsplash.com/${provider.image}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`}
                        alt={provider.name}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                      <Badge 
                        className={`absolute top-3 right-3 ${
                          provider.available 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                        }`}
                      >
                        {provider.available ? 'Available' : 'Busy'}
                      </Badge>
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="text-lg text-gray-900">{provider.name}</CardTitle>
                      <p className="text-blue-600 font-medium">{provider.specialty}</p>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Hospital className="h-4 w-4 text-blue-500" />
                        <span>{provider.hospital}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        <span>{provider.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{provider.rating} ({provider.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span>{provider.experience} experience</span>
                      </div>
                      
                      <div className="flex gap-2 pt-4">
                        <Button 
                          className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                          disabled={!provider.available}
                        >
                          Book Appointment
                        </Button>
                        <Button variant="outline" size="icon">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="medications">
              {/* Category Filter */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={`text-sm h-10 rounded-xl ${
                        selectedCategory === category 
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0' 
                          : 'border-gray-300 text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300'
                      }`}
                    >
                      {category === 'all' ? 'All Categories' : category}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMedications.map((medication) => (
                  <Card key={medication.id} className="hover:shadow-lg transition-all duration-300">
                    <div className="aspect-square bg-gradient-to-br from-blue-100 to-indigo-100 relative">
                      <img 
                        src={`https://images.unsplash.com/${medication.image}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`}
                        alt={medication.name}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                      <Badge 
                        className={`absolute top-3 right-3 ${
                          medication.inStock 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                        }`}
                      >
                        {medication.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                      {medication.prescription && (
                        <Badge className="absolute top-3 left-3 bg-orange-500 text-white">
                          Prescription Required
                        </Badge>
                      )}
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="text-lg text-gray-900">{medication.name}</CardTitle>
                      <p className="text-blue-600 font-medium">{medication.category}</p>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-600">{medication.description}</p>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Hospital className="h-4 w-4 text-blue-500" />
                        <span>{medication.pharmacy}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        <span>{medication.location}</span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4">
                        <span className="text-2xl font-bold text-blue-600">
                          KSh {medication.price.toLocaleString()}
                        </span>
                        <Button 
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                          disabled={!medication.inStock}
                        >
                          {medication.prescription ? 'Upload Prescription' : 'Add to Cart'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default MedicalPage;
