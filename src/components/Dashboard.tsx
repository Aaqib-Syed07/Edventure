import { useState } from 'react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { CohortDashboard } from './CohortDashboard';
import { CampusLeadsMonitor } from './CampusLeadsMonitor';
import { CalendarView } from './CalendarView';
import { ChatSection } from './ChatSection';
import { ProfileView } from './ProfileView';
import { LayoutDashboard, Users, Calendar, MessageSquare, LogOut, User } from 'lucide-react';
import logo from 'figma:asset/f5ec81e34b10f29b7e03074165f630e8baac57b7.png';

interface DashboardProps {
  userRole: 'team' | 'campus_lead';
  onLogout: () => void;
}

export function Dashboard({ userRole, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState(userRole === 'campus_lead' ? 'profile' : 'cohorts');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="EdVenture Park" className="h-12" />
            <div>
              <h1 className="text-gray-900">EdVenture Park Community</h1>
              <p className="text-gray-600 text-sm">
                {userRole === 'team' ? 'Team Dashboard' : 'Campus Lead Dashboard'}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full max-w-4xl mx-auto ${userRole === 'team' ? 'grid-cols-5' : 'grid-cols-4'}`}>
            {userRole === 'team' && (
              <TabsTrigger value="cohorts" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Cohorts
              </TabsTrigger>
            )}
            <TabsTrigger value="leads" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {userRole === 'team' ? 'Campus Leads' : 'My Profile'}
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          {userRole === 'team' && (
            <TabsContent value="cohorts">
              <CohortDashboard userRole={userRole} />
            </TabsContent>
          )}

          <TabsContent value="leads">
            <CampusLeadsMonitor userRole={userRole} />
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarView userRole={userRole} />
          </TabsContent>

          <TabsContent value="chat">
            <ChatSection userRole={userRole} />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileView userRole={userRole} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}