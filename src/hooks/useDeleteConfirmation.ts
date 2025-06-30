
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useErrorHandler } from './useErrorHandler';

interface UseDeleteConfirmationProps {
  tableName: string;
  queryKey: string[];
  itemName?: string;
}

export const useDeleteConfirmation = ({ 
  tableName, 
  queryKey, 
  itemName = 'item' 
}: UseDeleteConfirmationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  const { handleError, handleSuccess } = useErrorHandler();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Use type assertion to handle dynamic table names
      const { error } = await (supabase as any)
        .from(tableName)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      handleSuccess(`${itemName} deleted successfully!`);
      queryClient.invalidateQueries({ queryKey });
      setIsOpen(false);
      setItemToDelete(null);
    },
    onError: (error: any) => {
      handleError(error, { customMessage: `Failed to delete ${itemName}` });
    }
  });

  const openConfirmation = (id: string) => {
    setItemToDelete(id);
    setIsOpen(true);
  };

  const closeConfirmation = () => {
    setIsOpen(false);
    setItemToDelete(null);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete);
    }
  };

  return {
    isOpen,
    openConfirmation,
    closeConfirmation,
    confirmDelete,
    isDeleting: deleteMutation.isPending
  };
};
