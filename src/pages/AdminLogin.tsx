
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { handleLoginAttempt, failedAttempts, isLocked, lockUntil } = useEnhancedAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!credentials.email || !credentials.password) {
        setError('Please enter both email and password');
        return;
      }

      await handleLoginAttempt(credentials.email, credentials.password);
      navigate('/admin');
    } catch (error: any) {
      setError(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white border-gray-200 shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <ShieldCheck className="text-white h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Sokko Sasa Admin
          </CardTitle>
          <p className="text-gray-600 mt-2">Secure admin access portal</p>
        </CardHeader>
        <CardContent>
          {isLocked && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Account temporarily locked until {lockUntil?.toLocaleTimeString()}
              </AlertDescription>
            </Alert>
          )}

          {failedAttempts > 0 && !isLocked && (
            <Alert className="mb-4 border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                {failedAttempts} failed attempt(s). {5 - failedAttempts} remaining before lockout.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-700">Admin Email</Label>
              <Input
                id="email"
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                placeholder="Enter admin email"
                className="mt-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                disabled={isLocked || isLoading}
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
                placeholder="Enter password"
                className="mt-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                disabled={isLocked || isLoading}
                required
              />
            </div>
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}
            <Button 
              type="submit" 
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50" 
              disabled={isLocked || isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-sm mb-2 text-gray-800">Security Features:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Account lockout after 5 failed attempts</li>
              <li>• Enhanced audit logging</li>
              <li>• Secure authentication flow</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
