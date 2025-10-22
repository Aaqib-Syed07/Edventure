import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Edit2, Trash2, Plus } from 'lucide-react';

interface StatTile {
  label: string;
  value: string;
  icon: string;
  color: string;
}

interface ManageStatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stats: StatTile[];
  onUpdate: (stats: StatTile[]) => void;
}

const iconOptions = [
  { value: 'Users', label: 'Users' },
  { value: 'TrendingUp', label: 'Trending Up' },
  { value: 'Target', label: 'Target' },
  { value: 'Award', label: 'Award' },
  { value: 'Calendar', label: 'Calendar' },
  { value: 'MapPin', label: 'Map Pin' },
  { value: 'Building', label: 'Building' },
  { value: 'Star', label: 'Star' },
];

const colorOptions = [
  { value: 'text-cyan-600', label: 'Cyan' },
  { value: 'text-lime-600', label: 'Lime' },
  { value: 'text-purple-600', label: 'Purple' },
  { value: 'text-orange-600', label: 'Orange' },
  { value: 'text-pink-600', label: 'Pink' },
  { value: 'text-blue-600', label: 'Blue' },
];

export function ManageStatsDialog({ open, onOpenChange, stats, onUpdate }: ManageStatsDialogProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<StatTile | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newStat, setNewStat] = useState<StatTile>({
    label: '',
    value: '',
    icon: 'Users',
    color: 'text-cyan-600',
  });

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditData({ ...stats[index] });
  };

  const saveEdit = () => {
    if (editingIndex !== null && editData) {
      const updatedStats = [...stats];
      updatedStats[editingIndex] = editData;
      onUpdate(updatedStats);
      setEditingIndex(null);
      setEditData(null);
    }
  };

  const handleDelete = (index: number) => {
    if (confirm('Are you sure you want to delete this stat tile?')) {
      const updatedStats = stats.filter((_, i) => i !== index);
      onUpdate(updatedStats);
    }
  };

  const handleAdd = () => {
    if (newStat.label.trim() && newStat.value.trim()) {
      onUpdate([...stats, newStat]);
      setNewStat({
        label: '',
        value: '',
        icon: 'Users',
        color: 'text-cyan-600',
      });
      setIsAdding(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Statistics Tiles</DialogTitle>
          <DialogDescription>Add, edit, or remove statistics tiles</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add New Stat */}
          {!isAdding ? (
            <Button onClick={() => setIsAdding(true)} className="w-full" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add New Stat Tile
            </Button>
          ) : (
            <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
              <h3 className="text-sm">Add New Stat</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="newLabel">Label</Label>
                  <Input
                    id="newLabel"
                    value={newStat.label}
                    onChange={(e) => setNewStat({ ...newStat, label: e.target.value })}
                    placeholder="e.g., Total Participants"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newValue">Value</Label>
                  <Input
                    id="newValue"
                    value={newStat.value}
                    onChange={(e) => setNewStat({ ...newStat, value: e.target.value })}
                    placeholder="e.g., 105"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newIcon">Icon</Label>
                  <select
                    id="newIcon"
                    value={newStat.icon}
                    onChange={(e) => setNewStat({ ...newStat, icon: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    {iconOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newColor">Color</Label>
                  <select
                    id="newColor"
                    value={newStat.color}
                    onChange={(e) => setNewStat({ ...newStat, color: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    {colorOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAdd} className="flex-1 bg-cyan-600 hover:bg-cyan-700">
                  Add Stat
                </Button>
                <Button onClick={() => setIsAdding(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Existing Stats */}
          <div className="space-y-3">
            <h3 className="text-sm">Current Statistics ({stats.length})</h3>
            <div className="space-y-2">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
                >
                  {editingIndex === index && editData ? (
                    <div className="flex-1 grid grid-cols-4 gap-2">
                      <Input
                        value={editData.label}
                        onChange={(e) => setEditData({ ...editData, label: e.target.value })}
                        placeholder="Label"
                      />
                      <Input
                        value={editData.value}
                        onChange={(e) => setEditData({ ...editData, value: e.target.value })}
                        placeholder="Value"
                      />
                      <select
                        value={editData.icon}
                        onChange={(e) => setEditData({ ...editData, icon: e.target.value })}
                        className="p-2 border rounded-md"
                      >
                        {iconOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <select
                        value={editData.color}
                        onChange={(e) => setEditData({ ...editData, color: e.target.value })}
                        className="p-2 border rounded-md"
                      >
                        {colorOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <div className="col-span-4 flex gap-2">
                        <Button size="sm" onClick={saveEdit} className="flex-1">
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingIndex(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1">
                        <p>{stat.label}: <strong>{stat.value}</strong></p>
                        <p className="text-xs text-gray-500">Icon: {stat.icon} • Color: {stat.color}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(index)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(index)}
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
