
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, LogOut, Settings, Menu, UserPlus, LogIn, Home, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const UserNav = () => {
  let user, signOut, isAdmin;
  
  try {
    const auth = useAuth();
    user = auth.user;
    signOut = auth.signOut;
    isAdmin = auth.isAdmin;
  } catch (error) {
    // If auth context is not available, show guest menu
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50">
            <Menu className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white backdrop-blur-sm border shadow-xl" align="end">
          <DropdownMenuItem asChild className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50">
            <Link to="/" className="flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50">
            <Link to="/auth" className="flex items-center">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50">
            <Link to="/auth" className="flex items-center">
              <UserPlus className="mr-2 h-4 w-4" />
              Sign Up
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const navigate = useNavigate();

  if (!user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50">
            <Menu className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white backdrop-blur-sm border shadow-xl" align="end">
          <DropdownMenuItem asChild className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50">
            <Link to="/" className="flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50">
            <Link to="/auth" className="flex items-center">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50">
            <Link to="/auth" className="flex items-center">
              <UserPlus className="mr-2 h-4 w-4" />
              Sign Up
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Get user display name from user metadata or email
  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50">
          <Avatar className="h-8 w-8 border-2 border-gradient-to-r from-orange-300 to-red-300">
            <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white backdrop-blur-sm border shadow-xl" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium text-gray-900">{displayName}</p>
            <p className="text-xs text-gray-600">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50">
          <Link to="/" className="flex items-center">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50">
          <Link to="/profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        {/* Admin panel access for authorized users */}
        {isAdmin && (
          <DropdownMenuItem asChild className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50">
            <Link to="/admin/dashboard" className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Admin Panel
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={signOut} 
          className="flex items-center hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNav;
