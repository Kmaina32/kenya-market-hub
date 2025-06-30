
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LoadingButton } from '@/components/ui/LoadingButton';
import { InputField, TextareaField, SelectField } from '@/components/ui/FormField';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventData?: any;
}

const eventTypes = [
  { value: 'conference', label: 'Conference' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'seminar', label: 'Seminar' },
  { value: 'networking', label: 'Networking' },
  { value: 'social', label: 'Social' },
  { value: 'sports', label: 'Sports' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'educational', label: 'Educational' },
  { value: 'business', label: 'Business' },
  { value: 'community', label: 'Community' }
];

const validationSchema = {
  title: { required: true, minLength: 3 },
  event_type: { required: true },
  location: { required: true },
  date: { required: true }
};

const EditEventModal: React.FC<EditEventModalProps> = ({ 
  isOpen, 
  onClose, 
  eventId, 
  eventData 
}) => {
  const queryClient = useQueryClient();
  const { handleError, handleSuccess } = useErrorHandler();
  
  const initialValues = {
    title: eventData?.title || '',
    description: eventData?.description || '',
    event_type: eventData?.event_type || '',
    location: eventData?.location || '',
    date: eventData?.date ? new Date(eventData.date).toISOString().slice(0, 16) : '',
    end_date: eventData?.end_date ? new Date(eventData.end_date).toISOString().slice(0, 16) : '',
    price: eventData?.price?.toString() || '0',
    max_attendees: eventData?.max_attendees?.toString() || '',
    image_url: eventData?.image_url || ''
  };

  const { values, errors, handleChange, handleBlur, validateForm } = useFormValidation(
    initialValues,
    validationSchema
  );

  const updateEventMutation = useMutation({
    mutationFn: async (eventData: any) => {
      const { data, error } = await supabase
        .from('events')
        .update({
          ...eventData,
          price: parseFloat(eventData.price),
          max_attendees: eventData.max_attendees ? parseInt(eventData.max_attendees) : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', eventId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      handleSuccess('Event updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      onClose();
    },
    onError: (error: any) => {
      handleError(error, { customMessage: 'Failed to update event' });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      updateEventMutation.mutate(values);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Event Title"
            name="title"
            value={values.title}
            onChange={(value) => handleChange('title', value)}
            onBlur={() => handleBlur('title')}
            error={errors.title}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Event Type"
              name="event_type"
              value={values.event_type}
              onChange={(value) => handleChange('event_type', value)}
              options={eventTypes}
              error={errors.event_type}
              required
            />

            <InputField
              label="Location"
              name="location"
              value={values.location}
              onChange={(value) => handleChange('location', value)}
              onBlur={() => handleBlur('location')}
              error={errors.location}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Start Date & Time"
              name="date"
              type="datetime-local"
              value={values.date}
              onChange={(value) => handleChange('date', value)}
              onBlur={() => handleBlur('date')}
              error={errors.date}
              required
            />

            <InputField
              label="End Date & Time"
              name="end_date"
              type="datetime-local"
              value={values.end_date}
              onChange={(value) => handleChange('end_date', value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Ticket Price (KSH)"
              name="price"
              type="number"
              step="0.01"
              value={values.price}
              onChange={(value) => handleChange('price', value)}
            />

            <InputField
              label="Max Attendees"
              name="max_attendees"
              type="number"
              value={values.max_attendees}
              onChange={(value) => handleChange('max_attendees', value)}
            />
          </div>

          <InputField
            label="Event Image URL"
            name="image_url"
            value={values.image_url}
            onChange={(value) => handleChange('image_url', value)}
            placeholder="https://..."
          />

          <TextareaField
            label="Event Description"
            name="description"
            value={values.description}
            onChange={(value) => handleChange('description', value)}
            rows={4}
          />

          <div className="flex gap-3 pt-4">
            <LoadingButton
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600"
            >
              Cancel
            </LoadingButton>
            <LoadingButton
              type="submit"
              loading={updateEventMutation.isPending}
              className="flex-1"
            >
              Update Event
            </LoadingButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEventModal;
