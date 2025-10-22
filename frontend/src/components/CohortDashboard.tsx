import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Users, TrendingUp, Target, Award, Plus, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { AddCohortDialog } from './AddCohortDialog';
import { CohortDetailView } from './CohortDetailView';
import { ManageStatsDialog } from './ManageStatsDialog';

interface CohortDashboardProps {
  userRole: 'team' | 'campus_lead';
}

const cohorts = [
  {
    id: 1,
    name: 'EVP A25',
    program: 'Pre-Incubation',
    status: 'Active',
    startDate: '2025-01-15',
    endDate: '2025-04-30',
    participants: 45,
    progress: 65,
    milestones: ['Ideation', 'Prototyping', 'Market Research', 'Pitch Preparation'],
    completedMilestones: 2,
  },
  {
    id: 2,
    name: 'EdAstra Batch 6',
    program: 'Innovation Challenge',
    status: 'Active',
    startDate: '2025-02-01',
    endDate: '2025-05-15',
    participants: 32,
    progress: 40,
    milestones: ['Team Formation', 'Problem Identification', 'Solution Design', 'Demo Day'],
    completedMilestones: 1,
  },
  {
    id: 3,
    name: 'Tentative Sprint',
    program: 'Advanced Incubation',
    status: 'Planning',
    startDate: '2025-03-01',
    endDate: '2025-06-30',
    participants: 28,
    progress: 15,
    milestones: ['Onboarding', 'Mentor Matching', 'Development', 'Launch'],
    completedMilestones: 0,
  },
];

const stats = [
  { label: 'Total Participants', value: '105', icon: 'Users', color: 'text-cyan-600' },
  { label: 'Active Cohorts', value: '3', icon: 'TrendingUp', color: 'text-lime-600' },
  { label: 'Completion Rate', value: '78%', icon: 'Target', color: 'text-purple-600' },
  { label: 'Success Stories', value: '24', icon: 'Award', color: 'text-orange-600' },
];

const iconMap: any = {
  Users,
  TrendingUp,
  Target,
  Award,
};

export function CohortDashboard({ userRole }: CohortDashboardProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [cohortsList, setCohortsList] = useState(cohorts);
  const [selectedCohort, setSelectedCohort] = useState<typeof cohorts[0] | null>(null);
  const [statsList, setStatsList] = useState(stats);
  const [showManageStats, setShowManageStats] = useState(false);

  const handleAddCohort = (newCohort: any) => {
    setCohortsList([...cohortsList, newCohort]);
  };

  const handleUpdateStats = (updatedStats: any) => {
    setStatsList(updatedStats);
  };

  // If a cohort is selected, show the detail view
  if (selectedCohort) {
    return <CohortDetailView cohort={selectedCohort} onBack={() => setSelectedCohort(null)} />;
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm text-gray-600">Overview Statistics</h3>
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
            const IconComponent = iconMap[stat.icon] || Users;
            return (
              <Card key={stat.label}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="mt-2">{stat.value}</p>
                    </div>
                    <IconComponent className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Cohorts List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-gray-900">Pre-Incubation Cohorts</h2>
          <Button onClick={() => setShowAddDialog(true)} className="bg-cyan-600 hover:bg-cyan-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Cohort
          </Button>
        </div>
        {cohortsList.map((cohort) => (
          <Card 
            key={cohort.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedCohort(cohort)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{cohort.name}</CardTitle>
                  <CardDescription>{cohort.program}</CardDescription>
                </div>
                <Badge
                  variant={cohort.status === 'Active' ? 'default' : 'secondary'}
                  className={cohort.status === 'Active' ? 'bg-lime-600' : ''}
                >
                  {cohort.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Participants</span>
                <span>{cohort.participants} students</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span>{cohort.progress}%</span>
              </div>
              <Progress value={cohort.progress} className="h-2" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Milestones</span>
                <span>{cohort.completedMilestones} / {cohort.milestones.length} completed</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddCohortDialog open={showAddDialog} onOpenChange={setShowAddDialog} onAdd={handleAddCohort} />
      <ManageStatsDialog
        open={showManageStats}
        onOpenChange={setShowManageStats}
        stats={statsList}
        onUpdate={handleUpdateStats}
      />
    </div>
  );
}