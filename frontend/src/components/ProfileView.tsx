import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Edit, Mail, Phone, MapPin, Calendar, Briefcase, Award } from 'lucide-react';
import { EditProfileDialog } from './EditProfileDialog';

interface ProfileViewProps {
  userRole: 'team' | 'campus_lead';
}

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  role: string;
  location: string;
  joinedDate: string;
  bio: string;
  skills: string[];
  college?: string;
  department?: string;
  achievements?: string[];
}

const mockTeamProfile: ProfileData = {
  name: 'Sarah Johnson',
  email: 'sarah.johnson@edventurepark.com',
  phone: '+91 98765 43210',
  role: 'Program Manager',
  location: 'Hyderabad, Telangana',
  joinedDate: '2023-05-15',
  bio: 'Passionate about fostering innovation and entrepreneurship in students. With 5+ years of experience in incubation programs, I help aspiring entrepreneurs turn their ideas into successful ventures.',
  skills: ['Program Management', 'Mentorship', 'Event Planning', 'Community Building', 'Public Speaking', 'Strategic Planning'],
  department: 'Operations',
  achievements: ['Managed 12+ cohorts', 'Mentored 200+ students', 'Organized 50+ events'],
};

const mockCampusLeadProfile: ProfileData = {
  name: 'Priya Sharma',
  email: 'priya.sharma@college.edu',
  phone: '+91 98765 12345',
  role: 'Campus Lead',
  location: 'Hyderabad, Telangana',
  college: 'MS Degree College',
  joinedDate: '2024-08-20',
  bio: 'Computer Science student passionate about building a vibrant startup ecosystem on campus. Leading initiatives to connect students with entrepreneurship opportunities.',
  skills: ['Event Management', 'Social Media Marketing', 'Student Engagement', 'Public Relations', 'Content Creation'],
  achievements: ['Organized 12 events', 'Reached 245 students', 'Built active community of 100+ members'],
};

export function ProfileView({ userRole }: ProfileViewProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [profile, setProfile] = useState<ProfileData>(
    userRole === 'team' ? mockTeamProfile : mockCampusLeadProfile
  );

  const handleProfileUpdate = (updatedProfile: ProfileData) => {
    setProfile(updatedProfile);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle>My Profile</CardTitle>
            <Button onClick={() => setShowEditDialog(true)} className="bg-cyan-600 hover:bg-cyan-700">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center gap-3">
              <Avatar className="h-32 w-32">
                <AvatarFallback className={`text-2xl ${userRole === 'team' ? 'bg-cyan-100 text-cyan-700' : 'bg-lime-100 text-lime-700'}`}>
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Badge className={userRole === 'team' ? 'bg-cyan-600' : 'bg-lime-600'}>
                {profile.role}
              </Badge>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl text-gray-900">{profile.name}</h2>
                {profile.college && (
                  <p className="text-gray-600">{profile.college}</p>
                )}
                {profile.department && (
                  <p className="text-gray-600">{profile.department}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{profile.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Joined {new Date(profile.joinedDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bio Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            About
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
        </CardContent>
      </Card>

      {/* Skills Section */}
      <Card>
        <CardHeader>
          <CardTitle>Skills & Expertise</CardTitle>
          <CardDescription>Areas of competency and specialization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <Badge key={skill} variant="outline" className="px-3 py-1">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements Section */}
      {profile.achievements && profile.achievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {profile.achievements.map((achievement, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-cyan-600 mt-2" />
                  <span className="text-gray-700">{achievement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <EditProfileDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        profile={profile}
        userRole={userRole}
        onUpdate={handleProfileUpdate}
      />
    </div>
  );
}
