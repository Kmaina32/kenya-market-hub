
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Hospital, Pill, Stethoscope, Clock, MapPin, Star, Phone } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const MedicalPage = () => {
  // Sample medical providers data
  const medicalProviders = [
    {
      id: 1,
      name: "Nairobi Hospital",
      specialty: "General Hospital",
      rating: 4.8,
      reviews: 245,
      location: "Nairobi, Kenya",
      distance: "2.3 km",
      phone: "+254 20 2845000",
      hours: "24/7",
      services: ["Emergency", "Surgery", "Maternity", "ICU"]
    },
    {
      id: 2,
      name: "Dr. Sarah Mwangi",
      specialty: "Pediatrician",
      rating: 4.9,
      reviews: 156,
      location: "Westlands, Nairobi",
      distance: "1.8 km",
      phone: "+254 700 123456",
      hours: "Mon-Fri 8AM-6PM",
      services: ["Child Care", "Vaccination", "Growth Monitoring"]
    },
    {
      id: 3,
      name: "Aga Khan Hospital",
      specialty: "Multi-specialty Hospital",
      rating: 4.7,
      reviews: 389,
      location: "Parklands, Nairobi",
      distance: "3.5 km",
      phone: "+254 20 3662000",
      hours: "24/7",
      services: ["Cardiology", "Oncology", "Orthopedics", "Neurology"]
    }
  ];

  // Sample medications data
  const medications = [
    {
      id: 1,
      name: "Paracetamol 500mg",
      category: "Pain Relief",
      price: 150,
      inStock: true,
      pharmacy: "Goodlife Pharmacy",
      description: "Effective pain relief and fever reducer",
      prescription: false
    },
    {
      id: 2,
      name: "Amoxicillin 250mg",
      category: "Antibiotic",
      price: 320,
      inStock: true,
      pharmacy: "Carrefour Pharmacy",
      description: "Broad-spectrum antibiotic",
      prescription: true
    },
    {
      id: 3,
      name: "Vitamin D3 1000IU",
      category: "Supplement",
      price: 890,
      inStock: true,
      pharmacy: "Nakumatt Pharmacy",
      description: "Essential vitamin D supplement",
      prescription: false
    },
    {
      id: 4,
      name: "Insulin Glargine",
      category: "Diabetes",
      price: 2500,
      inStock: true,
      pharmacy: "Tuskys Pharmacy",
      description: "Long-acting insulin",
      prescription: true
    }
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Hero Section with Background Image - Added proper padding */}
        <div 
          className="relative h-64 overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 px-4 sm:px-6 lg:px-8"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-3xl" />
          <div className="relative z-10 flex items-center justify-center h-full px-6 sm:px-8 lg:px-12">
            <div className="text-center text-white max-w-3xl mx-auto">
              <Hospital className="h-16 w-16 mx-auto mb-4" />
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Medical Services</h1>
              <p className="text-lg text-orange-100 mb-6">
                Connect with trusted medical professionals and find medications
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="providers" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 max-w-sm mx-auto bg-orange-100">
              <TabsTrigger 
                value="providers" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white text-sm"
              >
                Medical Providers
              </TabsTrigger>
              <TabsTrigger 
                value="medications"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white text-sm"
              >
                Pharmacy & Medications
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="providers">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {medicalProviders.map((provider) => (
                  <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg text-gray-900">{provider.name}</CardTitle>
                          <p className="text-sm text-gray-600">{provider.specialty}</p>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm font-medium">{provider.rating}</span>
                          <span className="text-sm text-gray-500 ml-1">({provider.reviews})</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 text-orange-500 mr-2" />
                          <span>{provider.location} • {provider.distance}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 text-orange-500 mr-2" />
                          <span>{provider.phone}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 text-orange-500 mr-2" />
                          <span>{provider.hours}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {provider.services.map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                      
                      <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                        Book Appointment
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="medications">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {medications.map((medication) => (
                  <Card key={medication.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg text-gray-900">{medication.name}</CardTitle>
                          <p className="text-sm text-gray-600">{medication.category}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-lg font-bold text-orange-600">
                            KSh {medication.price}
                          </span>
                          {medication.prescription && (
                            <Badge variant="destructive" className="text-xs mt-1">
                              Prescription Required
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600">{medication.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                          <Pill className="h-4 w-4 text-orange-500 mr-2" />
                          <span>{medication.pharmacy}</span>
                        </div>
                        <Badge variant={medication.inStock ? "default" : "destructive"} className="text-xs">
                          {medication.inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </div>
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                        disabled={!medication.inStock}
                      >
                        {medication.inStock ? "Add to Cart" : "Notify When Available"}
                      </Button>
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
