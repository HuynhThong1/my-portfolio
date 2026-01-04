'use client';

import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { BlockWrapper } from './BlockWrapper';
import { PageSection } from '@/types/config';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface CanvasProps {
  sections: PageSection[];
  onSectionsChange: (sections: PageSection[]) => void;
  onSelectSection: (section: PageSection | null) => void;
  selectedSection: PageSection | null;
}

export function Canvas({
  sections,
  onSectionsChange,
  onSelectSection,
  selectedSection,
}: CanvasProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);

      const reorderedSections = arrayMove(sections, oldIndex, newIndex);

      // Update order field to match new array positions
      const newSections = reorderedSections.map((section, index) => ({
        ...section,
        order: index,
      }));

      onSectionsChange(newSections);
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const addNewSection = () => {
    const newSection: PageSection = {
      id: `section-${Date.now()}`,
      type: 'hero',
      enabled: true,
      order: sections.length,
      config: {
        headline: 'New Section',
        subheadline: 'Edit this section',
      },
    };
    onSectionsChange([...sections, newSection]);
    onSelectSection(newSection);
  };

  const activeSection = sections.find((s) => s.id === activeId);

  return (
    <div className="flex-1 bg-muted/30 p-4 overflow-auto">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Page Canvas</h2>
          <Button onClick={addNewSection} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Section
          </Button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={sections.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {sections.map((section) => (
                <BlockWrapper
                  key={section.id}
                  section={section}
                  isSelected={selectedSection?.id === section.id}
                  onSelect={() => onSelectSection(section)}
                  onDelete={() => {
                    const filteredSections = sections.filter((s) => s.id !== section.id);
                    // Update order field after deletion
                    const reorderedSections = filteredSections.map((s, index) => ({
                      ...s,
                      order: index,
                    }));
                    onSectionsChange(reorderedSections);
                    if (selectedSection?.id === section.id) {
                      onSelectSection(null);
                    }
                  }}
                  onToggleEnabled={() => {
                    onSectionsChange(
                      sections.map((s) =>
                        s.id === section.id ? { ...s, enabled: !s.enabled } : s
                      )
                    );
                  }}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeSection ? (
              <div className="bg-background border-2 border-primary rounded-lg p-4 opacity-80">
                <div className="font-medium">{activeSection.type}</div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {sections.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No sections yet. Click "Add Section" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
