
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Users, Search, CheckCircle, XCircle } from 'lucide-react';
import { EditButton, DeleteButton, ViewButton } from '@/components/ui/action-buttons';
import { ViewModal, EditModal, DeleteModal } from '@/components/admin/ActionModals';
import { toast } from 'sonner';

const AdminAgents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [modalType, setModalType] = useState<'view' | 'edit' | 'delete' | null>(null);
  const queryClient = useQueryClient();

  // Fetch real estate agents
  const { data: agents, isLoading } = useQuery({
    queryKey: ['admin-agents', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('real_estate_agents')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`email.ilike.%${searchTerm}%,agency_name.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });

  // Approve agent mutation
  const approveAgent = useMutation({
    mutationFn: async (agentId: string) => {
      const { error } = await supabase
        .from('real_estate_agents')
        .update({ is_verified: true })
        .eq('id', agentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-agents'] });
      toast.success('Agent approved successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to approve agent: ${error.message}`);
    }
  });

  // Update agent mutation
  const updateAgent = useMutation({
    mutationFn: async ({ id, ...agentData }: any) => {
      const { error } = await supabase
        .from('real_estate_agents')
        .update(agentData)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-agents'] });
      toast.success('Agent updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update agent: ${error.message}`);
    }
  });

  // Delete agent mutation
  const deleteAgent = useMutation({
    mutationFn: async (agentId: string) => {
      const { error } = await supabase
        .from('real_estate_agents')
        .update({ is_active: false })
        .eq('id', agentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-agents'] });
      toast.success('Agent deactivated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to deactivate agent: ${error.message}`);
    }
  });

  const handleView = (agent: any) => {
    setSelectedAgent(agent);
    setModalType('view');
  };

  const handleEdit = (agent: any) => {
    setSelectedAgent(agent);
    setModalType('edit');
  };

  const handleDelete = (agent: any) => {
    setSelectedAgent(agent);
    setModalType('delete');
  };

  const editFields = [
    { key: 'email', label: 'Email', type: 'email' as const },
    { key: 'phone', label: 'Phone', type: 'text' as const },
    { key: 'agency_name', label: 'Agency Name', type: 'text' as const },
    { key: 'license_number', label: 'License Number', type: 'text' as const },
    { key: 'bio', label: 'Bio', type: 'textarea' as const },
    { 
      key: 'is_verified', 
      label: 'Verification Status', 
      type: 'select' as const,
      options: [
        { value: 'true', label: 'Verified' },
        { value: 'false', label: 'Not Verified' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Real Estate Agents</h1>
          <p className="text-gray-600">Manage real estate agent applications and profiles</p>
        </div>
        <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Agent
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search agents..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            All Agents ({agents?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <span className="ml-2">Loading agents...</span>
            </div>
          ) : agents && agents.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Agency</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>License</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                            <Users className="h-4 w-4 text-orange-600" />
                          </div>
                          <span className="font-medium">{agent.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>{agent.agency_name || 'Independent'}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{agent.email}</div>
                          <div className="text-gray-500">{agent.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{agent.license_number || 'N/A'}</span>
                      </TableCell>
                      <TableCell>{agent.total_sales || 0}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="text-yellow-500">★</span>
                          <span className="ml-1">{agent.rating || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={agent.is_verified ? 'default' : 'secondary'}
                            className={agent.is_verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                          >
                            {agent.is_verified ? 'Verified' : 'Pending'}
                          </Badge>
                          {!agent.is_verified && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => approveAgent.mutate(agent.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <ViewButton onClick={() => handleView(agent)} />
                          <EditButton onClick={() => handleEdit(agent)} />
                          <DeleteButton onClick={() => handleDelete(agent)} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Agents Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No agents match your search criteria.' : 'Real estate agents will appear here once they register.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {selectedAgent && (
        <>
          <ViewModal
            isOpen={modalType === 'view'}
            onClose={() => setModalType(null)}
            title={`Agent Details - ${selectedAgent.email}`}
            data={selectedAgent}
          />

          <EditModal
            isOpen={modalType === 'edit'}
            onClose={() => setModalType(null)}
            title={`Edit Agent - ${selectedAgent.email}`}
            data={selectedAgent}
            fields={editFields}
            onSave={(data) => updateAgent.mutate({ id: selectedAgent.id, ...data })}
          />

          <DeleteModal
            isOpen={modalType === 'delete'}
            onClose={() => setModalType(null)}
            title="Deactivate Agent"
            description={`Are you sure you want to deactivate this agent? They will no longer be able to list properties.`}
            onConfirm={() => deleteAgent.mutate(selectedAgent.id)}
          />
        </>
      )}
    </div>
  );
};

export default AdminAgents;
