'use client';

import React from 'react';
import { PageSection } from '@/types/config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PropertyEditorProps {
  section: PageSection | null;
  onUpdate: (section: PageSection) => void;
}

export function PropertyEditor({ section, onUpdate }: PropertyEditorProps) {
  if (!section) {
    return (
      <div className="w-80 bg-background border-l p-4">
        <div className="text-center text-muted-foreground py-12">
          Select a section to edit its properties
        </div>
      </div>
    );
  }

  const updateConfig = (key: string, value: any) => {
    onUpdate({
      ...section,
      config: {
        ...section.config,
        [key]: value,
      },
    });
  };

  const updateType = (newType: string) => {
    onUpdate({
      ...section,
      type: newType as any,
    });
  };

  return (
    <div className="w-80 bg-background border-l p-4 overflow-auto">
      <Card>
        <CardHeader>
          <CardTitle>Properties</CardTitle>
          <CardDescription>Edit section properties</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="section-type">Section Type</Label>
            <Select value={section.type} onValueChange={updateType}>
              <SelectTrigger id="section-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hero">Hero</SelectItem>
                <SelectItem value="about">About</SelectItem>
                <SelectItem value="skills">Skills</SelectItem>
                <SelectItem value="projects">Projects</SelectItem>
                <SelectItem value="experience">Experience</SelectItem>
                <SelectItem value="contact">Contact</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="section-enabled">Enabled</Label>
            <Switch
              id="section-enabled"
              checked={section.enabled}
              onCheckedChange={(checked) => {
                onUpdate({ ...section, enabled: checked });
              }}
            />
          </div>

          {/* Hero Section Fields */}
          {section.type === 'hero' && (
            <>
              <div>
                <Label htmlFor="headline">Headline</Label>
                <Input
                  id="headline"
                  value={section.config.headline || ''}
                  onChange={(e) => updateConfig('headline', e.target.value)}
                  placeholder="Your main headline"
                />
              </div>
              <div>
                <Label htmlFor="subheadline">Subheadline</Label>
                <Textarea
                  id="subheadline"
                  value={section.config.subheadline || ''}
                  onChange={(e) => updateConfig('subheadline', e.target.value)}
                  placeholder="Supporting text"
                />
              </div>
              <div>
                <Label htmlFor="primaryCTA">Primary CTA Text</Label>
                <Input
                  id="primaryCTA"
                  value={section.config.primaryCTA?.text || ''}
                  onChange={(e) =>
                    updateConfig('primaryCTA', {
                      ...section.config.primaryCTA,
                      text: e.target.value,
                    })
                  }
                  placeholder="Get Started"
                />
              </div>
              <div>
                <Label htmlFor="primaryCTALink">Primary CTA Link</Label>
                <Input
                  id="primaryCTALink"
                  value={section.config.primaryCTA?.href || ''}
                  onChange={(e) =>
                    updateConfig('primaryCTA', {
                      ...section.config.primaryCTA,
                      href: e.target.value,
                    })
                  }
                  placeholder="/contact"
                />
              </div>
            </>
          )}

          {/* About Section Fields */}
          {section.type === 'about' && (
            <>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={section.config.title || ''}
                  onChange={(e) => updateConfig('title', e.target.value)}
                  placeholder="About Me"
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={section.config.content || ''}
                  onChange={(e) => updateConfig('content', e.target.value)}
                  placeholder="Tell your story..."
                  rows={5}
                />
              </div>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={section.config.image || ''}
                  onChange={(e) => updateConfig('image', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </>
          )}

          {/* Projects Section Fields */}
          {section.type === 'projects' && (
            <>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={section.config.title || ''}
                  onChange={(e) => updateConfig('title', e.target.value)}
                  placeholder="My Projects"
                />
              </div>
              <div>
                <Label htmlFor="layout">Layout</Label>
                <Select
                  value={section.config.layout || 'grid'}
                  onValueChange={(value) => updateConfig('layout', value)}
                >
                  <SelectTrigger id="layout">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Grid</SelectItem>
                    <SelectItem value="list">List</SelectItem>
                    <SelectItem value="masonry">Masonry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="limit">Number to Show</Label>
                <Input
                  id="limit"
                  type="number"
                  value={section.config.limit || 6}
                  onChange={(e) => updateConfig('limit', parseInt(e.target.value))}
                  min={1}
                />
              </div>
            </>
          )}

          {/* Skills Section Fields */}
          {section.type === 'skills' && (
            <>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={section.config.title || ''}
                  onChange={(e) => updateConfig('title', e.target.value)}
                  placeholder="My Skills"
                />
              </div>
              <div>
                <Label htmlFor="layout">Layout</Label>
                <Select
                  value={section.config.layout || 'grid'}
                  onValueChange={(value) => updateConfig('layout', value)}
                >
                  <SelectTrigger id="layout">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Grid</SelectItem>
                    <SelectItem value="list">List</SelectItem>
                    <SelectItem value="carousel">Carousel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Experience Section Fields */}
          {section.type === 'experience' && (
            <>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={section.config.title || ''}
                  onChange={(e) => updateConfig('title', e.target.value)}
                  placeholder="Work Experience"
                />
              </div>
            </>
          )}

          {/* Contact Section Fields */}
          {section.type === 'contact' && (
            <>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={section.config.title || ''}
                  onChange={(e) => updateConfig('title', e.target.value)}
                  placeholder="Get In Touch"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="showForm">Show Contact Form</Label>
                <Switch
                  id="showForm"
                  checked={section.config.showForm !== false}
                  onCheckedChange={(checked) => updateConfig('showForm', checked)}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
