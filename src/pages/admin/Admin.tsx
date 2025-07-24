
import React from 'react';
import MainLayout from '@/components/MainLayout';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';

const Admin = () => {
  const { user } = useAuth();

  // Check if user is admin (this should be enhanced with proper role checking)
  const isAdmin = user?.email === 'gmaina424@gmail.com';

  if (!user) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Authentication Required</h3>
              <p className="text-gray-600">Please log in to access the admin panel</p>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (!isAdmin) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Access Denied</h3>
              <p className="text-gray-600">You don't have permission to access the admin panel</p>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <AdminDashboard />
      </div>
    </MainLayout>
  );
};

export default Admin;
