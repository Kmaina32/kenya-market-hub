
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Job {
  id: number;
  title: string;
  description: string;
  company?: string;
  location?: string;
  category: string;
  salary?: string;
  job_type: string;
  status: string;
  created_at: string;
  updated_at: string;
  posted_by?: string;
}

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const getJobsByCategory = (category: string) => {
    return jobs.filter(job => job.category.toLowerCase() === category.toLowerCase());
  };

  const getJobsByType = (jobType: string) => {
    return jobs.filter(job => job.job_type.toLowerCase() === jobType.toLowerCase());
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return {
    jobs,
    loading,
    error,
    getJobsByCategory,
    getJobsByType,
    refetch: fetchJobs
  };
};
