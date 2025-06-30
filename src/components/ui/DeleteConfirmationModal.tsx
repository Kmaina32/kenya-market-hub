
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { LoadingButton } from '@/components/ui/LoadingButton';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
  itemName?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title,
  description,
  itemName = 'item'
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <DialogTitle>{title || `Delete ${itemName}`}</DialogTitle>
          </div>
          <DialogDescription className="text-left">
            {description || `Are you sure you want to delete this ${itemName}? This action cannot be undone.`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 pt-4">
          <LoadingButton
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-500 hover:bg-gray-600"
            disabled={isLoading}
          >
            Cancel
          </LoadingButton>
          <LoadingButton
            type="button"
            onClick={onConfirm}
            loading={isLoading}
            className="flex-1 bg-red-500 hover:bg-red-600"
          >
            Delete
          </LoadingButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
