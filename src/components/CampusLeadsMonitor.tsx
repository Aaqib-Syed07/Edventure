import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { MapPin, Users, Calendar, TrendingUp, Plus, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { AddCampusLeadDialog } from './AddCampusLeadDialog';
import { ManageStatsDialog } from './ManageStatsDialog';

interface CampusLeadsMonitorProps {
  userRole: 'team' | 'campus_lead';
}

const campusLeads = [
  {
    id: 1,
    name: 'Priya Sharma',
    college: 'MS Degree College',
    location: 'Hyderabad, Telangana',
    status: 'Active',
    eventsOrganized: 12,
    studentsReached: 245,
    lastActivity: '2 hours ago',
    performance: 'Excellent',
  },
  {
    id: 2,
    name: 'Rahul Verma',
    college: 'IIT Bombay',
    location: 'Mumbai, Maharashtra',
    status: 'Active',
    eventsOrganized: 18,
    studentsReached: 320,
    lastActivity: '5 hours ago',
    performance: 'Excellent',
  },
  {
    id: 3,
    name: 'Ananya Reddy',
    college: 'NIT Warangal',
    location: 'Warangal, Telangana',
    status: 'Active',
    eventsOrganized: 9,
    studentsReached: 180,
    lastActivity: '1 day ago',
    performance: 'Good',
  },
  {
    id: 4,
    name: 'Karthik Menon',
    college: 'VIT Chennai',
    location: 'Chennai, Tamil Nadu',
    status: 'Active',
    eventsOrganized: 15,
    studentsReached: 290,
    lastActivity: '3 hours ago',
    performance: 'Excellent',
  },
  {
    id: 5,
    name: 'Sneha Patel',
    college: 'BITS Pilani',
    location: 'Pilani, Rajasthan',
    status: 'Inactive',
    eventsOrganized: 6,
    studentsReached: 125,
    lastActivity: '1 week ago',
    performance: 'Average',
  },
];

const locationStats = [
  { location: 'Telangana', leads: 15, colleges: 12, students: 890 },
  { location: 'Maharashtra', leads: 12, colleges: 10, students: 756 },
  { location: 'Tamil Nadu', leads: 10, colleges: 8, students: 645 },
  { location: 'Karnataka', leads: 8, colleges: 7, students: 523 },
];

const statsConfig = [
  { label: 'Telangana', value: '15 leads', icon: 'MapPin', color: 'text-cyan-600' },
  { label: 'Maharashtra', value: '12 leads', icon: 'MapPin', color: 'text-lime-600' },
  { label: 'Tamil Nadu', value: '10 leads', icon: 'MapPin', color: 'text-purple-600' },
  { label: 'Karnataka', value: '8 leads', icon: 'MapPin', color: 'text-orange-600' },
];

const iconMap: any = {
  MapPin,
  Users,
  Calendar,
  TrendingUp,
};

export function CampusLeadsMonitor({ userRole }: CampusLeadsMonitorProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [leadsList, setLeadsList] = useState(campusLeads);
  const [showManageStats, setShowManageStats] = useState(false);
  const [statsList, setStatsList] = useState(statsConfig);

  const handleAddLead = (newLead: any) => {
    setLeadsList([...leadsList, newLead]);
  };

  const handleUpdateStats = (updatedStats: any) => {
    setStatsList(updatedStats);
  };

  // Campus leads only see their own profile
  const currentLead = campusLeads[0]; // Mock: first lead as current user

  if (userRole === 'campus_lead') {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
            <CardDescription>Your campus lead information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-lime-100 text-lime-700 text-xl">
                  {currentLead.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl">{currentLead.name}</h3>
                <p className="text-sm text-gray-600">{currentLead.college}</p>
                <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                  <MapPin className="h-3 w-3" />
                  {currentLead.location}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Events Organized</p>
                      <p className="mt-2">{currentLead.eventsOrganized}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-cyan-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Students Reached</p>
                      <p className="mt-2">{currentLead.studentsReached}</p>
                    </div>
                    <Users className="h-8 w-8 text-lime-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Performance</p>
                      <p className="mt-2">{currentLead.performance}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Badge className="bg-lime-600">{currentLead.status}</Badge>
              <p className="text-sm text-gray-600 mt-2">Last activity: {currentLead.lastActivity}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Location Overview */}
      {userRole === 'team' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm text-gray-600">Location Statistics</h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowManageStats(true)}
              title="Manage Statistics"
            >
              <Settings className="h-4 w-4 mr-2" />
              Manage
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsList.map((stat) => {
              const IconComponent = iconMap[stat.icon] || MapPin;
              return (
                <Card key={stat.label}>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <IconComponent className={`h-4 w-4 ${stat.color}`} />
                        <p>{stat.label}</p>
                      </div>
                      <p className="text-sm">{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Campus Leads Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Campus Leads Overview</CardTitle>
              <CardDescription>Monitor campus leads across various colleges and locations</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setShowManageStats(true)} className="bg-gray-600 hover:bg-gray-700">
                <Settings className="h-4 w-4 mr-2" />
                Manage Stats
              </Button>
              <Button onClick={() => setShowAddDialog(true)} className="bg-lime-600 hover:bg-lime-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Campus Lead
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">S.No</TableHead>
                <TableHead>Lead</TableHead>
                <TableHead>College & Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Events</TableHead>
                <TableHead>Students Reached</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Last Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leadsList.map((lead, index) => (
                <TableRow key={lead.id}>
                  <TableCell className="text-gray-600">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-cyan-100 text-cyan-700">
                          {lead.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span>{lead.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{lead.college}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {lead.location}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={lead.status === 'Active' ? 'default' : 'secondary'}
                      className={lead.status === 'Active' ? 'bg-lime-600' : ''}
                    >
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      {lead.eventsOrganized}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-600" />
                      {lead.studentsReached}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TrendingUp className={`h-4 w-4 ${
                        lead.performance === 'Excellent' ? 'text-green-600' :
                        lead.performance === 'Good' ? 'text-blue-600' : 'text-yellow-600'
                      }`} />
                      <span className="text-sm">{lead.performance}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {lead.lastActivity}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddCampusLeadDialog open={showAddDialog} onOpenChange={setShowAddDialog} onAdd={handleAddLead} />
      {userRole === 'team' && (
        <ManageStatsDialog
          open={showManageStats}
          onOpenChange={setShowManageStats}
          stats={statsList}
          onUpdate={handleUpdateStats}
        />
      )}
    </div>
  );
}