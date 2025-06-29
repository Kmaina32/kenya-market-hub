
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, any>;
}

export const ViewModal: React.FC<ViewModalProps> = ({ isOpen, onClose, title, data }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>View detailed information</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="grid grid-cols-3 gap-4">
              <Label className="font-medium capitalize">{key.replace(/_/g, ' ')}</Label>
              <div className="col-span-2">
                {typeof value === 'boolean' ? (
                  <Badge variant={value ? 'default' : 'secondary'}>
                    {value ? 'Yes' : 'No'}
                  </Badge>
                ) : typeof value === 'object' && value !== null ? (
                  <pre className="text-xs bg-gray-100 p-2 rounded">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                ) : (
                  <span className="text-sm">{String(value || 'N/A')}</span>
                )}
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, any>;
  onSave: (data: Record<string, any>) => void;
  fields: Array<{
    key: string;
    label: string;
    type: 'text' | 'email' | 'number' | 'textarea' | 'select';
    options?: Array<{ value: string; label: string }>;
  }>;
}

export const EditModal: React.FC<EditModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  data, 
  onSave, 
  fields 
}) => {
  const [formData, setFormData] = useState(data);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Edit information</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              {field.type === 'textarea' ? (
                <Textarea
                  id={field.key}
                  value={formData[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                />
              ) : field.type === 'select' ? (
                <select
                  id={field.key}
                  value={formData[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  id={field.key}
                  type={field.type}
                  value={formData[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onConfirm: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  onConfirm
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={handleConfirm}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
