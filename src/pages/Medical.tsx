
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import HeroSection from '@/components/shared/HeroSection';
import { UnifiedCard } from '@/components/ui/UnifiedCard';
import { UnifiedButton } from '@/components/ui/UnifiedButton';  
import { UnifiedInput, UnifiedSelect } from '@/components/ui/UnifiedForm';
import { 
  Search, 
  Stethoscope, 
  MapPin, 
  Clock, 
  Star,
  Phone,
  Calendar,
  Heart,
  Activity
} from 'lucide-react';

const Medical = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [location, setLocation] = useState('');

  // Sample medical providers data
  const medicalProviders = [
    {
      id: '1',
      name: 'Dr. Sarah Wanjiku',
      specialty: 'General Practice',
      rating: 4.8,
      reviews: 124,
      location: 'Westlands, Nairobi',
      availability: 'Available Today',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop',
      experience: '8 years',
      consultationFee: 2500
    },
    {
      id: '2', 
      name: 'Dr. James Mwangi',
      specialty: 'Cardiology',
      rating: 4.9,
      reviews: 89,
      location: 'Karen, Nairobi',
      availability: 'Next Available: Tomorrow',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=300&fit=crop',
      experience: '12 years',
      consultationFee: 4000
    },
    {
      id: '3',
      name: 'Dr. Grace Achieng',
      specialty: 'Pediatrics',
      rating: 4.7,
      reviews: 156,
      location: 'Kileleshwa, Nairobi',
      availability: 'Available Today',
      image: 'https://images.unsplash.com/photo-1594824288837-bd78b51b1d1f?w=400&h=300&fit=crop',
      experience: '10 years',
      consultationFee: 3000
    }
  ];

  const pharmacies = [
    {
      id: '1',
      name: 'HealthCare Pharmacy',
      location: 'CBD, Nairobi',
      rating: 4.6,
      reviews: 78,
      image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&h=300&fit=crop',
      openHours: '24/7',
      services: ['Prescription', 'OTC Medicines', 'Health Screening']
    },
    {
      id: '2',
      name: 'Wellness Pharmacy',
      location: 'Westlands, Nairobi',
      rating: 4.5,
      reviews: 92,
      image: 'https://images.unsplash.com/photo-1585435557343-3b092031ff26?w=400&h=300&fit=crop',
      openHours: '8AM - 10PM',
      services: ['Prescription', 'Vaccines', 'Consultation']
    }
  ];

  const specialties = [
    { value: '', label: 'All Specialties' },
    { value: 'general', label: 'General Practice' },
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'dermatology', label: 'Dermatology' },
    { value: 'orthopedics', label: 'Orthopedics' },
    { value: 'gynecology', label: 'Gynecology' }
  ];

  const locations = [
    { value: '', label: 'All Locations' },
    { value: 'CBD', label: 'CBD' },
    { value: 'Westlands', label: 'Westlands' },
    { value: 'Karen', label: 'Karen' },
    { value: 'Kileleshwa', label: 'Kileleshwa' },
    { value: 'Kilimani', label: 'Kilimani' }
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <HeroSection
          title="Quality Healthcare at Your Fingertips"
          subtitle="TukoPlace Medical"
          description="Connect with qualified medical professionals, book consultations, and access healthcare services from the comfort of your home."
          imageUrl="photo-1559839734-2b71ea197ec2"
          searchPlaceholder="Search for doctors, specialists, or services..."
          onSearch={setSearchQuery}
          primaryAction={{
            text: 'Find a Doctor',
            onClick: () => document.getElementById('doctors')?.scrollIntoView({ behavior: 'smooth' }),
          }}
          secondaryAction={{
            text: 'Emergency Services',
            onClick: () => {},
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Services */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Stethoscope, title: 'Consultations', desc: 'Online & In-person', color: 'blue' },
              { icon: Heart, title: 'Health Checkups', desc: 'Preventive Care', color: 'red' },
              { icon: Activity, title: 'Lab Tests', desc: 'Home Collection', color: 'green' },
              { icon: Phone, title: 'Emergency', desc: '24/7 Support', color: 'orange' }
            ].map((service, index) => (
              <div key={index} className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-${service.color}-100 text-${service.color}-600 rounded-lg mb-4`}>
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{service.title}</h3>
                <p className="text-sm text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <UnifiedInput
                label=""
                name="search"
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search doctors or services..."
                icon={<Search className="h-4 w-4" />}
              />
              <UnifiedSelect
                label=""
                name="specialty"
                value={selectedSpecialty}
                onChange={setSelectedSpecialty}
                options={specialties}
                placeholder="Specialty"
              />
              <UnifiedSelect
                label=""
                name="location"
                value={location}
                onChange={setLocation}
                options={locations}
                placeholder="Location"
              />
            </div>
          </div>

          {/* Doctors Section */}
          <div id="doctors" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Find a Doctor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medicalProviders.map((doctor) => (
                <UnifiedCard
                  key={doctor.id}
                  title={doctor.name}
                  subtitle={doctor.specialty}
                  description={`${doctor.experience} experience • KSH ${doctor.consultationFee} consultation`}
                  imageUrl={doctor.image}
                  rating={doctor.rating}
                  reviews={doctor.reviews}
                  location={doctor.location}
                  badge={doctor.availability.includes('Today') ? 'Available Today' : 'Next Available'}
                  badgeVariant={doctor.availability.includes('Today') ? 'default' : 'secondary'}
                  actions={
                    <div className="grid grid-cols-2 gap-2">
                      <UnifiedButton size="sm" variant="outline">
                        <Phone className="h-4 w-4" />
                      </UnifiedButton>
                      <UnifiedButton size="sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        Book
                      </UnifiedButton>
                    </div>
                  }
                />
              ))}
            </div>
          </div>

          {/* Pharmacies Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Nearby Pharmacies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pharmacies.map((pharmacy) => (
                <UnifiedCard
                  key={pharmacy.id}
                  title={pharmacy.name}
                  subtitle={`Open: ${pharmacy.openHours}`}
                  description={pharmacy.services.join(' • ')}
                  imageUrl={pharmacy.image}
                  rating={pharmacy.rating}
                  reviews={pharmacy.reviews}
                  location={pharmacy.location}
                  badge={pharmacy.openHours === '24/7' ? '24/7 Open' : 'Open'}
                  badgeVariant={pharmacy.openHours === '24/7' ? 'default' : 'secondary'}
                  actions={
                    <div className="grid grid-cols-2 gap-2">
                      <UnifiedButton size="sm" variant="outline">
                        <MapPin className="h-4 w-4 mr-1" />
                        Directions
                      </UnifiedButton>
                      <UnifiedButton size="sm">
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </UnifiedButton>
                    </div>
                  }
                />
              ))}
            </div>
          </div>

          {/* Health Tips Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Stay Healthy with TukoPlace Medical</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Get regular checkups, follow prescribed medications, and maintain a healthy lifestyle. 
              Our platform makes healthcare accessible and affordable for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <UnifiedButton
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                Download Health App
              </UnifiedButton>
              <UnifiedButton
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                Health Insurance Plans
              </UnifiedButton>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Medical;
