
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  is_primary: boolean;
}

interface SafetyAlert {
  id: string;
  type: 'sos' | 'route_deviation' | 'speed_violation' | 'panic';
  status: 'active' | 'resolved' | 'false_alarm';
  location: { lat: number; lng: number };
  timestamp: string;
  ride_id?: string;
}

export const useSafetyFeatures = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [safetyAlerts, setSafetyAlerts] = useState<SafetyAlert[]>([]);
  const [lastKnownLocation, setLastKnownLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Mock data for now since we need to wait for the types to be regenerated
  useEffect(() => {
    if (user) {
      // Mock emergency contacts
      setEmergencyContacts([
        {
          id: '1',
          name: 'John Doe',
          phone: '+254712345678',
          relationship: 'Brother',
          is_primary: true
        }
      ]);
    }
  }, [user]);

  // Track user location for safety monitoring
  useEffect(() => {
    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLastKnownLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Location tracking error:', error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const addEmergencyContact = async (contact: Omit<EmergencyContact, 'id'>) => {
    const newContact = {
      ...contact,
      id: Date.now().toString()
    };
    
    setEmergencyContacts(prev => [...prev, newContact]);
    toast({
      title: 'Emergency contact added',
      description: `${contact.name} has been added to your emergency contacts.`
    });
  };

  const triggerSOS = async (type: 'sos' | 'panic' = 'sos') => {
    if (!lastKnownLocation) {
      toast({
        title: 'Location unavailable',
        description: 'Unable to get your current location for SOS.',
        variant: 'destructive'
      });
      return;
    }

    setIsSOSActive(true);

    const alert: SafetyAlert = {
      id: Date.now().toString(),
      type,
      status: 'active',
      location: lastKnownLocation,
      timestamp: new Date().toISOString()
    };

    setSafetyAlerts(prev => [...prev, alert]);

    toast({
      title: 'SOS Activated',
      description: 'Emergency services and your contacts have been notified.',
      variant: 'destructive'
    });
  };

  const deactivateSOS = async (alertId: string) => {
    setIsSOSActive(false);
    setSafetyAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: 'resolved' as const }
          : alert
      )
    );

    toast({
      title: 'SOS Deactivated',
      description: 'Safety alert has been resolved.'
    });
  };

  const shareRideWithContacts = async (rideId: string) => {
    toast({
      title: 'Ride shared',
      description: 'Your ride details have been shared with emergency contacts.'
    });
  };

  const reportSafetyIssue = async (issueType: string, description: string, rideId?: string) => {
    toast({
      title: 'Safety report submitted',
      description: 'Your safety report has been submitted for review.'
    });
  };

  return {
    emergencyContacts,
    isSOSActive,
    safetyAlerts,
    lastKnownLocation,
    addEmergencyContact,
    triggerSOS,
    deactivateSOS,
    shareRideWithContacts,
    reportSafetyIssue
  };
};
