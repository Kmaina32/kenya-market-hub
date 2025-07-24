
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Phone, MapPin, Clock, Users } from 'lucide-react';
import EmergencyContactsManager from './EmergencyContactsManager';
import SafetyReportForm from './SafetyReportForm';
import SOSButton from './SOSButton';
import { useSafetyFeatures } from '@/hooks/useSafetyFeatures';

const SafetyDashboard = () => {
  const { safetyAlerts, lastKnownLocation, emergencyContacts } = useSafetyFeatures();
  const [activeTab, setActiveTab] = useState('contacts');

  const safetyStats = {
    totalContacts: emergencyContacts.length,
    activeAlerts: safetyAlerts.filter(a => a.status === 'active').length,
    resolvedAlerts: safetyAlerts.filter(a => a.status === 'resolved').length,
    locationStatus: lastKnownLocation ? 'Active' : 'Inactive'
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Safety Center</h1>
        <Badge variant="outline" className="flex items-center gap-1">
          <Shield className="h-4 w-4" />
          Protected
        </Badge>
      </div>

      {/* Safety Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Emergency Contacts</p>
                <p className="text-2xl font-bold">{safetyStats.totalContacts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold">{safetyStats.activeAlerts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Location Tracking</p>
                <p className="text-lg font-semibold">{safetyStats.locationStatus}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Resolved Alerts</p>
                <p className="text-2xl font-bold">{safetyStats.resolvedAlerts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Safety Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contacts">Emergency Contacts</TabsTrigger>
          <TabsTrigger value="reports">Safety Reports</TabsTrigger>
          <TabsTrigger value="alerts">Safety Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts">
          <EmergencyContactsManager />
        </TabsContent>

        <TabsContent value="reports">
          <SafetyReportForm />
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Safety Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {safetyAlerts.length > 0 ? (
                  safetyAlerts.map((alert) => (
                    <div key={alert.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                          <span className="font-medium capitalize">{alert.type}</span>
                        </div>
                        <Badge variant={alert.status === 'active' ? 'destructive' : 'secondary'}>
                          {alert.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Location: {alert.location.lat.toFixed(6)}, {alert.location.lng.toFixed(6)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">No safety alerts</p>
                    <p className="text-sm text-gray-500">You're all set! No active safety alerts.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* SOS Button */}
      <SOSButton />
    </div>
  );
};

export default SafetyDashboard;
