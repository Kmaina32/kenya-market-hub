
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Search, DollarSign, Plus } from 'lucide-react';
import CreateInsurancePlanModal from '@/components/admin/CreateInsurancePlanModal';

const AdminInsurance: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch insurance plans from database
  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ['admin-insurance-plans', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('insurance_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,plan_type.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  // Fetch insurance policies
  const { data: policies, isLoading: policiesLoading } = useQuery({
    queryKey: ['admin-insurance-policies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('insurance_policies')
        .select(`
          *,
          plan:insurance_plans(name, plan_type)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Insurance Management</h1>
          <p className="text-gray-600 mt-1">Manage insurance plans and policies</p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Plan
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search insurance plans..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Insurance Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Insurance Plans ({plans?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {plansLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <span className="ml-2">Loading insurance plans...</span>
            </div>
          ) : plans && plans.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Monthly Premium</TableHead>
                    <TableHead>Coverage Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Features</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{plan.name}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {plan.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{plan.plan_type}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-green-600">
                        <div className="flex items-center">
                          <DollarSign className="h-3 w-3 mr-1" />
                          KSh {Number(plan.monthly_premium).toLocaleString()}/month
                        </div>
                      </TableCell>
                      <TableCell>
                        {plan.coverage_amount ? (
                          <span className="font-medium">KSh {Number(plan.coverage_amount).toLocaleString()}</span>
                        ) : (
                          <span className="text-gray-500">Not specified</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={plan.is_active ? 'default' : 'secondary'}>
                          {plan.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {Array.isArray(plan.features) && plan.features.length > 0 ? (
                            <span>{plan.features.length} features</span>
                          ) : (
                            <span className="text-gray-500">No features listed</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Insurance Plans Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No plans match your search criteria.' : 'Insurance plans will appear here once they are created.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insurance Policies */}
      <Card>
        <CardHeader>
          <CardTitle>Active Policies ({policies?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {policiesLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <span className="ml-2">Loading policies...</span>
            </div>
          ) : policies && policies.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Policy Number</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Premium Paid</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {policies.map((policy) => (
                    <TableRow key={policy.id}>
                      <TableCell className="font-mono text-sm">{policy.policy_number}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{policy.plan?.name || 'Unknown Plan'}</div>
                          <Badge variant="outline" className="text-xs">
                            {policy.plan?.plan_type || 'Unknown Type'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div>{policy.start_date} to {policy.end_date}</div>
                      </TableCell>
                      <TableCell className="font-semibold text-green-600">
                        KSh {Number(policy.premium_paid || 0).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={policy.status === 'active' ? 'default' : 'secondary'}>
                          {policy.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Policies</h3>
              <p className="text-gray-600 mb-4">Insurance policies will appear here once customers purchase them.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateInsurancePlanModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default AdminInsurance;
