import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ChevronLeft, ChevronRight, Plus, Edit } from 'lucide-react';
import { Button } from './ui/button';
import { AddEventDialog } from './AddEventDialog';
import { DayEventsDialog } from './DayEventsDialog';

interface CalendarViewProps {
  userRole: 'team' | 'campus_lead';
}

interface CalendarEvent {
  id: number;
  title: string;
  program: string;
  date: string;
  color: string;
  textColor?: string;
  visibility?: string;
  createdBy?: string;
  time?: string;
  description?: string;
  location?: string;
  attendees?: number;
  span?: number;
}

const events: CalendarEvent[] = [
  { id: 1, title: 'Pitch Workshop', program: 'EdAstra', date: '2025-10-18', color: 'bg-lime-400', textColor: 'text-black', visibility: 'everyone', time: '10:00 AM', description: 'Learn how to create compelling pitch decks', location: 'Main Hall', attendees: 45 },
  { id: 2, title: 'Prelim Interviews', program: 'EVP A25', date: '2025-10-18', color: 'bg-cyan-400', textColor: 'text-black', visibility: 'everyone', time: '2:00 PM', description: 'Initial screening interviews for cohort selection', attendees: 30 },
  { id: 3, title: 'Pitch Workshop', program: 'EdAstra', date: '2025-10-19', color: 'bg-lime-400', textColor: 'text-black', visibility: 'everyone', time: '10:00 AM', location: 'Seminar Room', attendees: 40 },
  { id: 4, title: 'Info Session', program: 'MS Degree College', date: '2025-10-21', color: 'bg-pink-300', textColor: 'text-black', visibility: 'everyone', time: '11:00 AM', description: 'Introduction to pre-incubation program', location: 'MS Degree College', attendees: 60 },
  { id: 5, title: 'Info Session', program: 'MS Degree College', date: '2025-10-22', color: 'bg-pink-300', textColor: 'text-black', visibility: 'everyone', time: '11:00 AM', location: 'MS Degree College', attendees: 55 },
  { id: 6, title: 'Info Session', program: 'MS Degree College', date: '2025-10-23', color: 'bg-pink-300', textColor: 'text-black', visibility: 'everyone', time: '11:00 AM', location: 'MS Degree College', attendees: 50 },
  { id: 7, title: 'Main interviews - EVP A25', program: '', date: '2025-10-21', color: 'bg-cyan-500', textColor: 'text-white', span: 3, visibility: 'team', time: '9:00 AM', description: 'Final round interviews for cohort selection', attendees: 40 },
  { id: 8, title: 'EdTalk', program: 'Tentative', date: '2025-10-25', color: 'bg-purple-400', textColor: 'text-black', visibility: 'everyone', time: '4:00 PM', description: 'Guest speaker session on entrepreneurship', location: 'Auditorium', attendees: 100 },
  { id: 9, title: 'EVP A25 Cohort Announcement', program: '', date: '2025-10-25', color: 'bg-cyan-400', textColor: 'text-black', visibility: 'everyone', time: '6:00 PM', description: 'Official announcement of selected participants' },
  { id: 10, title: 'Demo Day!!!!!!!', program: 'EdAstra', date: '2025-10-26', color: 'bg-yellow-400', textColor: 'text-black', visibility: 'everyone', time: '2:00 PM', description: 'Final presentations and pitches', location: 'Main Auditorium', attendees: 150 },
];

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export function CalendarView({ userRole }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 1)); // October 2025
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [eventsList, setEventsList] = useState(events);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDayDialog, setShowDayDialog] = useState(false);

  const handleAddEvent = (newEvent: any) => {
    setEventsList([...eventsList, newEvent]);
  };

  const handleEditEvent = (updatedEvent: any) => {
    setEventsList(eventsList.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  };

  const handleDeleteEvent = (eventId: number) => {
    setEventsList(eventsList.filter(event => event.id !== eventId));
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];
    
    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevMonthDate = new Date(year, month, -i);
      days.unshift(prevMonthDate.getDate());
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const getEventsForDate = (day: number | null) => {
    if (!day) return [];
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return eventsList.filter(event => {
      const eventDate = event.date;
      if (eventDate !== dateStr) return false;
      
      // Filter based on visibility
      if (event.visibility === 'everyone') return true;
      if (event.visibility === 'team' && userRole === 'team') return true;
      if (event.visibility === 'private' && event.createdBy === userRole) return true;
      
      return false;
    });
  };

  const handleDayClick = (day: number | null) => {
    if (!day) return;
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    setShowDayDialog(true);
  };

  const selectedDayEvents = selectedDate ? getEventsForDate(selectedDate.getDate()) : [];

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Upcoming Events & Program Schedule — {monthName}</CardTitle>
              <CardDescription>View and manage program events and schedules</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button onClick={() => setShowAddDialog(true)} className="bg-cyan-600 hover:bg-cyan-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            {/* Calendar Header */}
            <div className="grid grid-cols-7 bg-gray-50 border-b">
              {daysOfWeek.map(day => (
                <div key={day} className="p-4 text-center text-sm text-gray-600">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
              {days.map((day, index) => {
                const dayEvents = getEventsForDate(day);
                const isCurrentMonth = index >= currentDate.getDay();
                const isToday = day === 22 && currentDate.getMonth() === 9; // Highlight Oct 22 (today)

                return (
                  <div
                    key={index}
                    className={`min-h-32 p-2 border-r border-b ${
                      !isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white hover:bg-gray-50'
                    } ${day ? 'cursor-pointer' : ''}`}
                    onClick={() => day && handleDayClick(day)}
                  >
                    <div className={`text-sm mb-2 ${isToday ? 'bg-cyan-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.map(event => (
                        <div
                          key={event.id}
                          className={`${event.color} ${event.textColor || 'text-black'} text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity`}
                        >
                          <div>{event.title}</div>
                          {event.program && <div className="text-xs opacity-90">({event.program})</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Event Legend */}
          <div className="mt-6 space-y-2">
            <p className="text-sm">Event Types:</p>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-lime-400 text-black hover:bg-lime-500">EdAstra Events</Badge>
              <Badge className="bg-cyan-400 text-black hover:bg-cyan-500">EVP A25 Events</Badge>
              <Badge className="bg-pink-300 text-black hover:bg-pink-400">Info Sessions</Badge>
              <Badge className="bg-purple-400 text-black hover:bg-purple-500">EdTalk</Badge>
              <Badge className="bg-yellow-400 text-black hover:bg-yellow-500">Demo Day</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <AddEventDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog} 
        onAdd={handleAddEvent}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        userRole={userRole}
      />

      <DayEventsDialog
        open={showDayDialog}
        onOpenChange={setShowDayDialog}
        date={selectedDate}
        events={selectedDayEvents}
        userRole={userRole}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
      />
    </div>
  );
}