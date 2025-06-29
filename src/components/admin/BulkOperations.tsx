
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, Trash2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BulkOperations = () => {
  const [selectedOperation, setSelectedOperation] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleBulkOperation = async () => {
    if (!selectedOperation) return;
    
    setIsProcessing(true);
    
    // Simulate bulk operation
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: 'Operation Completed',
        description: `Bulk ${selectedOperation} operation completed successfully.`,
      });
    }, 2000);
  };

  const operations = [
    { value: 'export-users', label: 'Export Users', icon: Download },
    { value: 'export-orders', label: 'Export Orders', icon: Download },
    { value: 'import-products', label: 'Import Products', icon: Upload },
    { value: 'delete-inactive', label: 'Delete Inactive Users', icon: Trash2 },
    { value: 'approve-vendors', label: 'Approve Pending Vendors', icon: CheckCircle },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Bulk Operations</h2>
        <p className="text-gray-600">Perform batch operations on your data</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Operations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedOperation} onValueChange={setSelectedOperation}>
              <SelectTrigger>
                <SelectValue placeholder="Select an operation" />
              </SelectTrigger>
              <SelectContent>
                {operations.map((op) => (
                  <SelectItem key={op.value} value={op.value}>
                    <div className="flex items-center gap-2">
                      <op.icon className="h-4 w-4" />
                      {op.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              onClick={handleBulkOperation}
              disabled={!selectedOperation || isProcessing}
              className="w-full"
            >
              {isProcessing ? 'Processing...' : 'Execute Operation'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operation Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Last Export</span>
                <Badge variant="outline">2 hours ago</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Pending Operations</span>
                <Badge>0</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">System Status</span>
                <Badge variant="outline" className="text-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Healthy
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Operations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">Export Users</p>
                <p className="text-sm text-gray-600">Exported 1,234 user records</p>
              </div>
              <Badge variant="outline" className="text-green-600">Completed</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">Import Products</p>
                <p className="text-sm text-gray-600">Imported 856 products</p>
              </div>
              <Badge variant="outline" className="text-green-600">Completed</Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Approve Vendors</p>
                <p className="text-sm text-gray-600">Approved 23 vendor applications</p>
              </div>
              <Badge variant="outline" className="text-green-600">Completed</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkOperations;
