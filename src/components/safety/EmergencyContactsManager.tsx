
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Phone, Plus, Edit2, Trash2, Shield } from 'lucide-react';
import { useSafetyFeatures } from '@/hooks/useSafetyFeatures';

const EmergencyContactsManager = () => {
  const { emergencyContacts, addEmergencyContact } = useSafetyFeatures();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relationship: '',
    is_primary: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addEmergencyContact(formData);
    setFormData({ name: '', phone: '', relationship: '', is_primary: false });
    setIsDialogOpen(false);
  };

  const relationships = [
    'Spouse/Partner',
    'Parent',
    'Sibling',
    'Child',
    'Friend',
    'Colleague',
    'Other'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Emergency Contacts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Manage contacts who will be notified in case of emergency
          </p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Emergency Contact</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+254 700 000 000"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="relationship">Relationship</Label>
                  <Select value={formData.relationship} onValueChange={(value) => setFormData(prev => ({ ...prev, relationship: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      {relationships.map(rel => (
                        <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="primary">Primary Contact</Label>
                  <Switch
                    id="primary"
                    checked={formData.is_primary}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_primary: checked }))}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Add Contact
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {emergencyContacts.map((contact) => (
            <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-gray-600">{contact.phone}</p>
                  <p className="text-xs text-gray-500">{contact.relationship}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {contact.is_primary && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    Primary
                  </span>
                )}
                <Button size="sm" variant="ghost">
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {emergencyContacts.length === 0 && (
          <div className="text-center py-6">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No emergency contacts added yet</p>
            <p className="text-sm text-gray-500">Add contacts to enhance your safety</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmergencyContactsManager;
