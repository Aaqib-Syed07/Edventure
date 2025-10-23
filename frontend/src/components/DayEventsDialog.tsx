import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Calendar, Clock, MapPin, Users, Edit2, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { AddEventDialog } from './AddEventDialog';

interface CalendarEvent {
  id: number;
  title: string;
  program: string;
  date: string;
  time?: string;
  description?: string;
  color: string;
  textColor?: string;
  visibility?: string;
  location?: string;
  attendees?: number;
}

interface DayEventsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date | null;
  events: CalendarEvent[];
  userRole: 'team' | 'campus_lead';
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: number) => void;
}

export function DayEventsDialog({ open, onOpenChange, date, events, userRole, onEditEvent, onDeleteEvent }: DayEventsDialogProps) {
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  if (!date) return null;

  const dateString = date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const handleEdit = (event: CalendarEvent) => {
    setEditingEvent(event);
    setShowEditDialog(true);
  };

  const handleDelete = (eventId: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      onDeleteEvent(eventId);
    }
  };

  const handleUpdateEvent = (updatedEvent: any) => {
    onEditEvent(updatedEvent);
    setEditingEvent(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {dateString}
            </DialogTitle>
            <DialogDescription>
              {events.length === 0 ? 'No events scheduled' : `${events.length} event${events.length > 1 ? 's' : ''} scheduled`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {events.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No events or sessions scheduled for this day</p>
              </div>
            ) : (
              events.map((event) => (
                <Card key={event.id} className={`${event.color} border-2`}>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`text-lg ${event.textColor || 'text-black'}`}>
                            {event.title}
                          </h3>
                          {event.program && (
                            <p className={`text-sm ${event.textColor || 'text-black'} opacity-80`}>
                              {event.program}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {event.time && (
                            <Badge variant="outline" className="bg-white">
                              <Clock className="h-3 w-3 mr-1" />
                              {event.time}
                            </Badge>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(event)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(event.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {event.description && (
                        <p className={`text-sm ${event.textColor || 'text-black'} opacity-90`}>
                          {event.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm">
                        {event.location && (
                          <div className={`flex items-center gap-1 ${event.textColor || 'text-black'} opacity-80`}>
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        {event.attendees && (
                          <div className={`flex items-center gap-1 ${event.textColor || 'text-black'} opacity-80`}>
                            <Users className="h-4 w-4" />
                            <span>{event.attendees} attendees</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {editingEvent && (
        <AddEventDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onAdd={handleUpdateEvent}
          userRole={userRole}
          editingEvent={editingEvent}
        />
      )}
    </>
  );
}