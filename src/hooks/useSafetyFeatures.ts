
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
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

  // Load emergency contacts
  useEffect(() => {
    if (user) {
      loadEmergencyContacts();
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

  const loadEmergencyContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user?.id)
        .order('is_primary', { ascending: false });

      if (error) throw error;
      setEmergencyContacts(data || []);
    } catch (error) {
      console.error('Error loading emergency contacts:', error);
    }
  };

  const addEmergencyContact = async (contact: Omit<EmergencyContact, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .insert({
          user_id: user?.id,
          name: contact.name,
          phone: contact.phone,
          relationship: contact.relationship,
          is_primary: contact.is_primary
        })
        .select()
        .single();

      if (error) throw error;

      setEmergencyContacts(prev => [...prev, data]);
      toast({
        title: 'Emergency contact added',
        description: `${contact.name} has been added to your emergency contacts.`
      });
    } catch (error) {
      console.error('Error adding emergency contact:', error);
      toast({
        title: 'Error',
        description: 'Failed to add emergency contact.',
        variant: 'destructive'
      });
    }
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

    try {
      setIsSOSActive(true);

      // Create safety alert
      const { data: alert, error } = await supabase
        .from('safety_alerts')
        .insert({
          user_id: user?.id,
          type,
          status: 'active',
          location: `POINT(${lastKnownLocation.lng} ${lastKnownLocation.lat})`,
          timestamp: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Send notifications to emergency contacts
      await notifyEmergencyContacts(type, lastKnownLocation);

      // Notify authorities if needed
      if (type === 'sos') {
        await notifyAuthorities(lastKnownLocation);
      }

      toast({
        title: 'SOS Activated',
        description: 'Emergency services and your contacts have been notified.',
        variant: 'destructive'
      });

      setSafetyAlerts(prev => [...prev, {
        id: alert.id,
        type,
        status: 'active',
        location: lastKnownLocation,
        timestamp: new Date().toISOString()
      }]);

    } catch (error) {
      console.error('Error triggering SOS:', error);
      toast({
        title: 'SOS Error',
        description: 'Failed to activate SOS. Please call emergency services directly.',
        variant: 'destructive'
      });
    }
  };

  const deactivateSOS = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('safety_alerts')
        .update({ status: 'resolved' })
        .eq('id', alertId);

      if (error) throw error;

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
    } catch (error) {
      console.error('Error deactivating SOS:', error);
    }
  };

  const notifyEmergencyContacts = async (type: string, location: { lat: number; lng: number }) => {
    const primaryContact = emergencyContacts.find(c => c.is_primary);
    const message = `EMERGENCY ALERT: ${user?.email} has triggered a ${type} alert at location: ${location.lat}, ${location.lng}. Please check on them immediately.`;

    // In a real app, this would send SMS/call via a service like Twilio
    console.log('Notifying emergency contacts:', message);
  };

  const notifyAuthorities = async (location: { lat: number; lng: number }) => {
    // In a real app, this would integrate with emergency services
    console.log('Notifying authorities at location:', location);
  };

  const shareRideWithContacts = async (rideId: string) => {
    try {
      const { error } = await supabase
        .from('shared_rides')
        .insert({
          ride_id: rideId,
          user_id: user?.id,
          shared_with: emergencyContacts.map(c => c.id),
          shared_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: 'Ride shared',
        description: 'Your ride details have been shared with emergency contacts.'
      });
    } catch (error) {
      console.error('Error sharing ride:', error);
    }
  };

  const reportSafetyIssue = async (issueType: string, description: string, rideId?: string) => {
    try {
      const { error } = await supabase
        .from('safety_reports')
        .insert({
          user_id: user?.id,
          ride_id: rideId,
          issue_type: issueType,
          description,
          location: lastKnownLocation ? `POINT(${lastKnownLocation.lng} ${lastKnownLocation.lat})` : null,
          reported_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: 'Safety report submitted',
        description: 'Your safety report has been submitted for review.'
      });
    } catch (error) {
      console.error('Error reporting safety issue:', error);
    }
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
