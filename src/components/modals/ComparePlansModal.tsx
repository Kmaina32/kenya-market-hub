
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

interface ComparePlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlans: string[];
}

const ComparePlansModal = ({ isOpen, onClose, selectedPlans }: ComparePlansModalProps) => {
  // Mock comparison data - in real app this would come from API
  const comparisonData = [
    {
      id: '1',
      name: 'Basic Health Plan',
      price: 'KSh 5,000/month',
      features: {
        'Outpatient Care': true,
        'Inpatient Care': true,
        'Emergency Care': true,
        'Specialist Consultations': false,
        'Dental Care': false,
        'Maternity Care': false
      }
    },
    {
      id: '2',
      name: 'Premium Health Plan',
      price: 'KSh 12,000/month',
      features: {
        'Outpatient Care': true,
        'Inpatient Care': true,
        'Emergency Care': true,
        'Specialist Consultations': true,
        'Dental Care': true,
        'Maternity Care': true
      }
    }
  ];

  const allFeatures = [
    'Outpatient Care',
    'Inpatient Care', 
    'Emergency Care',
    'Specialist Consultations',
    'Dental Care',
    'Maternity Care'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl mx-auto max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Compare Insurance Plans</DialogTitle>
          <DialogDescription>
            Compare features and benefits of selected insurance plans.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-semibold">Features</th>
                {comparisonData.map((plan) => (
                  <th key={plan.id} className="text-center p-4 min-w-[200px]">
                    <div className="space-y-2">
                      <h3 className="font-semibold">{plan.name}</h3>
                      <Badge variant="outline">{plan.price}</Badge>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allFeatures.map((feature) => (
                <tr key={feature} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{feature}</td>
                  {comparisonData.map((plan) => (
                    <td key={plan.id} className="p-4 text-center">
                      {plan.features[feature as keyof typeof plan.features] ? (
                        <Check className="h-5 w-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close Comparison
          </Button>
          <div className="space-x-2">
            {comparisonData.map((plan) => (
              <Button key={plan.id} size="sm">
                Select {plan.name}
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComparePlansModal;
