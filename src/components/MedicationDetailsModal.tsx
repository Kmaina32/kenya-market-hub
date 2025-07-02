import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Medication {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  prescription_required: boolean;
  image_url?: string;
  in_stock: boolean;
  pharmacy: string;
}

interface MedicationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  medication: Medication | null;
}

const MedicationDetailsModal: React.FC<MedicationDetailsModalProps> = ({ isOpen, onClose, medication }) => {
  if (!medication) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-bold leading-6 text-gray-900 mb-4"
                >
                  {medication.name}
                </Dialog.Title>
                <div className="mb-4">
                  {medication.image_url && (
                    <img
                      src={medication.image_url}
                      alt={medication.name}
                      className="w-full h-48 object-contain rounded-md"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="mb-2">
                  <Badge variant="outline" className="text-sm">
                    {medication.category}
                  </Badge>
                </div>
                <p className="text-gray-700 mb-2">{medication.description}</p>
                <p className="font-semibold mb-2">
                  Price: KSh {medication.price.toLocaleString()}
                </p>
                <p className="mb-2">
                  Pharmacy: <span className="font-medium">{medication.pharmacy}</span>
                </p>
                <p className="mb-4">
                  {medication.prescription_required ? (
                    <Badge variant="destructive" className="text-sm">
                      Prescription Required
                    </Badge>
                  ) : (
                    <Badge variant="default" className="text-sm">
                      No Prescription Required
                    </Badge>
                  )}
                </p>
                <div className="flex justify-end">
                  <Button onClick={onClose} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                    Close
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default MedicationDetailsModal;
