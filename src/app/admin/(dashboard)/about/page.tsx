'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, Save, Loader2, Eye, GripVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AboutData {
  id?: string;
  sectionLabel: string;
  title: string;
  titleHighlight: string;
  description: string[];
  skills: Array<{ name: string; icon?: string }>;
  yearsExperience: number;
  projectsCount: number;
  highlights: Array<{ icon?: string; title: string; description: string }>;
  profileEmoji: string;
  showImage: boolean;
  showThreeBackground: boolean;
  imagePosition: 'left' | 'right';
}

const defaultData: AboutData = {
  sectionLabel: 'About Me',
  title: 'Passionate Developer,',
  titleHighlight: 'Problem Solver',
  description: [
    "I'm a passionate full-stack developer with over 3 years of experience building scalable web applications and beautiful user interfaces.",
  ],
  skills: [{ name: 'React & Next.js' }],
  yearsExperience: 3,
  projectsCount: 20,
  highlights: [
    { icon: 'code', title: 'Clean Code', description: 'Writing maintainable, scalable code' },
  ],
  profileEmoji: '👨‍💻',
  showImage: true,
  showThreeBackground: true,
  imagePosition: 'right',
};

const iconOptions = [
  { value: 'code', label: 'Code' },
  { value: 'palette', label: 'Palette' },
  { value: 'zap', label: 'Zap' },
];

const emojiOptions = ['👨‍💻', '👩‍💻', '🧑‍💻', '💻', '🚀', '⚡', '🎯', '🔥', '✨', '🌟'];

export default function AboutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<AboutData>(defaultData);

  useEffect(() => {
    loadAboutData();
  }, []);

  const loadAboutData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/about');
      if (response.ok) {
        const result = await response.json();
        if (result.about) {
          setData({
            ...result.about,
            skills: result.about.skills || [],
            highlights: result.about.highlights || [],
            description: result.about.description || [],
          });
        }
      }
    } catch (error) {
      console.error('Failed to load about data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load about section data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'About section updated successfully',
        });
        router.refresh();
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Failed to save:', error);
      toast({
        title: 'Error',
        description: 'Failed to save about section',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Description handlers
  const addDescription = () => {
    setData({ ...data, description: [...data.description, ''] });
  };

  const updateDescription = (index: number, value: string) => {
    const newDesc = [...data.description];
    newDesc[index] = value;
    setData({ ...data, description: newDesc });
  };

  const removeDescription = (index: number) => {
    setData({ ...data, description: data.description.filter((_, i) => i !== index) });
  };

  // Skills handlers
  const addSkill = () => {
    setData({ ...data, skills: [...data.skills, { name: '' }] });
  };

  const updateSkill = (index: number, field: string, value: string) => {
    const newSkills = [...data.skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setData({ ...data, skills: newSkills });
  };

  const removeSkill = (index: number) => {
    setData({ ...data, skills: data.skills.filter((_, i) => i !== index) });
  };

  // Highlights handlers
  const addHighlight = () => {
    setData({
      ...data,
      highlights: [...data.highlights, { icon: 'code', title: '', description: '' }],
    });
  };

  const updateHighlight = (index: number, field: string, value: string) => {
    const newHighlights = [...data.highlights];
    newHighlights[index] = { ...newHighlights[index], [field]: value };
    setData({ ...data, highlights: newHighlights });
  };

  const removeHighlight = (index: number) => {
    setData({ ...data, highlights: data.highlights.filter((_, i) => i !== index) });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">About Section</h1>
          <p className="text-muted-foreground">
            Customize your about section content and appearance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="/" target="_blank">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </a>
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="highlights">Highlights</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Section Header</CardTitle>
              <CardDescription>Configure the main title and label</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sectionLabel">Section Label</Label>
                <Input
                  id="sectionLabel"
                  value={data.sectionLabel}
                  onChange={(e) => setData({ ...data, sectionLabel: e.target.value })}
                  placeholder="About Me"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={data.title}
                    onChange={(e) => setData({ ...data, title: e.target.value })}
                    placeholder="Passionate Developer,"
                  />
                </div>
                <div>
                  <Label htmlFor="titleHighlight">Title Highlight</Label>
                  <Input
                    id="titleHighlight"
                    value={data.titleHighlight}
                    onChange={(e) => setData({ ...data, titleHighlight: e.target.value })}
                    placeholder="Problem Solver"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This text will have a gradient effect
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Description Paragraphs</CardTitle>
              <CardDescription>Add multiple paragraphs to describe yourself</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.description.map((paragraph, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex items-center text-muted-foreground">
                    <GripVertical className="h-4 w-4" />
                  </div>
                  <Textarea
                    value={paragraph}
                    onChange={(e) => updateDescription(index, e.target.value)}
                    placeholder={`Paragraph ${index + 1}`}
                    rows={3}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDescription(index)}
                    disabled={data.description.length <= 1}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addDescription} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Paragraph
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stats</CardTitle>
              <CardDescription>Numbers displayed on floating cards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="yearsExperience">Years of Experience</Label>
                  <Input
                    id="yearsExperience"
                    type="number"
                    min={0}
                    value={data.yearsExperience}
                    onChange={(e) =>
                      setData({ ...data, yearsExperience: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="projectsCount">Projects Count</Label>
                  <Input
                    id="projectsCount"
                    type="number"
                    min={0}
                    value={data.projectsCount}
                    onChange={(e) =>
                      setData({ ...data, projectsCount: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Skills</CardTitle>
              <CardDescription>
                Skills displayed with checkmarks in the about section
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.skills.map((skill, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <div className="flex items-center text-muted-foreground">
                    <GripVertical className="h-4 w-4" />
                  </div>
                  <Input
                    value={skill.name}
                    onChange={(e) => updateSkill(index, 'name', e.target.value)}
                    placeholder="Skill name (e.g., React & Next.js)"
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSkill(index)}
                    disabled={data.skills.length <= 1}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addSkill} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Highlights Tab */}
        <TabsContent value="highlights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Highlight Cards</CardTitle>
              <CardDescription>Feature cards displayed below the profile image</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {data.highlights.map((highlight, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Highlight {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeHighlight(index)}
                      disabled={data.highlights.length <= 1}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Icon</Label>
                      <Select
                        value={highlight.icon || 'code'}
                        onValueChange={(value) => updateHighlight(index, 'icon', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {iconOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Label>Title</Label>
                      <Input
                        value={highlight.title}
                        onChange={(e) => updateHighlight(index, 'title', e.target.value)}
                        placeholder="Clean Code"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={highlight.description}
                      onChange={(e) => updateHighlight(index, 'description', e.target.value)}
                      placeholder="Writing maintainable, scalable code"
                    />
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={addHighlight} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Highlight
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>Configure the visual appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Profile Emoji</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setData({ ...data, profileEmoji: emoji })}
                      className={`text-3xl p-2 rounded-lg border-2 transition-all ${
                        data.profileEmoji === emoji
                          ? 'border-primary bg-primary/10'
                          : 'border-transparent hover:border-muted'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Or enter a custom emoji:
                </p>
                <Input
                  value={data.profileEmoji}
                  onChange={(e) => setData({ ...data, profileEmoji: e.target.value })}
                  className="max-w-[100px] mt-1"
                />
              </div>

              <div>
                <Label>Image Position</Label>
                <Select
                  value={data.imagePosition}
                  onValueChange={(value: 'left' | 'right') =>
                    setData({ ...data, imagePosition: value })
                  }
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="right">Right (Default)</SelectItem>
                    <SelectItem value="left">Left</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Profile Image</Label>
                    <p className="text-sm text-muted-foreground">
                      Display the profile emoji and stat cards
                    </p>
                  </div>
                  <Switch
                    checked={data.showImage}
                    onCheckedChange={(checked) => setData({ ...data, showImage: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>3D Background Animation</Label>
                    <p className="text-sm text-muted-foreground">
                      Show interactive Three.js floating shapes
                    </p>
                  </div>
                  <Switch
                    checked={data.showThreeBackground}
                    onCheckedChange={(checked) =>
                      setData({ ...data, showThreeBackground: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
