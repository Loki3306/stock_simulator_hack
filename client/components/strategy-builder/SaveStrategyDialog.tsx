import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { X } from 'lucide-react';

interface SaveStrategyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    title: string;
    description: string;
    tags: string[];
    privacy: 'private' | 'public' | 'marketplace';
  }) => Promise<void>;
  currentTitle?: string;
  currentDescription?: string;
  currentTags?: string[];
  isUpdating?: boolean;
}

export const SaveStrategyDialog: React.FC<SaveStrategyDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  currentTitle = '',
  currentDescription = '',
  currentTags = [],
  isUpdating = false,
}) => {
  const [title, setTitle] = useState(currentTitle);
  const [description, setDescription] = useState(currentDescription);
  const [tags, setTags] = useState<string[]>(currentTags);
  const [tagInput, setTagInput] = useState('');
  const [privacy, setPrivacy] = useState<'private' | 'public' | 'marketplace'>('private');
  const [saving, setSaving] = useState(false);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      return;
    }

    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        tags,
        privacy,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target === document.querySelector('input[name="tagInput"]')) {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isUpdating ? 'Update Strategy' : 'Save Strategy'}
          </DialogTitle>
          <DialogDescription>
            {isUpdating 
              ? 'Update your strategy details and save changes'
              : 'Give your strategy a name and description to save it'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Strategy Name */}
          <div className="space-y-2">
            <Label htmlFor="title">Strategy Name *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., SMA Crossover Strategy"
              className="w-full"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your strategy..."
              rows={3}
              className="w-full"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                name="tagInput"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add tags (press Enter)"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
              >
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Privacy */}
          <div className="space-y-2">
            <Label>Privacy</Label>
            <div className="flex gap-2">
              {(['private', 'public', 'marketplace'] as const).map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant={privacy === option ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPrivacy(option)}
                  className="capitalize"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title.trim() || saving}
          >
            {saving ? 'Saving...' : (isUpdating ? 'Update' : 'Save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};