'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PageSection } from '@/types/config';
import { Button } from '@/components/ui/button';
import { GripVertical, Eye, EyeOff, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlockWrapperProps {
  section: PageSection;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onToggleEnabled: () => void;
}

export function BlockWrapper({
  section,
  isSelected,
  onSelect,
  onDelete,
  onToggleEnabled,
}: BlockWrapperProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'bg-background border-2 rounded-lg p-4 relative group',
        isSelected && 'border-primary',
        !isSelected && 'border-border',
        isDragging && 'opacity-50',
        !section.enabled && 'opacity-60'
      )}
      onClick={onSelect}
    >
      <div className="flex items-start gap-2">
        <button
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium capitalize">{section.type} Section</div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleEnabled();
                }}
              >
                {section.enabled ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            {section.config?.headline || section.config?.title || 'No title'}
          </div>
        </div>
      </div>
    </div>
  );
}
