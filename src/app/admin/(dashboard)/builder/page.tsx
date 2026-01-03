'use client';

import React, { useState, useEffect } from 'react';
import { Canvas } from '@/components/builder/Canvas';
import { PropertyEditor } from '@/components/builder/PropertyEditor';
import { PageSection } from '@/types/config';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function BuilderPage() {
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [sections, setSections] = useState<PageSection[]>([]);
  const [selectedSection, setSelectedSection] = useState<PageSection | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadLayout();
  }, [selectedPage]);

  const loadLayout = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/layouts/${selectedPage}`);
      if (response.ok) {
        const data = await response.json();
        setSections(data.sections || []);
      } else {
        setSections([]);
      }
    } catch (error) {
      console.error('Failed to load layout:', error);
      toast({
        title: 'Error',
        description: 'Failed to load page layout',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveLayout = async () => {
    try {
      const response = await fetch(`/api/admin/layouts/${selectedPage}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Page layout saved successfully',
        });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Failed to save layout:', error);
      toast({
        title: 'Error',
        description: 'Failed to save page layout',
        variant: 'destructive',
      });
    }
  };

  const handleSectionUpdate = (updatedSection: PageSection) => {
    setSections(
      sections.map((s) => (s.id === updatedSection.id ? updatedSection : s))
    );
    setSelectedSection(updatedSection);
  };

  const handlePreview = () => {
    window.open(`/?preview=${selectedPage}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="h-14 border-b bg-background flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Select value={selectedPage} onValueChange={setSelectedPage}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="home">Home Page</SelectItem>
              <SelectItem value="about">About Page</SelectItem>
              <SelectItem value="projects">Projects Page</SelectItem>
              <SelectItem value="contact">Contact Page</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={saveLayout}>
            <Save className="h-4 w-4 mr-2" />
            Save Layout
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <Canvas
          sections={sections}
          onSectionsChange={setSections}
          onSelectSection={setSelectedSection}
          selectedSection={selectedSection}
        />
        <PropertyEditor section={selectedSection} onUpdate={handleSectionUpdate} />
      </div>
    </div>
  );
}
