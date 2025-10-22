import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Channel {
  id: number;
  name: string;
  type: 'team' | 'campus_leads' | 'general';
  unread: number;
  lastMessage: string;
}

interface ManageChannelsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channels: Channel[];
  onUpdate: (channels: Channel[]) => void;
}

export function ManageChannelsDialog({ open, onOpenChange, channels, onUpdate }: ManageChannelsDialogProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelType, setNewChannelType] = useState<'team' | 'campus_leads' | 'general'>('general');

  const handleRename = (channel: Channel) => {
    setEditingId(channel.id);
    setEditName(channel.name);
  };

  const saveRename = () => {
    if (editingId && editName.trim()) {
      const updatedChannels = channels.map(ch =>
        ch.id === editingId ? { ...ch, name: editName.trim() } : ch
      );
      onUpdate(updatedChannels);
      setEditingId(null);
      setEditName('');
    }
  };

  const handleDelete = (channelId: number) => {
    if (confirm('Are you sure you want to delete this channel?')) {
      const updatedChannels = channels.filter(ch => ch.id !== channelId);
      onUpdate(updatedChannels);
    }
  };

  const handleAddChannel = () => {
    if (newChannelName.trim()) {
      const newChannel: Channel = {
        id: Date.now(),
        name: newChannelName.trim(),
        type: newChannelType,
        unread: 0,
        lastMessage: 'Channel created',
      };
      onUpdate([...channels, newChannel]);
      setNewChannelName('');
      setNewChannelType('general');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Channels</DialogTitle>
          <DialogDescription>Add, rename, or delete chat channels</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add New Channel */}
          <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-sm">Add New Channel</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="channelName">Channel Name</Label>
                <Input
                  id="channelName"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  placeholder="e.g., Campus Leads - Karnataka"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="channelType">Type</Label>
                <Select value={newChannelType} onValueChange={(value: any) => setNewChannelType(value)}>
                  <SelectTrigger id="channelType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="campus_leads">Campus Leads</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleAddChannel} className="w-full bg-cyan-600 hover:bg-cyan-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Channel
            </Button>
          </div>

          {/* Existing Channels */}
          <div className="space-y-3">
            <h3 className="text-sm">Existing Channels ({channels.length})</h3>
            <div className="space-y-2">
              {channels.map((channel) => (
                <div
                  key={channel.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
                >
                  {editingId === channel.id ? (
                    <>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1"
                        autoFocus
                        onKeyPress={(e) => e.key === 'Enter' && saveRename()}
                      />
                      <Button size="sm" onClick={saveRename}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1">
                        <p>{channel.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {channel.type === 'team' ? 'Team' : channel.type === 'campus_leads' ? 'Campus Leads' : 'General'}
                          </Badge>
                          <span className="text-xs text-gray-500">{channel.lastMessage}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRename(channel)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(channel.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
