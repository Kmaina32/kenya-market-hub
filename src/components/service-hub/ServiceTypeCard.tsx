
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UnifiedButton } from '@/components/ui/UnifiedButton';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, XCircle, ArrowRight } from 'lucide-react';

interface ServiceTypeCardProps {
  service: {
    id: string;
    title: string;
    icon: React.ComponentType<any>;
    description: string;
    profile: any;
    color: string;
    dashboardPath: string;
    registrationPath: string;
  };
}

const ServiceTypeCard: React.FC<ServiceTypeCardProps> = ({ service }) => {
  const ServiceIcon = service.icon;
  
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-gray-600">
            Not Registered
          </Badge>
        );
    }
  };

  const getActionButton = () => {
    const isApproved = service.profile?.verification_status === 'approved';
    const isPending = service.profile?.verification_status === 'pending';
    const isRejected = service.profile?.verification_status === 'rejected';

    if (isApproved) {
      return (
        <UnifiedButton asChild className="w-full bg-green-600 hover:bg-green-700">
          <Link to={service.dashboardPath}>
            <span>Access Dashboard</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </UnifiedButton>
      );
    }

    if (isPending) {
      return (
        <UnifiedButton disabled className="w-full bg-yellow-100 text-yellow-800 cursor-not-allowed">
          <Clock className="w-4 h-4 mr-2" />
          <span>Application Under Review</span>
        </UnifiedButton>
      );
    }

    if (isRejected) {
      return (
        <UnifiedButton asChild variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
          <Link to={service.registrationPath}>
            <span>Reapply Now</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </UnifiedButton>
      );
    }

    return (
      <UnifiedButton asChild variant="outline" className="w-full">
        <Link to={service.registrationPath}>
          <span>Apply Now</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </UnifiedButton>
    );
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-opacity-60">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-3 rounded-xl bg-${service.color}-100`}>
            <ServiceIcon className={`h-6 w-6 text-${service.color}-600`} />
          </div>
          {getStatusBadge(service.profile?.verification_status)}
        </div>
        <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
          {service.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm leading-relaxed">
          {service.description}
        </p>
        
        <div className="space-y-2">
          {getActionButton()}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceTypeCard;
