
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Hospital } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MedicationsList from '@/components/MedicationsList';
import MedicalProvidersList from '@/components/MedicalProvidersList';
import HeroSection from '@/components/shared/HeroSection';

const MedicalPage = () => {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Hero Section with Image Backdrop */}
        <HeroSection
          title="Medical Services"
          subtitle="Healthcare & Pharmacy"
          description="Connect with trusted medical professionals and find medications."
          imageUrl="photo-1576091160399-112ba8d25d1f"
          className="mb-0 rounded-b-3xl"
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Tabs defaultValue="providers" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 max-w-sm mx-auto bg-orange-100">
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
              <MedicalProvidersList />
            </TabsContent>
            <TabsContent value="medications">
              <MedicationsList />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default MedicalPage;
