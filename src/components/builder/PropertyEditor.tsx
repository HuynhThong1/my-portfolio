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

  // Ensure config exists
  const safeSection = {
    ...section,
    config: section.config || {},
  };

  const updateConfig = (key: string, value: any) => {
    onUpdate({
      ...safeSection,
      config: {
        ...safeSection.config,
        [key]: value,
      },
    });
  };

  const updateType = (newType: string) => {
    onUpdate({
      ...safeSection,
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
            <Select value={safeSection.type} onValueChange={updateType}>
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
                <SelectItem value="contact-cta">Contact CTA</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="section-enabled">Enabled</Label>
            <Switch
              id="section-enabled"
              checked={safeSection.enabled}
              onCheckedChange={(checked) => {
                onUpdate({ ...safeSection, enabled: checked });
              }}
            />
          </div>

          {/* Hero Section Fields */}
          {safeSection.type === 'hero' && (
            <>
              <div>
                <Label htmlFor="headline">Headline</Label>
                <Input
                  id="headline"
                  value={safeSection.config.headline || ''}
                  onChange={(e) => updateConfig('headline', e.target.value)}
                  placeholder="Hi, I'm John Doe"
                />
              </div>
              <div>
                <Label htmlFor="subheadline">Badge Text</Label>
                <Input
                  id="subheadline"
                  value={safeSection.config.subheadline || ''}
                  onChange={(e) => updateConfig('subheadline', e.target.value)}
                  placeholder="Full-Stack Developer"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={safeSection.config.description || ''}
                  onChange={(e) => updateConfig('description', e.target.value)}
                  placeholder="I build exceptional digital experiences"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="primaryCTA">Primary CTA Text</Label>
                <Input
                  id="primaryCTA"
                  value={safeSection.config.ctaPrimary?.label || ''}
                  onChange={(e) =>
                    updateConfig('ctaPrimary', {
                      ...safeSection.config.ctaPrimary,
                      label: e.target.value,
                    })
                  }
                  placeholder="View Projects"
                />
              </div>
              <div>
                <Label htmlFor="primaryCTALink">Primary CTA Link</Label>
                <Input
                  id="primaryCTALink"
                  value={safeSection.config.ctaPrimary?.href || ''}
                  onChange={(e) =>
                    updateConfig('ctaPrimary', {
                      ...safeSection.config.ctaPrimary,
                      href: e.target.value,
                    })
                  }
                  placeholder="/projects"
                />
              </div>
              <div>
                <Label htmlFor="secondaryCTA">Secondary CTA Text</Label>
                <Input
                  id="secondaryCTA"
                  value={safeSection.config.ctaSecondary?.label || ''}
                  onChange={(e) =>
                    updateConfig('ctaSecondary', {
                      ...safeSection.config.ctaSecondary,
                      label: e.target.value,
                    })
                  }
                  placeholder="Download CV"
                />
              </div>
              <div>
                <Label htmlFor="secondaryCTALink">Secondary CTA Link</Label>
                <Input
                  id="secondaryCTALink"
                  value={safeSection.config.ctaSecondary?.href || ''}
                  onChange={(e) =>
                    updateConfig('ctaSecondary', {
                      ...safeSection.config.ctaSecondary,
                      href: e.target.value,
                    })
                  }
                  placeholder="/cv.pdf"
                />
              </div>

              {/* Stats Section */}
              <div className="pt-4 border-t">
                <Label className="text-base font-semibold">Stats</Label>
                <p className="text-xs text-muted-foreground mb-3">
                  Configure the statistics shown below the hero section
                </p>

                {/* Stat 1 */}
                <div className="space-y-2 mb-3">
                  <Label htmlFor="stat1Value" className="text-xs">Stat 1 Value</Label>
                  <Input
                    id="stat1Value"
                    value={safeSection.config.stats?.[0]?.value || ''}
                    onChange={(e) => {
                      const currentStats = safeSection.config.stats || [
                        { value: '3+', label: 'Years Experience' },
                        { value: '20+', label: 'Projects Completed' },
                        { value: '10+', label: 'Happy Clients' },
                      ];
                      const newStats = [...currentStats];
                      newStats[0] = { ...newStats[0], value: e.target.value };
                      updateConfig('stats', newStats);
                    }}
                    placeholder="3+"
                  />
                  <Label htmlFor="stat1Label" className="text-xs">Stat 1 Label</Label>
                  <Input
                    id="stat1Label"
                    value={safeSection.config.stats?.[0]?.label || ''}
                    onChange={(e) => {
                      const currentStats = safeSection.config.stats || [
                        { value: '3+', label: 'Years Experience' },
                        { value: '20+', label: 'Projects Completed' },
                        { value: '10+', label: 'Happy Clients' },
                      ];
                      const newStats = [...currentStats];
                      newStats[0] = { ...newStats[0], label: e.target.value };
                      updateConfig('stats', newStats);
                    }}
                    placeholder="Years Experience"
                  />
                </div>

                {/* Stat 2 */}
                <div className="space-y-2 mb-3">
                  <Label htmlFor="stat2Value" className="text-xs">Stat 2 Value</Label>
                  <Input
                    id="stat2Value"
                    value={safeSection.config.stats?.[1]?.value || ''}
                    onChange={(e) => {
                      const currentStats = safeSection.config.stats || [
                        { value: '3+', label: 'Years Experience' },
                        { value: '20+', label: 'Projects Completed' },
                        { value: '10+', label: 'Happy Clients' },
                      ];
                      const newStats = [...currentStats];
                      newStats[1] = { ...newStats[1], value: e.target.value };
                      updateConfig('stats', newStats);
                    }}
                    placeholder="20+"
                  />
                  <Label htmlFor="stat2Label" className="text-xs">Stat 2 Label</Label>
                  <Input
                    id="stat2Label"
                    value={safeSection.config.stats?.[1]?.label || ''}
                    onChange={(e) => {
                      const currentStats = safeSection.config.stats || [
                        { value: '3+', label: 'Years Experience' },
                        { value: '20+', label: 'Projects Completed' },
                        { value: '10+', label: 'Happy Clients' },
                      ];
                      const newStats = [...currentStats];
                      newStats[1] = { ...newStats[1], label: e.target.value };
                      updateConfig('stats', newStats);
                    }}
                    placeholder="Projects Completed"
                  />
                </div>

                {/* Stat 3 */}
                <div className="space-y-2">
                  <Label htmlFor="stat3Value" className="text-xs">Stat 3 Value</Label>
                  <Input
                    id="stat3Value"
                    value={safeSection.config.stats?.[2]?.value || ''}
                    onChange={(e) => {
                      const currentStats = safeSection.config.stats || [
                        { value: '3+', label: 'Years Experience' },
                        { value: '20+', label: 'Projects Completed' },
                        { value: '10+', label: 'Happy Clients' },
                      ];
                      const newStats = [...currentStats];
                      newStats[2] = { ...newStats[2], value: e.target.value };
                      updateConfig('stats', newStats);
                    }}
                    placeholder="10+"
                  />
                  <Label htmlFor="stat3Label" className="text-xs">Stat 3 Label</Label>
                  <Input
                    id="stat3Label"
                    value={safeSection.config.stats?.[2]?.label || ''}
                    onChange={(e) => {
                      const currentStats = safeSection.config.stats || [
                        { value: '3+', label: 'Years Experience' },
                        { value: '20+', label: 'Projects Completed' },
                        { value: '10+', label: 'Happy Clients' },
                      ];
                      const newStats = [...currentStats];
                      newStats[2] = { ...newStats[2], label: e.target.value };
                      updateConfig('stats', newStats);
                    }}
                    placeholder="Happy Clients"
                  />
                </div>
              </div>
            </>
          )}

          {/* About Section Fields */}
          {safeSection.type === 'about' && (
            <>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={safeSection.config.title || ''}
                  onChange={(e) => updateConfig('title', e.target.value)}
                  placeholder="About Me"
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={safeSection.config.content || ''}
                  onChange={(e) => updateConfig('content', e.target.value)}
                  placeholder="Tell your story..."
                  rows={5}
                />
              </div>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={safeSection.config.image || ''}
                  onChange={(e) => updateConfig('image', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </>
          )}

          {/* Projects Section Fields */}
          {safeSection.type === 'projects' && (
            <>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={safeSection.config.title || ''}
                  onChange={(e) => updateConfig('title', e.target.value)}
                  placeholder="My Projects"
                />
              </div>
              <div>
                <Label htmlFor="layout">Layout</Label>
                <Select
                  value={safeSection.config.layout || 'grid'}
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
                  value={safeSection.config.limit || 6}
                  onChange={(e) => updateConfig('limit', parseInt(e.target.value))}
                  min={1}
                />
              </div>
            </>
          )}

          {/* Skills Section Fields */}
          {safeSection.type === 'skills' && (
            <>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={safeSection.config.title || ''}
                  onChange={(e) => updateConfig('title', e.target.value)}
                  placeholder="My Skills"
                />
              </div>
              <div>
                <Label htmlFor="layout">Layout</Label>
                <Select
                  value={safeSection.config.layout || 'grid'}
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
          {safeSection.type === 'experience' && (
            <>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={safeSection.config.title || ''}
                  onChange={(e) => updateConfig('title', e.target.value)}
                  placeholder="Work Experience"
                />
              </div>
            </>
          )}

          {/* Contact Section Fields */}
          {safeSection.type === 'contact' && (
            <>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={safeSection.config.title || ''}
                  onChange={(e) => updateConfig('title', e.target.value)}
                  placeholder="Get In Touch"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={safeSection.config.description || ''}
                  onChange={(e) => updateConfig('description', e.target.value)}
                  placeholder="Feel free to reach out for collaborations or just a friendly hello"
                  rows={2}
                />
              </div>

              {/* Contact Information */}
              <div className="pt-4 border-t">
                <Label className="text-base font-semibold">Contact Information</Label>
                <p className="text-xs text-muted-foreground mb-3">
                  Configure the contact details displayed
                </p>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="email" className="text-xs">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={safeSection.config.email || ''}
                      onChange={(e) => updateConfig('email', e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-xs">Phone</Label>
                    <Input
                      id="phone"
                      value={safeSection.config.phone || ''}
                      onChange={(e) => updateConfig('phone', e.target.value)}
                      placeholder="+84 123 456 789"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location" className="text-xs">Location</Label>
                    <Input
                      id="location"
                      value={safeSection.config.location || ''}
                      onChange={(e) => updateConfig('location', e.target.value)}
                      placeholder="Ho Chi Minh City, Vietnam"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showForm">Show Contact Form</Label>
                <Switch
                  id="showForm"
                  checked={safeSection.config.showForm !== false}
                  onCheckedChange={(checked) => updateConfig('showForm', checked)}
                />
              </div>
            </>
          )}

          {/* Contact CTA Section Fields */}
          {safeSection.type === 'contact-cta' && (
            <>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={safeSection.config.title || ''}
                  onChange={(e) => updateConfig('title', e.target.value)}
                  placeholder="Let's Work Together"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={safeSection.config.description || ''}
                  onChange={(e) => updateConfig('description', e.target.value)}
                  placeholder="Have a project in mind? I'd love to hear about it."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="primaryCTA">Primary CTA Text</Label>
                <Input
                  id="primaryCTA"
                  value={safeSection.config.primaryCTA?.label || ''}
                  onChange={(e) =>
                    updateConfig('primaryCTA', {
                      ...safeSection.config.primaryCTA,
                      label: e.target.value,
                    })
                  }
                  placeholder="Get In Touch"
                />
              </div>
              <div>
                <Label htmlFor="primaryCTALink">Primary CTA Link</Label>
                <Input
                  id="primaryCTALink"
                  value={safeSection.config.primaryCTA?.href || ''}
                  onChange={(e) =>
                    updateConfig('primaryCTA', {
                      ...safeSection.config.primaryCTA,
                      href: e.target.value,
                    })
                  }
                  placeholder="/contact"
                />
              </div>
              <div>
                <Label htmlFor="secondaryCTA">Secondary CTA Text</Label>
                <Input
                  id="secondaryCTA"
                  value={safeSection.config.secondaryCTA?.label || ''}
                  onChange={(e) =>
                    updateConfig('secondaryCTA', {
                      ...safeSection.config.secondaryCTA,
                      label: e.target.value,
                    })
                  }
                  placeholder="Schedule a Call"
                />
              </div>
              <div>
                <Label htmlFor="secondaryCTALink">Secondary CTA Link</Label>
                <Input
                  id="secondaryCTALink"
                  value={safeSection.config.secondaryCTA?.href || ''}
                  onChange={(e) =>
                    updateConfig('secondaryCTA', {
                      ...safeSection.config.secondaryCTA,
                      href: e.target.value,
                    })
                  }
                  placeholder="/contact"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
