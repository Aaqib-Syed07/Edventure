import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CheckCircle2, Circle, Mail, Phone, Calendar, ArrowLeft, Building2 } from 'lucide-react';
import { Button } from './ui/button';

interface Participant {
  id: number;
  name: string;
  email: string;
  phone: string;
  college: string;
  companyIdea: string;
  status: 'Active' | 'Inactive' | 'Completed';
  progress: number;
  joinedDate: string;
  lastActivity: string;
  milestonesCompleted: number;
}

interface CohortDetailViewProps {
  cohort: {
    id: number;
    name: string;
    program: string;
    status: string;
    startDate: string;
    endDate: string;
    participants: number;
    progress: number;
    milestones: string[];
    completedMilestones: number;
    description?: string;
  };
  onBack: () => void;
}

// Mock participant data
const generateParticipants = (count: number, cohortId: number): Participant[] => {
  const colleges = ['IIT Bombay', 'NIT Warangal', 'MS Degree College', 'VIT Chennai', 'BITS Pilani'];
  const statuses: ('Active' | 'Inactive' | 'Completed')[] = ['Active', 'Active', 'Active', 'Inactive', 'Completed'];
  const ideas = [
    'AI-powered Learning Platform',
    'Sustainable Fashion Marketplace',
    'Health Monitoring App',
    'AgriTech Solutions',
    'EdTech for Rural Areas',
    'Smart Waste Management',
    'FinTech for Students',
    'Mental Health Support App',
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    id: cohortId * 100 + i,
    name: `Student ${i + 1}`,
    email: `student${i + 1}@college.edu`,
    phone: `+91 98765 ${43210 + i}`,
    college: colleges[i % colleges.length],
    companyIdea: ideas[i % ideas.length],
    status: statuses[i % statuses.length],
    progress: Math.floor(Math.random() * 100),
    joinedDate: new Date(2025, 0, 15 + i).toISOString().split('T')[0],
    lastActivity: i % 3 === 0 ? '2 hours ago' : i % 3 === 1 ? '1 day ago' : '3 days ago',
    milestonesCompleted: Math.floor(Math.random() * 4),
  }));
};

export function CohortDetailView({ cohort, onBack }: CohortDetailViewProps) {
  const participants = generateParticipants(cohort.participants, cohort.id);
  const activeParticipants = participants.filter(p => p.status === 'Active').length;
  const completedParticipants = participants.filter(p => p.status === 'Completed').length;

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cohorts
        </Button>
        <div className="flex-1 flex items-start justify-between">
          <div>
            <h1 className="text-3xl text-gray-900">{cohort.name}</h1>
            <p className="text-gray-600">{cohort.program}</p>
          </div>
          <Badge
            variant={cohort.status === 'Active' ? 'default' : 'secondary'}
            className={cohort.status === 'Active' ? 'bg-lime-600 text-lg px-4 py-2' : 'text-lg px-4 py-2'}
          >
            {cohort.status}
          </Badge>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Total Participants</p>
              <p className="text-2xl">{cohort.participants}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl text-lime-600">{activeParticipants}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl text-green-600">{completedParticipants}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Overall Progress</p>
              <p className="text-2xl">{cohort.progress}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Duration and Progress */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4" />
                {new Date(cohort.startDate).toLocaleDateString()} - {new Date(cohort.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Cohort Progress</p>
              <p className="text-sm">{cohort.progress}%</p>
            </div>
            <Progress value={cohort.progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card>
        <CardHeader>
          <CardTitle>Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {cohort.milestones.map((milestone, index) => (
              <div
                key={milestone}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  index < cohort.completedMilestones ? 'bg-cyan-50 border-cyan-200' : 'bg-gray-50'
                }`}
              >
                {index < cohort.completedMilestones ? (
                  <CheckCircle2 className="h-5 w-5 text-cyan-600 flex-shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm">{milestone}</p>
                  <p className="text-xs text-gray-600">
                    {index < cohort.completedMilestones ? 'Completed' : 'Pending'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Participants Table */}
      <Card>
        <CardHeader>
          <CardTitle>Participants</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Participants ({participants.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({activeParticipants})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedParticipants})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">S.No</TableHead>
                      <TableHead>Participant</TableHead>
                      <TableHead>Company/Idea</TableHead>
                      <TableHead>College</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Milestones</TableHead>
                      <TableHead>Last Activity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.map((participant, index) => (
                      <TableRow key={participant.id}>
                        <TableCell className="text-gray-600">{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-cyan-100 text-cyan-700">
                                {participant.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span>{participant.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{participant.companyIdea}</span>
                          </div>
                        </TableCell>
                        <TableCell>{participant.college}</TableCell>
                        <TableCell>
                          <div className="text-sm space-y-1">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-gray-500" />
                              <span className="text-xs">{participant.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-gray-500" />
                              <span className="text-xs">{participant.phone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={participant.status === 'Active' ? 'default' : 'secondary'}
                            className={
                              participant.status === 'Active' ? 'bg-lime-600' :
                              participant.status === 'Completed' ? 'bg-green-600' : ''
                            }
                          >
                            {participant.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Progress value={participant.progress} className="h-1 w-20" />
                              <span className="text-xs">{participant.progress}%</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{participant.milestonesCompleted} / {cohort.milestones.length}</span>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {participant.lastActivity}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="active" className="mt-4">
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">S.No</TableHead>
                      <TableHead>Participant</TableHead>
                      <TableHead>Company/Idea</TableHead>
                      <TableHead>College</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Milestones</TableHead>
                      <TableHead>Last Activity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.filter(p => p.status === 'Active').map((participant, index) => (
                      <TableRow key={participant.id}>
                        <TableCell className="text-gray-600">{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-cyan-100 text-cyan-700">
                                {participant.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span>{participant.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{participant.companyIdea}</span>
                          </div>
                        </TableCell>
                        <TableCell>{participant.college}</TableCell>
                        <TableCell>
                          <div className="text-sm space-y-1">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-gray-500" />
                              <span className="text-xs">{participant.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-gray-500" />
                              <span className="text-xs">{participant.phone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Progress value={participant.progress} className="h-1 w-20" />
                              <span className="text-xs">{participant.progress}%</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{participant.milestonesCompleted} / {cohort.milestones.length}</span>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {participant.lastActivity}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="completed" className="mt-4">
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">S.No</TableHead>
                      <TableHead>Participant</TableHead>
                      <TableHead>Company/Idea</TableHead>
                      <TableHead>College</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Completion Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.filter(p => p.status === 'Completed').map((participant, index) => (
                      <TableRow key={participant.id}>
                        <TableCell className="text-gray-600">{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-green-100 text-green-700">
                                {participant.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span>{participant.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{participant.companyIdea}</span>
                          </div>
                        </TableCell>
                        <TableCell>{participant.college}</TableCell>
                        <TableCell>
                          <div className="text-sm space-y-1">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-gray-500" />
                              <span className="text-xs">{participant.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-gray-500" />
                              <span className="text-xs">{participant.phone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-600">
                            100% Complete
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
