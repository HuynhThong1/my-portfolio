'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Code, Upload, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { IconPicker, IconDisplay } from '@/components/admin/IconPicker';

interface Skill {
  id: string;
  name: string;
  icon?: string;
  iconId?: string;
  imageUrl?: string;
  category: string;
  proficiency: number;
  order: number;
  visible: boolean;
}

export default function SkillsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/skills');
      if (response.ok) {
        const data = await response.json();
        setSkills(data.skills || []);
      }
    } catch (error) {
      console.error('Failed to load skills:', error);
      toast({
        title: 'Error',
        description: 'Failed to load skills',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (skill: Partial<Skill>) => {
    try {
      const method = editingSkill ? 'PUT' : 'POST';
      const url = editingSkill
        ? `/api/admin/skills/${editingSkill.id}`
        : '/api/admin/skills';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skill),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Skill ${editingSkill ? 'updated' : 'created'} successfully`,
        });
        setIsDialogOpen(false);
        setEditingSkill(null);
        loadSkills();
        router.refresh();
      } else {
        throw new Error('Failed to save skill');
      }
    } catch (error) {
      console.error('Failed to save skill:', error);
      toast({
        title: 'Error',
        description: 'Failed to save skill',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      const response = await fetch(`/api/admin/skills/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Skill deleted successfully',
        });
        loadSkills();
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to delete skill:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete skill',
        variant: 'destructive',
      });
    }
  };

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-muted-foreground">Loading skills...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Skills</h1>
          <p className="text-muted-foreground">Manage your technical skills</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingSkill(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
              </DialogTitle>
              <DialogDescription>
                Fill in the skill details below
              </DialogDescription>
            </DialogHeader>
            <SkillForm
              skill={editingSkill}
              onSave={handleSave}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingSkill(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {Object.keys(skillsByCategory).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
            <div key={category}>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Code className="h-5 w-5" />
                {category}
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categorySkills.map((skill) => (
                  <Card key={skill.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-base">{skill.name}</CardTitle>
                          <CardDescription className="mt-1">
                            Proficiency: {skill.proficiency}%
                          </CardDescription>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingSkill(skill);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(skill.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="w-full bg-secondary rounded-full h-2 mb-3">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {skill.iconId && (
                          <IconDisplay iconId={skill.iconId} size={24} />
                        )}
                        {!skill.iconId && skill.imageUrl && (
                          <img
                            src={skill.imageUrl}
                            alt={skill.name}
                            className="w-6 h-6 object-contain"
                          />
                        )}
                        {!skill.iconId && !skill.imageUrl && skill.icon && (
                          <Badge variant="outline">{skill.icon}</Badge>
                        )}
                        {!skill.visible && (
                          <Badge variant="outline">Hidden</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No skills yet</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Skill
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function SkillForm({
  skill,
  onSave,
  onCancel,
}: {
  skill: Skill | null;
  onSave: (skill: Partial<Skill>) => void;
  onCancel: () => void;
}) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: skill?.name || '',
    icon: skill?.icon || '',
    iconId: skill?.iconId || '',
    imageUrl: skill?.imageUrl || '',
    category: skill?.category || '',
    proficiency: skill?.proficiency || 50,
    visible: skill?.visible ?? true,
    order: skill?.order || 0,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a JPEG, PNG, GIF, WebP, or SVG image',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Maximum file size is 5MB',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('folder', 'skills');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const result = await response.json();
      setFormData({ ...formData, imageUrl: result.url });
      toast({
        title: 'Image uploaded',
        description: 'Your skill icon has been uploaded successfully',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, imageUrl: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...skill,
      name: formData.name,
      icon: formData.icon || undefined,
      iconId: formData.iconId || undefined,
      imageUrl: formData.imageUrl || undefined,
      category: formData.category,
      proficiency: formData.proficiency,
      visible: formData.visible,
      order: formData.order,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Skill Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="React, TypeScript, etc."
        />
      </div>

      <div>
        <Label htmlFor="category">Category *</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
          placeholder="Frontend, Backend, DevOps, etc."
        />
      </div>

      <div>
        <Label>Skill Icon (Recommended)</Label>
        <p className="text-xs text-muted-foreground mb-2">
          Choose from 150+ technology icons
        </p>
        <IconPicker
          value={formData.iconId}
          onChange={(iconId) => setFormData({ ...formData, iconId })}
        />
      </div>

      <div className="border-t pt-4">
        <p className="text-xs text-muted-foreground mb-3">
          Or use a custom image / emoji instead:
        </p>

        <div className="space-y-3">
          {/* Image Upload */}
          <div>
            <Label className="text-sm">Custom Image</Label>
            <div className="mt-2 flex items-center gap-3">
              {formData.imageUrl ? (
                <div className="relative inline-block">
                  <img
                    src={formData.imageUrl}
                    alt="Skill icon preview"
                    className="w-12 h-12 object-contain border rounded-lg p-1.5 bg-zinc-50 dark:bg-zinc-900"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-1.5 -right-1.5 p-0.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="w-12 h-12 border-2 border-dashed rounded-lg flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="skill-image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Emoji Fallback */}
          <div>
            <Label htmlFor="icon" className="text-sm">Emoji Fallback</Label>
            <Input
              id="icon"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="⚛️"
              className="max-w-[100px] mt-1"
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="proficiency">Proficiency: {formData.proficiency}%</Label>
        <Slider
          id="proficiency"
          min={0}
          max={100}
          step={5}
          value={[formData.proficiency]}
          onValueChange={(value) => setFormData({ ...formData, proficiency: value[0] })}
          className="mt-2"
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
        <Button type="submit" disabled={uploading}>
          {skill ? 'Update' : 'Create'} Skill
        </Button>
      </DialogFooter>
    </form>
  );
}
