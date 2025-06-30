
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
      // Use dynamic table name approach to avoid TypeScript issues
      const { error } = await supabase
        .rpc('delete_record', {
          table_name: tableName,
          record_id: id
        });

      // Fallback to direct table access if RPC doesn't exist
      if (error && error.message.includes('function delete_record')) {
        const { error: directError } = await (supabase as any)
          .from(tableName)
          .delete()
          .eq('id', id);
        
        if (directError) throw directError;
      } else if (error) {
        throw error;
      }
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
