import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { api } from '../services/api';
import logo from 'figma:asset/7478fe69abd5cd9165952273744ef577566140ca.png';

interface LoginPageProps {
  onLogin: (role: 'team' | 'campus_lead', user: any) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (role: 'team' | 'campus_lead') => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await api.login(email, password);
      
      // Check if user role matches the selected tab
      if (response.user.role !== role) {
        setError(`This account is registered as ${response.user.role}. Please use the correct login tab.`);
        api.clearToken();
        setIsLoading(false);
        return;
      }
      
      onLogin(role, response.user);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-lime-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="EdVenture Park" className="h-24" />
          </div>
          <CardTitle>Welcome to EdVenture Park</CardTitle>
          <CardDescription>Incubating India - for the World</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="team" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="team">Team Login</TabsTrigger>
              <TabsTrigger value="campus_lead">Campus Lead</TabsTrigger>
            </TabsList>
            <TabsContent value="team">
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit('team'); }} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="team-email">Email</Label>
                  <Input
                    id="team-email"
                    type="email"
                    placeholder="team@edventurepark.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team-password">Password</Label>
                  <Input
                    id="team-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login as Team Member'}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Demo: team@test.com / password123
                </p>
              </form>
            </TabsContent>
            <TabsContent value="campus_lead">
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit('campus_lead'); }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="lead-email">Email</Label>
                  <Input
                    id="lead-email"
                    type="email"
                    placeholder="lead@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lead-password">Password</Label>
                  <Input
                    id="lead-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-lime-600 hover:bg-lime-700">
                  Login as Campus Lead
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
