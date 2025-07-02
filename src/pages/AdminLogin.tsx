import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'; // Import the useAuth hook

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signIn } = useAuth(); // Destructure signIn from useAuth

  const handleLogin = async (e: React.FormEvent) => { // Make the function async
    e.preventDefault();
    setError(''); // Clear any previous errors

    // For demo purposes, use a pre-defined admin email and password.
    // In a production environment, these would typically be retrieved securely
    // or the 'username' field would directly be the email for signIn.
    const adminEmail = "admin@example.com"; // Replace with the actual email of your admin user in Supabase
    const adminPassword = "admin123"; // Replace with the actual password of your admin user in Supabase

    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      const { error: authError } = await signIn(adminEmail, adminPassword); // Use the signIn function

      if (authError) {
        setError(authError.message);
      } else {
        // If signIn is successful, AuthContext will update its state,
        // and ProtectedAdminRoute will automatically allow access.
        // No explicit navigate('/admin') is needed here as ProtectedAdminRoute handles it.
      }
    } else {
      setError('Invalid demo credentials. Please use "admin" and "admin123" for demo login, or provide valid admin credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white border-gray-200 shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">SS</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Soko Smart Admin
          </CardTitle>
          <p className="text-gray-600 mt-2">Sign in to your admin dashboard</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-gray-700">Username</Label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                placeholder="Enter admin username"
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                placeholder="Enter admin password"
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Sign In
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-sm mb-2 text-gray-800">Demo Login Credentials:</h4>
            <p className="text-sm text-gray-700"><strong>Username:</strong> admin</p>
            <p className="text-sm text-gray-700"><strong>Password:</strong> admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;