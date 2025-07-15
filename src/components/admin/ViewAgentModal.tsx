
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Separator } from '@/components/ui/separator';
import { Calendar, Mail, Phone, Building, User, Star, CheckCircle, XCircle, FileText } from 'lucide-react';
import { AdminAgent } from '@/hooks/useAdminAgents';

interface ViewAgentModalProps {
  agent: AdminAgent | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewAgentModal = ({ agent, isOpen, onClose }: ViewAgentModalProps) => {
  if (!agent) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        {/* Add DialogTitle here wrapped in VisuallyHidden for accessibility */}
        <VisuallyHidden>
          <DialogTitle>Agent Details</DialogTitle>
        </VisuallyHidden>
        <DialogHeader>
          <DialogDescription>
            Viewing details for {agent.full_name || agent.email}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{agent.full_name || 'N/A'}</h3>
            <div className="flex items-center gap-2">
              {agent.is_verified ? (
                <Badge variant="default" className="bg-green-600"><CheckCircle className="h-4 w-4 mr-1" /> Verified</Badge>
              ) : (
                <Badge variant="destructive"><XCircle className="h-4 w-4 mr-1" /> Not Verified</Badge>
              )}
              {agent.is_active ? (
                <Badge variant="default">Active</Badge>
              ) : (
                <Badge variant="outline">Inactive</Badge>
              )}
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm">{agent.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Phone:</span>
                <span className="text-sm">{agent.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Agency:</span>
                <span className="text-sm">{agent.agency_name || 'Independent'}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">License:</span>
                <span className="text-sm">{agent.license_number || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Rating:</span>
                <span className="text-sm">{Number(agent.rating || 0).toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Joined:</span>
                <span className="text-sm">{new Date(agent.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAgentModal;
