
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Settings, Bell, Car, Clock, DollarSign, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserPreferencesProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserPreferences: React.FC<UserPreferencesProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState({
    notifications: {
      push: true,
      email: false,
      sms: true,
      driverUpdates: true,
      promotions: false
    },
    rides: {
      defaultVehicle: 'taxi',
      priceRange: [0, 1000],
      maxWaitTime: 10,
      autoBook: false,
      saveLocations: true
    },
    privacy: {
      shareLocation: true,
      allowTracking: true,
      showInDirectory: false
    }
  });

  const handleSave = () => {
    // Save preferences to local storage or backend
    localStorage.setItem('ridePreferences', JSON.stringify(preferences));
    toast({
      title: "Preferences Saved",
      description: "Your ride preferences have been updated.",
    });
    onClose();
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const handleRideChange = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      rides: {
        ...prev.rides,
        [key]: value
      }
    }));
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-orange-500" />
            Ride Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Notifications */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-medium">
              <Bell className="h-4 w-4" />
              Notifications
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <Switch
                  id="push-notifications"
                  checked={preferences.notifications.push}
                  onCheckedChange={(value) => handleNotificationChange('push', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <Switch
                  id="email-notifications"
                  checked={preferences.notifications.email}
                  onCheckedChange={(value) => handleNotificationChange('email', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-notifications">SMS Notifications</Label>
                <Switch
                  id="sms-notifications"
                  checked={preferences.notifications.sms}
                  onCheckedChange={(value) => handleNotificationChange('sms', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="driver-updates">Driver Updates</Label>
                <Switch
                  id="driver-updates"
                  checked={preferences.notifications.driverUpdates}
                  onCheckedChange={(value) => handleNotificationChange('driverUpdates', value)}
                />
              </div>
            </div>
          </div>

          {/* Ride Settings */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-medium">
              <Car className="h-4 w-4" />
              Ride Settings
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Default Vehicle Type</Label>
                <RadioGroup
                  value={preferences.rides.defaultVehicle}
                  onValueChange={(value) => handleRideChange('defaultVehicle', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="taxi" id="taxi" />
                    <Label htmlFor="taxi">Taxi</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="motorbike" id="motorbike" />
                    <Label htmlFor="motorbike">Motorbike</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Price Range (KSh)</Label>
                <div className="px-3">
                  <Slider
                    value={preferences.rides.priceRange}
                    onValueChange={(value) => handleRideChange('priceRange', value)}
                    max={2000}
                    min={0}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>KSh {preferences.rides.priceRange[0]}</span>
                    <span>KSh {preferences.rides.priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Max Wait Time (minutes)</Label>
                <div className="px-3">
                  <Slider
                    value={[preferences.rides.maxWaitTime]}
                    onValueChange={(value) => handleRideChange('maxWaitTime', value[0])}
                    max={30}
                    min={5}
                    step={5}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-500 mt-1">
                    {preferences.rides.maxWaitTime} minutes
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="auto-book">Auto-book rides</Label>
                <Switch
                  id="auto-book"
                  checked={preferences.rides.autoBook}
                  onCheckedChange={(value) => handleRideChange('autoBook', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="save-locations">Save frequently used locations</Label>
                <Switch
                  id="save-locations"
                  checked={preferences.rides.saveLocations}
                  onCheckedChange={(value) => handleRideChange('saveLocations', value)}
                />
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-medium">
              <MapPin className="h-4 w-4" />
              Privacy & Location
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="share-location">Share location with drivers</Label>
                <Switch
                  id="share-location"
                  checked={preferences.privacy.shareLocation}
                  onCheckedChange={(value) => handlePrivacyChange('shareLocation', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="allow-tracking">Allow location tracking</Label>
                <Switch
                  id="allow-tracking"
                  checked={preferences.privacy.allowTracking}
                  onCheckedChange={(value) => handlePrivacyChange('allowTracking', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-directory">Show in driver directory</Label>
                <Switch
                  id="show-directory"
                  checked={preferences.privacy.showInDirectory}
                  onCheckedChange={(value) => handlePrivacyChange('showInDirectory', value)}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1 bg-orange-500 hover:bg-orange-600">
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPreferences;
