import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import logo from 'figma:asset/7478fe69abd5cd9165952273744ef577566140ca.png';

interface LoginPageProps {
  onLogin: (role: 'team' | 'campus_lead') => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (role: 'team' | 'campus_lead') => {
    // Mock authentication - in production, this would validate credentials
    if (email && password) {
      onLogin(role);
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
                <div className="space-y-2">
                  <Label htmlFor="team-email">Email</Label>
                  <Input
                    id="team-email"
                    type="email"
                    placeholder="team@edventurepark.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                  />
                </div>
                <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700">
                  Login as Team Member
                </Button>
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
