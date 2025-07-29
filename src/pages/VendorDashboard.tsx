
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/LoadingSpinner';

const VendorDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to Service Provider Hub
    navigate('/service-provider-hub', { replace: true });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner />
      <p className="ml-4 text-gray-600">Redirecting to Service Provider Hub...</p>
    </div>
  );
};

export default VendorDashboard;
