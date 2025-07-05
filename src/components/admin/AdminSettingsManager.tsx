import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAdminSettings, useUpdateAdminSettings } from '@/hooks/useAdminSettings';
import { Settings, Shield, Database, Globe, Mail, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const AdminSettingsManager = () => {
  const { data: settings, isLoading } = useAdminSettings();
  const updateSettings = useUpdateAdminSettings();
  
  const [localSettings, setLocalSettings] = useState({
    platform_name: 'Sokko Sasa',
    platform_description: 'Kenya\'s Premier Multi-Service Platform',
    maintenance_mode: false,
    registration_enabled: true,
    email_notifications: true,
    sms_notifications: false,
    default_currency: 'KSH',
    platform_commission: '5',
    support_email: 'support@sokosmart.co.ke',
    support_phone: '+254-700-000-000',
    ...settings
  });

  React.useEffect(() => {
    if (settings) {
      setLocalSettings(prev => ({ ...prev, ...settings }));
    }
  }, [settings]);

  const handleSave = () => {
    updateSettings.mutate(localSettings);
  };

  const handleChange = (key: string, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="ml-2">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Configure platform settings and preferences</p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={updateSettings.isPending}
          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
        >
          {updateSettings.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="platform_name">Platform Name</Label>
              <Input
                id="platform_name"
                value={localSettings.platform_name}
                onChange={(e) => handleChange('platform_name', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="platform_description">Platform Description</Label>
              <Textarea
                id="platform_description"
                value={localSettings.platform_description}
                onChange={(e) => handleChange('platform_description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="maintenance_mode"
                checked={localSettings.maintenance_mode}
                onCheckedChange={(checked) => handleChange('maintenance_mode', checked)}
              />
              <Label htmlFor="maintenance_mode">Maintenance Mode</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="registration_enabled"
                checked={localSettings.registration_enabled}
                onCheckedChange={(checked) => handleChange('registration_enabled', checked)}
              />
              <Label htmlFor="registration_enabled">Allow New Registrations</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Communication Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="support_email">Support Email</Label>
              <Input
                id="support_email"
                type="email"
                value={localSettings.support_email}
                onChange={(e) => handleChange('support_email', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="support_phone">Support Phone</Label>
              <Input
                id="support_phone"
                value={localSettings.support_phone}
                onChange={(e) => handleChange('support_phone', e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="email_notifications"
                checked={localSettings.email_notifications}
                onCheckedChange={(checked) => handleChange('email_notifications', checked)}
              />
              <Label htmlFor="email_notifications">Email Notifications</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="sms_notifications"
                checked={localSettings.sms_notifications}
                onCheckedChange={(checked) => handleChange('sms_notifications', checked)}
              />
              <Label htmlFor="sms_notifications">SMS Notifications</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Financial Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="default_currency">Default Currency</Label>
              <Input
                id="default_currency"
                value={localSettings.default_currency}
                onChange={(e) => handleChange('default_currency', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="platform_commission">Platform Commission (%)</Label>
              <Input
                id="platform_commission"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={localSettings.platform_commission}
                onChange={(e) => handleChange('platform_commission', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security & Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Two-Factor Authentication</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">Enabled</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">SSL Certificate</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database Backup</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">Daily</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Rate Limiting</span>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">Active</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettingsManager;
