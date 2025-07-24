
import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import AdminSettingsManager from '@/components/admin/AdminSettingsManager';
import { useIsAdmin } from '@/hooks/useUserRole';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle, Loader2 } from 'lucide-react';

const AdminSettings = () => {
  const { isAdmin, isLoading } = useIsAdmin();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <Loader2 className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-semibold mb-2">Loading...</h3>
              <p className="text-gray-600">Checking permissions</p>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  if (!isAdmin) {
    return (
      <AdminLayout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Access Denied</h3>
              <p className="text-gray-600">You don't have permission to access admin settings</p>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <AdminSettingsManager />
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
