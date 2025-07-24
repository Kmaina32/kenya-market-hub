
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle, Phone, Shield, MapPin } from 'lucide-react';
import { useSafetyFeatures } from '@/hooks/useSafetyFeatures';

const SOSButton = () => {
  const { triggerSOS, deactivateSOS, isSOSActive, lastKnownLocation } = useSafetyFeatures();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [sosType, setSOSType] = useState<'sos' | 'panic'>('sos');

  const handleSOSClick = (type: 'sos' | 'panic') => {
    setSOSType(type);
    setShowConfirmDialog(true);
  };

  const confirmSOS = async () => {
    await triggerSOS(sosType);
    setShowConfirmDialog(false);
  };

  const handleDeactivate = async () => {
    // In a real app, this would deactivate the most recent active alert
    console.log('Deactivating SOS...');
    setShowConfirmDialog(false);
  };

  if (isSOSActive) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg max-w-sm">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 animate-pulse" />
            <span className="font-semibold">SOS ACTIVE</span>
          </div>
          <p className="text-sm mb-3">Emergency services have been notified</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-white text-red-600 border-white hover:bg-gray-100"
              onClick={handleDeactivate}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-white text-red-600 border-white hover:bg-gray-100"
            >
              <Phone className="h-4 w-4 mr-1" />
              Call 911
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <Button
          onClick={() => handleSOSClick('sos')}
          className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 shadow-lg"
          size="sm"
        >
          <AlertTriangle className="h-8 w-8 text-white" />
        </Button>
        <Button
          onClick={() => handleSOSClick('panic')}
          className="w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 shadow-lg"
          size="sm"
        >
          <Shield className="h-6 w-6 text-white" />
        </Button>
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Emergency Alert
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="font-medium text-red-800">
                {sosType === 'sos' ? 'SOS Emergency' : 'Panic Alert'}
              </p>
              <p className="text-sm text-red-700 mt-1">
                {sosType === 'sos' 
                  ? 'This will notify emergency services and your emergency contacts'
                  : 'This will send a silent alert to your emergency contacts'
                }
              </p>
            </div>

            {lastKnownLocation && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>Location: {lastKnownLocation.lat.toFixed(6)}, {lastKnownLocation.lng.toFixed(6)}</span>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmSOS}
                className="flex-1 bg-red-500 hover:bg-red-600"
              >
                Confirm {sosType === 'sos' ? 'SOS' : 'Panic Alert'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SOSButton;
