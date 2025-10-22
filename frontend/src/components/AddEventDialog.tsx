import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface AddEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (event: any) => void;
  userRole: 'team' | 'campus_lead';
  editingEvent?: any;
}

export function AddEventDialog({ open, onOpenChange, onAdd, userRole, editingEvent }: AddEventDialogProps) {
  const [formData, setFormData] = useState({
    title: editingEvent?.title || '',
    program: editingEvent?.program || '',
    date: editingEvent?.date || '',
    time: editingEvent?.time || '',
    description: editingEvent?.description || '',
    color: editingEvent?.color || 'bg-cyan-400',
    visibility: editingEvent?.visibility || 'everyone',
  });

  const colorOptions = [
    { value: 'bg-cyan-400', label: 'Cyan', class: 'bg-cyan-400' },
    { value: 'bg-lime-400', label: 'Lime', class: 'bg-lime-400' },
    { value: 'bg-pink-300', label: 'Pink', class: 'bg-pink-300' },
    { value: 'bg-purple-400', label: 'Purple', class: 'bg-purple-400' },
    { value: 'bg-yellow-400', label: 'Yellow', class: 'bg-yellow-400' },
    { value: 'bg-orange-400', label: 'Orange', class: 'bg-orange-400' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: editingEvent?.id || Date.now(),
      title: formData.title,
      program: formData.program,
      date: formData.date,
      time: formData.time,
      description: formData.description,
      color: formData.color,
      textColor: 'text-black',
      visibility: formData.visibility,
      createdBy: userRole,
    });
    if (!editingEvent) {
      setFormData({
        title: '',
        program: '',
        date: '',
        time: '',
        description: '',
        color: 'bg-cyan-400',
        visibility: 'everyone',
      });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingEvent ? 'Edit Event' : 'Add Calendar Event'}</DialogTitle>
          <DialogDescription>{editingEvent ? 'Update event details' : 'Create a new event or session'}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Pitch Workshop"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="program">Program/Category</Label>
            <Input
              id="program"
              value={formData.program}
              onChange={(e) => setFormData({ ...formData, program: e.target.value })}
              placeholder="e.g., EdAstra, EVP A25"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Event details..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Event Color</Label>
            <div className="grid grid-cols-6 gap-2">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: option.value })}
                  className={`h-10 rounded-md ${option.class} border-2 ${
                    formData.color === option.value ? 'border-gray-900' : 'border-gray-300'
                  }`}
                  title={option.label}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Visibility</Label>
            <RadioGroup value={formData.visibility} onValueChange={(value) => setFormData({ ...formData, visibility: value })}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="everyone" id="everyone" />
                <Label htmlFor="everyone" className="cursor-pointer">
                  Everyone - Visible to all team members and campus leads
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="team" id="team" />
                <Label htmlFor="team" className="cursor-pointer">
                  Team Only - Visible only to EdVenture Park team
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private" className="cursor-pointer">
                  Private - Visible only to you
                </Label>
              </div>
            </RadioGroup>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700">
              {editingEvent ? 'Update Event' : 'Add Event'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}