import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAdminUsers, useUpdateUserRole, useDeleteUser, useCreateUser } from '@/hooks/useAdminUsers'; // Assuming useCreateUser is part of this hook
import { Users, Search, Edit, Trash2, Eye, Plus, Loader2 } from 'lucide-react'; // Added Loader2 for spinners
import { validateInput } from '@/utils/authUtils'; // Utility for input sanitization

/**
 * @typedef {object} UserData
 * @property {string} id - The unique ID of the user.
 * @property {string} [full_name] - The full name of the user.
 * @property {string} email - The email address of the user.
 * @property {string} [phone] - The phone number of the user.
 * @property {string} [city] - The city of the user.
 * @property {string} [country] - The country of the user.
 * @property {string} created_at - The timestamp when the user account was created.
 * @property {Array<{ role: string }>} [user_roles] - An array of roles assigned to the user.
 */
interface UserData {
  id: string;
  full_name?: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  created_at: string;
  user_roles?: { role: string }[];
}

/**
 * AdminUsers component provides a dashboard for managing users.
 * It allows searching, viewing, updating user roles, and deleting users.
 * Also includes functionality to add new users via a modal.
 */
const AdminUsers = () => {
  // State for search term and modal visibility
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [userToDeleteId, setUserToDeleteId] = useState<string | null>(null);

  // Form data for adding a new user
  const [newUserData, setNewUserData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'customer' as 'customer' | 'vendor' | 'driver' | 'admin',
  });

  // Data fetching and mutation hooks
  const { data: users, isLoading } = useAdminUsers();
  const updateUserRoleMutation = useUpdateUserRole();
  const deleteUserMutation = useDeleteUser();
  const createUserMutation = useCreateUser(); // Assuming this hook is available

  /**
   * Handles the change of a user's role.
   * @param {string} userId - The ID of the user whose role is being changed.
   * @param {'admin' | 'customer' | 'vendor' | 'driver' | 'property_owner' | 'rider' | 'service_provider'} role - The new role.
   */
  const handleRoleChange = (userId: string, role: UserData['user_roles'][0]['role']) => {
    updateUserRoleMutation.mutate({ userId, role });
  };

  /**
   * Initiates the user deletion process by opening a confirmation dialog.
   * @param {string} userId - The ID of the user to be deleted.
   */
  const confirmDeleteUser = (userId: string) => {
    setUserToDeleteId(userId);
    setIsDeleteDialogOpen(true);
  };

  /**
   * Executes the user deletion after confirmation.
   */
  const handleDeleteUser = () => {
    if (userToDeleteId) {
      deleteUserMutation.mutate(userToDeleteId);
      setIsDeleteDialogOpen(false); // Close dialog after initiating deletion
      setUserToDeleteId(null);
    }
  };

  /**
   * Handles the submission of the "Add User" form.
   * @param {React.FormEvent} e - The form event.
   */
  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createUserMutation.mutate(newUserData, {
      onSuccess: () => {
        setIsAddUserModalOpen(false);
        setNewUserData({ full_name: '', email: '', password: '', role: 'customer' }); // Reset form
      },
      // onError: (error) => { // Error handling is typically handled by useToast in the hook
      //   console.error('Error creating user:', error);
      // }
    });
  };

  // Sanitize search input to prevent XSS or excessively long inputs
  const sanitizedSearchTerm = validateInput(searchTerm, 100);

  // Filter users based on search term
  const filteredUsers = users?.filter(user =>
    user.full_name?.toLowerCase().includes(sanitizedSearchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(sanitizedSearchTerm.toLowerCase())
  ) || [];

  /**
   * Determines the color variant for a role badge.
   * @param {string} role - The role of the user.
   * @returns {'destructive' | 'default' | 'secondary' | 'outline'} The badge variant.
   */
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'vendor': return 'default';
      case 'driver': return 'secondary';
      case 'customer': return 'outline';
      case 'property_owner': return 'default';
      case 'service_provider': return 'secondary';
      default: return 'outline';
    }
  };

  /**
   * Extracts the primary role of a user.
   * Assumes the first role in the `user_roles` array is the primary.
   * @param {UserData} user - The user object.
   * @returns {string} The primary role, or 'customer' if no roles are found.
   */
  const getUserRole = (user: UserData) => {
    if (user.user_roles && user.user_roles.length > 0) {
      return user.user_roles[0].role;
    }
    return 'customer';
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage all users and their assigned roles within the platform.</p>
        </div>
        <Button onClick={() => setIsAddUserModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" /> Add New User
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name or email..."
            className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(validateInput(e.target.value, 100))}
            maxLength={100}
            aria-label="Search users"
          />
        </div>
        {/* Potentially add filters here */}
      </div>

      {/* Users Table Card */}
      <Card className="shadow-lg rounded-lg border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="flex items-center text-xl font-semibold text-gray-800">
            <Users className="h-5 w-5 mr-2 text-blue-500" />
            All Users ({filteredUsers.length})
          </CardTitle>
          {/* Optionally add refresh button or bulk actions here */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => { /* Implement refresh logic if useAdminUsers has a refetch */ }}
            disabled={isLoading}
            className="text-gray-600 hover:bg-gray-100"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Refresh
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading && users?.length === 0 ? ( // Show full loading spinner only on initial load without data
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Loader2 className="h-10 w-10 animate-spin text-orange-500 mb-4" />
              <span className="text-lg font-medium">Loading users...</span>
              <p className="text-sm mt-1">Please wait while we fetch the user data.</p>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table className="min-w-full divide-y divide-gray-200">
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => {
                    const userRole = getUserRole(user);
                    const isUserUpdating = updateUserRoleMutation.isPending && updateUserRoleMutation.variables?.userId === user.id;
                    const isUserDeleting = deleteUserMutation.isPending && deleteUserMutation.variables === user.id;

                    return (
                      <TableRow key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-medium text-gray-900">{user.full_name || 'N/A'}</div>
                            <div className="text-sm text-gray-500">{user.city || 'N/A'}, {user.country || 'N/A'}</div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.phone || 'N/A'}</TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={getRoleColor(userRole)} className="capitalize">
                            {userRole}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Select
                              value={userRole}
                              onValueChange={(role) => handleRoleChange(user.id, role as any)}
                              disabled={isUserUpdating || isUserDeleting} // Disable if updating or deleting
                            >
                              <SelectTrigger className="w-[130px] h-9 text-gray-700 border-gray-300 hover:border-blue-400">
                                {isUserUpdating ? (
                                  <span className="flex items-center gap-1">
                                    <Loader2 className="h-3 w-3 animate-spin" /> Updating...
                                  </span>
                                ) : (
                                  <SelectValue />
                                )}
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="customer">Customer</SelectItem>
                                <SelectItem value="vendor">Vendor</SelectItem>
                                <SelectItem value="driver">Driver</SelectItem>
                                <SelectItem value="property_owner">Property Owner</SelectItem>
                                <SelectItem value="service_provider">Service Provider</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                            {/* Optional: View User Details Button */}
                            {/* <Button size="icon" variant="ghost" className="h-9 w-9 text-gray-500 hover:text-blue-600">
                              <Eye className="h-4 w-4" />
                            </Button> */}
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => confirmDeleteUser(user.id)}
                              disabled={isUserDeleting || isUserUpdating}
                              className="h-9 w-9 text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              {isUserDeleting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            // Empty state when no users match search or no users exist
            <div className="text-center py-12 text-gray-500">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium">No users found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add User Modal */}
      <Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-500" /> Add New User
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddUserSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="full_name" className="text-right">Full Name</Label>
              <Input
                id="full_name"
                value={newUserData.full_name}
                onChange={(e) => setNewUserData(prev => ({ ...prev, full_name: validateInput(e.target.value, 100) }))}
                className="col-span-3"
                required
                maxLength={100}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUserData.email}
                onChange={(e) => setNewUserData(prev => ({ ...prev, email: e.target.value }))}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">Password</Label>
              <Input
                id="password"
                type="password"
                value={newUserData.password}
                onChange={(e) => setNewUserData(prev => ({ ...prev, password: e.target.value }))}
                className="col-span-3"
                required
                minLength={6} // Enforce minimum password length
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">Role</Label>
              <Select
                value={newUserData.role}
                onValueChange={(value: typeof newUserData.role) => setNewUserData(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                  <SelectItem value="driver">Driver</SelectItem>
                  <SelectItem value="property_owner">Property Owner</SelectItem>
                  <SelectItem value="service_provider">Service Provider</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createUserMutation.isPending}>
                {createUserMutation.isPending ? (
                  <span className="flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding User...</span>
                ) : (
                  'Add User'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account and associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteUserMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={deleteUserMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteUserMutation.isPending ? (
                <span className="flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</span>
              ) : (
                'Delete User'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminUsers;