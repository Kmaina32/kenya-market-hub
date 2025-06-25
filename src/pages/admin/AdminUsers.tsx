
import React from 'react';
import { StandardAdminLayout } from '@/components/admin/StandardAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DeleteButton, ViewButton, EditButton } from '@/components/ui/action-buttons';
import { useAdminUsers } from '@/hooks/useAdminData';
import { Plus, UserPlus } from 'lucide-react';

const AdminUsers = () => {
  const { users, isLoading, deleteUser } = useAdminUsers();

  const handleAddUser = () => {
    // Implement add user functionality
    console.log('Add user clicked');
  };

  const handleViewUser = (userId: string) => {
    console.log('View user:', userId);
  };

  const handleEditUser = (userId: string) => {
    console.log('Edit user:', userId);
  };

  const stats = [
    { title: 'Total Users', value: users.length, change: '+12%', trend: 'up' as const },
    { title: 'Active Users', value: users.filter(u => u.role !== 'admin').length, change: '+8%', trend: 'up' as const },
    { title: 'Admins', value: users.filter(u => u.role === 'admin').length, change: '0%', trend: 'neutral' as const },
    { title: 'New This Month', value: 15, change: '+25%', trend: 'up' as const },
  ];

  return (
    <StandardAdminLayout
      title="User Management"
      description="Manage system users and their roles"
      stats={stats}
      actions={
        <Button onClick={handleAddUser} className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      }
      loading={isLoading}
    >
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ViewButton onClick={() => handleViewUser(user.id)} />
                      <EditButton onClick={() => handleEditUser(user.id)} />
                      <DeleteButton onClick={() => deleteUser(user.id)} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </StandardAdminLayout>
  );
};

export default AdminUsers;
