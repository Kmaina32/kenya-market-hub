
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Send } from 'lucide-react';
import { useSafetyFeatures } from '@/hooks/useSafetyFeatures';

interface SafetyReportFormProps {
  rideId?: string;
}

const SafetyReportForm: React.FC<SafetyReportFormProps> = ({ rideId }) => {
  const { reportSafetyIssue } = useSafetyFeatures();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    issueType: '',
    description: '',
    driverName: '',
    licensePlate: ''
  });

  const issueTypes = [
    'Unsafe driving',
    'Inappropriate behavior',
    'Route deviation',
    'Vehicle condition',
    'Harassment',
    'Discrimination',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await reportSafetyIssue(
        formData.issueType,
        `${formData.description}\n\nDriver: ${formData.driverName}\nLicense Plate: ${formData.licensePlate}`,
        rideId
      );
      
      setFormData({
        issueType: '',
        description: '',
        driverName: '',
        licensePlate: ''
      });
    } catch (error) {
      console.error('Error submitting safety report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Report Safety Issue
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="issueType">Type of Issue</Label>
            <Select 
              value={formData.issueType} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, issueType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                {issueTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="driverName">Driver Name (if known)</Label>
            <Input
              id="driverName"
              value={formData.driverName}
              onChange={(e) => setFormData(prev => ({ ...prev, driverName: e.target.value }))}
              placeholder="Enter driver's name"
            />
          </div>

          <div>
            <Label htmlFor="licensePlate">License Plate (if known)</Label>
            <Input
              id="licensePlate"
              value={formData.licensePlate}
              onChange={(e) => setFormData(prev => ({ ...prev, licensePlate: e.target.value }))}
              placeholder="Enter license plate number"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Please describe the safety issue in detail..."
              rows={4}
              required
            />
          </div>

          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-sm text-yellow-800">
              <AlertTriangle className="h-4 w-4 inline mr-1" />
              Your report will be reviewed by our safety team. For immediate emergencies, use the SOS button or call emergency services.
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting || !formData.issueType || !formData.description}
            className="w-full"
          >
            {isSubmitting ? (
              <>Submitting...</>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Report
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SafetyReportForm;
