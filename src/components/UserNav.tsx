
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
          <Button variant="ghost" size="sm" className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-200">
            <Menu className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white/95 backdrop-blur-md border-orange-100 shadow-xl rounded-xl" align="end">
          <DropdownMenuItem asChild className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 rounded-lg">
            <Link to="/" className="flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-orange-100" />
          <DropdownMenuItem asChild className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-lg">
            <Link to="/auth" className="flex items-center">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 rounded-lg">
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
          <Button variant="ghost" size="sm" className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-200">
            <Menu className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white/95 backdrop-blur-md border-orange-100 shadow-xl rounded-xl" align="end">
          <DropdownMenuItem asChild className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 rounded-lg">
            <Link to="/" className="flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-orange-100" />
          <DropdownMenuItem asChild className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-lg">
            <Link to="/auth" className="flex items-center">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 rounded-lg">
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
        <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-200">
          <Avatar className="h-10 w-10 border-2 border-gradient-to-r from-orange-300 to-red-300 shadow-md">
            <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white/95 backdrop-blur-md border-orange-100 shadow-xl rounded-xl" align="end" forceMount>
        <div className="flex items-center justify-start gap-3 p-3">
          <Avatar className="h-8 w-8 border border-orange-200">
            <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium text-gray-900 text-sm">{displayName}</p>
            <p className="text-xs text-gray-600">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator className="bg-orange-100" />
        <DropdownMenuItem asChild className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 rounded-lg mx-1">
          <Link to="/" className="flex items-center">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-lg mx-1">
          <Link to="/profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        {/* Admin panel access for authorized users */}
        {isAdmin && (
          <DropdownMenuItem asChild className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 rounded-lg mx-1">
            <Link to="/admin/dashboard" className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Admin Panel
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-orange-50 rounded-lg mx-1">
          <Link to="/settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-orange-100" />
        <DropdownMenuItem 
          onClick={signOut} 
          className="flex items-center hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 text-red-600 rounded-lg mx-1"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNav;
