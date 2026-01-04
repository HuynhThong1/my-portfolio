'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Briefcase, MapPin, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  description: string;
  technologies: string[];
  order: number;
  visible: boolean;
}

export default function ExperiencePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/experience');
      if (response.ok) {
        const data = await response.json();
        setExperiences(data.experiences || []);
      }
    } catch (error) {
      console.error('Failed to load experiences:', error);
      toast({
        title: 'Error',
        description: 'Failed to load experiences',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (experience: Partial<Experience>) => {
    try {
      const method = editingExperience ? 'PUT' : 'POST';
      const url = editingExperience
        ? `/api/admin/experience/${editingExperience.id}`
        : '/api/admin/experience';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(experience),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Experience ${editingExperience ? 'updated' : 'created'} successfully`,
        });
        setIsDialogOpen(false);
        setEditingExperience(null);
        loadExperiences();
        router.refresh();
      } else {
        throw new Error('Failed to save experience');
      }
    } catch (error) {
      console.error('Failed to save experience:', error);
      toast({
        title: 'Error',
        description: 'Failed to save experience',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;

    try {
      const response = await fetch(`/api/admin/experience/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Experience deleted successfully',
        });
        loadExperiences();
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to delete experience:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete experience',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-muted-foreground">Loading experiences...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Experience</h1>
          <p className="text-muted-foreground">Manage your work experience</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingExperience(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingExperience ? 'Edit Experience' : 'Add New Experience'}
              </DialogTitle>
              <DialogDescription>
                Fill in the experience details below
              </DialogDescription>
            </DialogHeader>
            <ExperienceForm
              experience={editingExperience}
              onSave={handleSave}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingExperience(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {experiences.map((experience) => (
          <Card key={experience.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    {experience.position}
                  </CardTitle>
                  <CardDescription className="mt-2 text-base font-medium">
                    {experience.company}
                  </CardDescription>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {experience.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(experience.startDate)} - {experience.current ? 'Present' : experience.endDate ? formatDate(experience.endDate) : 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingExperience(experience);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(experience.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 whitespace-pre-wrap">
                {experience.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {experience.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-2">
                {experience.current && (
                  <Badge variant="default">Current Position</Badge>
                )}
                {!experience.visible && (
                  <Badge variant="outline">Hidden</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {experiences.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No experience entries yet</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Experience
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ExperienceForm({
  experience,
  onSave,
  onCancel,
}: {
  experience: Experience | null;
  onSave: (experience: Partial<Experience>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    company: experience?.company || '',
    position: experience?.position || '',
    location: experience?.location || '',
    startDate: experience?.startDate ? experience.startDate.split('T')[0] : '',
    endDate: experience?.endDate ? experience.endDate.split('T')[0] : '',
    current: experience?.current || false,
    description: experience?.description || '',
    technologies: experience?.technologies.join(', ') || '',
    visible: experience?.visible ?? true,
    order: experience?.order || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...experience,
      company: formData.company,
      position: formData.position,
      location: formData.location,
      startDate: formData.startDate,
      endDate: formData.current ? null : formData.endDate || null,
      current: formData.current,
      description: formData.description,
      technologies: formData.technologies.split(',').map((t) => t.trim()).filter(Boolean),
      visible: formData.visible,
      order: formData.order,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="company">Company *</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="position">Position *</Label>
          <Input
            id="position"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location *</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            disabled={formData.current}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows={5}
          placeholder="Describe your responsibilities and achievements..."
        />
      </div>

      <div>
        <Label htmlFor="technologies">Technologies (comma-separated) *</Label>
        <Input
          id="technologies"
          value={formData.technologies}
          onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
          placeholder="React, TypeScript, Node.js"
          required
        />
      </div>

      <div>
        <Label htmlFor="order">Order</Label>
        <Input
          id="order"
          type="number"
          value={formData.order}
          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
        />
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <Switch
            id="current"
            checked={formData.current}
            onCheckedChange={(checked) => setFormData({ ...formData, current: checked })}
          />
          <Label htmlFor="current">Currently Working Here</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="visible"
            checked={formData.visible}
            onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
          />
          <Label htmlFor="visible">Visible</Label>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {experience ? 'Update' : 'Create'} Experience
        </Button>
      </DialogFooter>
    </form>
  );
}
