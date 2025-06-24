
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface InsurancePlan {
  id: string;
  name: string;
  description?: string;
  plan_type: string;
  coverage_amount?: number;
  monthly_premium: number;
  features: string[];
  is_active: boolean;
  created_at: string;
}

export interface InsurancePolicy {
  id: string;
  user_id: string;
  plan_id: string;
  policy_number: string;
  start_date: string;
  end_date: string;
  status: string;
  premium_paid: number;
  created_at: string;
  plan?: InsurancePlan;
}

export const useInsurance = () => {
  const [plans, setPlans] = useState<InsurancePlan[]>([]);
  const [userPolicies, setUserPolicies] = useState<InsurancePolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('insurance_plans')
        .select('*')
        .eq('is_active', true)
        .order('monthly_premium');

      if (error) throw error;
      setPlans(data || []);
    } catch (err) {
      console.error('Error fetching insurance plans:', err);
      setError('Failed to load insurance plans');
    }
  };

  const fetchUserPolicies = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('insurance_policies')
        .select(`
          *,
          plan:insurance_plans (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserPolicies(data || []);
    } catch (err) {
      console.error('Error fetching user policies:', err);
      setError('Failed to load your policies');
    }
  };

  const getPlansByType = (planType: string) => {
    return plans.filter(plan => plan.plan_type.toLowerCase() === planType.toLowerCase());
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchPlans(), fetchUserPolicies()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    plans,
    userPolicies,
    loading,
    error,
    getPlansByType,
    refetch: () => {
      fetchPlans();
      fetchUserPolicies();
    }
  };
};
