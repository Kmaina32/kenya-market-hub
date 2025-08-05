
import { useCreateServiceProviderApplication } from './useServiceProviderApplications';

export interface ServiceProviderRegistrationData {
  service_type: string;
  business_name: string;
  business_description: string;
  business_address: string;
  business_phone: string;
  business_email: string;
  license_number?: string;
  experience_years?: number;
  service_areas?: string[];
  documents?: any;
}

export const useServiceProviderRegistration = () => {
  return useCreateServiceProviderApplication();
};
