import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Users, TrendingUp, Target, Award, Plus, Settings, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { AddCohortDialog } from './AddCohortDialog';
import { CohortDetailView } from './CohortDetailView';
import { ManageStatsDialog } from './ManageStatsDialog';
import { api } from '../services/api';

interface CohortDashboardProps {
  userRole: 'team' | 'campus_lead';
}

const iconMap: any = {
  Users,
  TrendingUp,
  Target,
  Award,
  MapPin,
};

export function CohortDashboard({ userRole }: CohortDashboardProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [cohortsList, setCohortsList] = useState<any[]>([]);
  const [selectedCohort, setSelectedCohort] = useState<any | null>(null);
  const [statsList, setStatsList] = useState<any[]>([]);
  const [showManageStats, setShowManageStats] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingCohorts, setIsLoadingCohorts] = useState(true);

  // Fetch stats on component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoadingStats(true);
        const stats = await api.getStats('cohort');
        setStatsList(stats);
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Set default stats on error
        setStatsList([
          { id: 'c1', label: 'Total Participants', value: '105', icon: 'Users', color: 'text-cyan-600' },
          { id: 'c2', label: 'Active Cohorts', value: '3', icon: 'TrendingUp', color: 'text-lime-600' },
          { id: 'c3', label: 'Completion Rate', value: '78%', icon: 'Target', color: 'text-purple-600' },
          { id: 'c4', label: 'Success Stories', value: '24', icon: 'Award', color: 'text-orange-600' },
        ]);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  // Fetch cohorts on component mount
  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        setIsLoadingCohorts(true);
        const cohorts = await api.getCohorts();
        setCohortsList(cohorts);
      } catch (error) {
        console.error('Error fetching cohorts:', error);
        // Set default cohorts on error
        setCohortsList([
          {
            id: '1',
            name: 'EVP A25',
            program: 'Pre-Incubation',
            status: 'Active',
            start_date: '2025-01-15',
            end_date: '2025-04-30',
            participants: 45,
            progress: 65,
            milestones: ['Ideation', 'Prototyping', 'Market Research', 'Pitch Preparation'],
            completed_milestones: 2,
          },
          {
            id: '2',
            name: 'EdAstra Batch 6',
            program: 'Innovation Challenge',
            status: 'Active',
            start_date: '2025-02-01',
            end_date: '2025-05-15',
            participants: 32,
            progress: 40,
            milestones: ['Team Formation', 'Problem Identification', 'Solution Design', 'Demo Day'],
            completed_milestones: 1,
          },
          {
            id: '3',
            name: 'Tentative Sprint',
            program: 'Advanced Incubation',
            status: 'Planning',
            start_date: '2025-03-01',
            end_date: '2025-06-30',
            participants: 28,
            progress: 15,
            milestones: ['Onboarding', 'Mentor Matching', 'Development', 'Launch'],
            completed_milestones: 0,
          },
        ]);
      } finally {
        setIsLoadingCohorts(false);
      }
    };

    fetchCohorts();
  }, []);

  const handleAddCohort = async (newCohort: any) => {
    try {
      const createdCohort = await api.createCohort(newCohort);
      setCohortsList([...cohortsList, createdCohort]);
    } catch (error) {
      console.error('Error creating cohort:', error);
      // Still add to local state as fallback
      setCohortsList([...cohortsList, newCohort]);
    }
  };

  const handleUpdateStats = async (updatedStats: any) => {
    try {
      const updated = await api.updateStats('cohort', updatedStats);
      setStatsList(updated);
    } catch (error) {
      console.error('Error updating stats:', error);
      // Still update local state as fallback
      setStatsList(updatedStats);
    }
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
            data-testid="manage-stats-button"
          >
            <Settings className="h-4 w-4 mr-2" />
            Manage
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoadingStats ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <Card key={idx}>
                <CardContent className="pt-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            statsList.map((stat) => {
              const IconComponent = iconMap[stat.icon] || Users;
              return (
                <Card key={stat.id} data-testid={`stat-card-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className="mt-2 text-2xl font-bold" data-testid={`stat-value-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>{stat.value}</p>
                      </div>
                      <IconComponent className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Cohorts List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Pre-Incubation Cohorts</h2>
          <Button 
            onClick={() => setShowAddDialog(true)} 
            className="bg-cyan-600 hover:bg-cyan-700"
            data-testid="add-cohort-button"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Cohort
          </Button>
        </div>
        {isLoadingCohorts ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <Card key={idx}>
              <CardHeader>
                <div className="animate-pulse space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-2 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          cohortsList.map((cohort) => (
            <Card 
              key={cohort.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedCohort(cohort)}
              data-testid={`cohort-card-${cohort.id}`}
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
                  <span data-testid={`cohort-participants-${cohort.id}`}>{cohort.participants} students</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span data-testid={`cohort-progress-${cohort.id}`}>{cohort.progress}%</span>
                </div>
                <Progress value={cohort.progress} className="h-2" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Milestones</span>
                  <span>{cohort.completed_milestones} / {cohort.milestones.length} completed</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
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