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
import { Plus, Pencil, Trash2, GraduationCap, MapPin, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Education {
  id: string;
  institution: string;
  degree: string;
  field?: string | null;
  location: string;
  startDate: string;
  endDate?: string | null;
  description?: string | null;
  order: number;
  visible: boolean;
}

export default function EducationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadEducation();
  }, []);

  const loadEducation = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/education');
      if (response.ok) {
        const data = await response.json();
        setEducation(data.education || []);
      }
    } catch (error) {
      console.error('Failed to load education:', error);
      toast({
        title: 'Error',
        description: 'Failed to load education',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (education: Partial<Education>) => {
    try {
      const method = editingEducation ? 'PUT' : 'POST';
      const url = editingEducation
        ? `/api/admin/education/${editingEducation.id}`
        : '/api/admin/education';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(education),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Education ${editingEducation ? 'updated' : 'created'} successfully`,
        });
        setIsDialogOpen(false);
        setEditingEducation(null);
        loadEducation();
        router.refresh();
      } else {
        throw new Error('Failed to save education');
      }
    } catch (error) {
      console.error('Failed to save education:', error);
      toast({
        title: 'Error',
        description: 'Failed to save education',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education entry?')) return;

    try {
      const response = await fetch(`/api/admin/education/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Education deleted successfully',
        });
        loadEducation();
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to delete education:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete education',
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
        <div className="text-muted-foreground">Loading education...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Education</h1>
          <p className="text-muted-foreground">Manage your educational background</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingEducation(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEducation ? 'Edit Education' : 'Add New Education'}
              </DialogTitle>
              <DialogDescription>
                Fill in the education details below
              </DialogDescription>
            </DialogHeader>
            <EducationForm
              education={editingEducation}
              onSave={handleSave}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingEducation(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {education.map((edu) => (
          <Card key={edu.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    {edu.degree}
                  </CardTitle>
                  {edu.field && (
                    <CardDescription className="mt-1 text-base">
                      {edu.field}
                    </CardDescription>
                  )}
                  <CardDescription className="mt-2 text-base font-medium">
                    {edu.institution}
                  </CardDescription>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {edu.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingEducation(edu);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(edu.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {(edu.description || !edu.visible) && (
              <CardContent>
                {edu.description && (
                  <p className="text-sm text-muted-foreground mb-4 whitespace-pre-wrap">
                    {edu.description}
                  </p>
                )}
                {!edu.visible && (
                  <Badge variant="outline">Hidden</Badge>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {education.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No education entries yet</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Education
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function EducationForm({
  education,
  onSave,
  onCancel,
}: {
  education: Education | null;
  onSave: (education: Partial<Education>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    institution: education?.institution || '',
    degree: education?.degree || '',
    field: education?.field || '',
    location: education?.location || '',
    startDate: education?.startDate ? education.startDate.split('T')[0] : '',
    endDate: education?.endDate ? education.endDate.split('T')[0] : '',
    description: education?.description || '',
    visible: education?.visible ?? true,
    order: education?.order || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...education,
      institution: formData.institution,
      degree: formData.degree,
      field: formData.field || undefined,
      location: formData.location,
      startDate: formData.startDate,
      endDate: formData.endDate || null,
      description: formData.description || undefined,
      visible: formData.visible,
      order: formData.order,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="institution">Institution *</Label>
          <Input
            id="institution"
            value={formData.institution}
            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
            required
            placeholder="e.g., MIT"
          />
        </div>
        <div>
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
            placeholder="e.g., Cambridge, MA"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="degree">Degree *</Label>
          <Input
            id="degree"
            value={formData.degree}
            onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
            required
            placeholder="e.g., Bachelor of Science"
          />
        </div>
        <div>
          <Label htmlFor="field">Field of Study</Label>
          <Input
            id="field"
            value={formData.field}
            onChange={(e) => setFormData({ ...formData, field: e.target.value })}
            placeholder="e.g., Computer Science"
          />
        </div>
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
            placeholder="Leave blank if current"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          placeholder="Notable achievements, GPA, honors, etc."
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

      <div className="flex items-center gap-2">
        <Switch
          id="visible"
          checked={formData.visible}
          onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
        />
        <Label htmlFor="visible">Visible</Label>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {education ? 'Update' : 'Create'} Education
        </Button>
      </DialogFooter>
    </form>
  );
}
