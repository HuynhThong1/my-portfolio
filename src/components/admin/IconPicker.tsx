'use client';

import React, { useState, useMemo } from 'react';
import { Search, X, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  techIcons,
  iconsByCategory,
  categoryLabels,
  TechIcon as TechIconType,
  getIconById,
} from '@/components/icons/TechIcons';

interface IconPickerProps {
  value?: string;
  onChange: (iconId: string) => void;
  trigger?: React.ReactNode;
}

export function IconPicker({ value, onChange, trigger }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const selectedIcon = value ? getIconById(value) : null;

  const filteredIcons = useMemo(() => {
    let icons = selectedCategory === 'all' ? techIcons : iconsByCategory[selectedCategory] || [];

    if (search) {
      const searchLower = search.toLowerCase();
      icons = icons.filter(
        (icon) =>
          icon.name.toLowerCase().includes(searchLower) ||
          icon.id.toLowerCase().includes(searchLower)
      );
    }

    return icons;
  }, [selectedCategory, search]);

  const handleSelect = (iconId: string) => {
    onChange(iconId);
    setOpen(false);
    setSearch('');
  };

  const categories = ['all', ...Object.keys(iconsByCategory)];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
            {selectedIcon ? (
              <>
                <div className="w-8 h-8 flex items-center justify-center">
                  <selectedIcon.icon size={28} />
                </div>
                <span>{selectedIcon.name}</span>
              </>
            ) : (
              <>
                <div className="w-8 h-8 flex items-center justify-center rounded bg-zinc-100 dark:bg-zinc-800">
                  <Search className="w-4 h-4 text-zinc-400" />
                </div>
                <span className="text-muted-foreground">Select an icon...</span>
              </>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Select Technology Icon</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="flex flex-wrap h-auto gap-1 bg-transparent p-0">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                All
              </TabsTrigger>
              {Object.keys(iconsByCategory).map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {categoryLabels[category]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Icons Grid */}
          <ScrollArea className="h-[400px] pr-4">
            {filteredIcons.length > 0 ? (
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                {filteredIcons.map((icon) => {
                  const isSelected = value === icon.id;
                  const IconComponent = icon.icon;

                  return (
                    <button
                      key={icon.id}
                      onClick={() => handleSelect(icon.id)}
                      className={`
                        relative flex flex-col items-center gap-2 p-3 rounded-lg border transition-all
                        hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-primary/50
                        ${
                          isSelected
                            ? 'bg-primary/10 border-primary ring-2 ring-primary/20'
                            : 'border-zinc-200 dark:border-zinc-800'
                        }
                      `}
                    >
                      {isSelected && (
                        <div className="absolute top-1 right-1">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                      )}
                      <div className="w-8 h-8 flex items-center justify-center">
                        <IconComponent size={28} />
                      </div>
                      <span className="text-[10px] text-center text-muted-foreground truncate w-full">
                        {icon.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Search className="h-12 w-12 mb-4 opacity-20" />
                <p>No icons found</p>
                <p className="text-sm">Try a different search term</p>
              </div>
            )}
          </ScrollArea>

          {/* Selected Preview */}
          {selectedIcon && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <div className="w-10 h-10 flex items-center justify-center">
                <selectedIcon.icon size={36} />
              </div>
              <div>
                <p className="font-medium">{selectedIcon.name}</p>
                <p className="text-xs text-muted-foreground">
                  {categoryLabels[selectedIcon.category]}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto"
                onClick={() => {
                  onChange('');
                  setOpen(false);
                }}
              >
                Clear
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Compact icon display component
export function IconDisplay({
  iconId,
  size = 24,
  showName = false,
  className = '',
}: {
  iconId?: string;
  size?: number;
  showName?: boolean;
  className?: string;
}) {
  if (!iconId) {
    return (
      <div
        className={`flex items-center justify-center rounded bg-zinc-200 dark:bg-zinc-800 ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-xs text-zinc-400">?</span>
      </div>
    );
  }

  const icon = getIconById(iconId);
  if (!icon) {
    return (
      <div
        className={`flex items-center justify-center rounded bg-zinc-200 dark:bg-zinc-800 ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-xs text-zinc-400">?</span>
      </div>
    );
  }

  const IconComponent = icon.icon;

  if (showName) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <IconComponent size={size} />
        <span className="text-sm">{icon.name}</span>
      </div>
    );
  }

  return <IconComponent size={size} className={className} />;
}
