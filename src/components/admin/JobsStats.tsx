
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

const JobsStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['jobs-stats'],
    queryFn: async () => {
      const [
        totalJobsResult,
        openJobsResult,
        closedJobsResult,
        applicationsResult
      ] = await Promise.all([
        supabase.from('jobs').select('id', { count: 'exact', head: true }),
        supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'open'),
        supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'closed'),
        supabase.from('job_applications').select('id', { count: 'exact', head: true })
      ]);

      return {
        totalJobs: totalJobsResult.count || 0,
        openJobs: openJobsResult.count || 0,
        closedJobs: closedJobsResult.count || 0,
        totalApplications: applicationsResult.count || 0
      };
    }
  });

  const statCards = [
    {
      title: 'Total Jobs',
      value: stats?.totalJobs || 0,
      icon: Briefcase,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Open Positions',
      value: stats?.openJobs || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Closed Jobs',
      value: stats?.closedJobs || 0,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Total Applications',
      value: stats?.totalApplications || 0,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <IconComponent className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default JobsStats;
