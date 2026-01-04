import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Canvas } from '../Canvas';
import { PageSection } from '@/types/config';

// Mock @dnd-kit
jest.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DragOverlay: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useSensor: jest.fn(),
  useSensors: jest.fn(() => []),
  PointerSensor: jest.fn(),
  closestCenter: jest.fn(),
}));

jest.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  verticalListSortingStrategy: jest.fn(),
  arrayMove: (array: any[], oldIndex: number, newIndex: number) => {
    const newArray = [...array];
    const [removed] = newArray.splice(oldIndex, 1);
    newArray.splice(newIndex, 0, removed);
    return newArray;
  },
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
}));

jest.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: {
      toString: () => '',
    },
  },
}));

describe('Canvas', () => {
  const mockSections: PageSection[] = [
    {
      id: 'section-1',
      type: 'hero',
      enabled: true,
      order: 1,
      config: {
        headline: 'Test Headline',
      },
    },
    {
      id: 'section-2',
      type: 'about',
      enabled: true,
      order: 2,
      config: {
        title: 'About Me',
      },
    },
  ];

  const mockOnSectionsChange = jest.fn();
  const mockOnSelectSection = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render page canvas title', () => {
    render(
      <Canvas
        sections={[]}
        onSectionsChange={mockOnSectionsChange}
        onSelectSection={mockOnSelectSection}
        selectedSection={null}
      />
    );

    expect(screen.getByText('Page Canvas')).toBeInTheDocument();
  });

  it('should render add section button', () => {
    render(
      <Canvas
        sections={[]}
        onSectionsChange={mockOnSectionsChange}
        onSelectSection={mockOnSelectSection}
        selectedSection={null}
      />
    );

    expect(screen.getByText('Add Section')).toBeInTheDocument();
  });

  it('should render empty state when no sections', () => {
    render(
      <Canvas
        sections={[]}
        onSectionsChange={mockOnSectionsChange}
        onSelectSection={mockOnSelectSection}
        selectedSection={null}
      />
    );

    expect(screen.getByText(/No sections yet/)).toBeInTheDocument();
  });

  it('should render sections when provided', () => {
    render(
      <Canvas
        sections={mockSections}
        onSectionsChange={mockOnSectionsChange}
        onSelectSection={mockOnSelectSection}
        selectedSection={null}
      />
    );

    expect(screen.getByText('hero Section')).toBeInTheDocument();
    expect(screen.getByText('about Section')).toBeInTheDocument();
  });

  it('should call onSectionsChange when adding new section', () => {
    render(
      <Canvas
        sections={mockSections}
        onSectionsChange={mockOnSectionsChange}
        onSelectSection={mockOnSelectSection}
        selectedSection={null}
      />
    );

    const addButton = screen.getByText('Add Section');
    fireEvent.click(addButton);

    expect(mockOnSectionsChange).toHaveBeenCalled();
    const newSections = mockOnSectionsChange.mock.calls[0][0];
    expect(newSections).toHaveLength(3); // 2 original + 1 new
    expect(newSections[2].type).toBe('hero'); // New section defaults to hero
  });

  it('should call onSelectSection when adding new section', () => {
    render(
      <Canvas
        sections={mockSections}
        onSectionsChange={mockOnSectionsChange}
        onSelectSection={mockOnSelectSection}
        selectedSection={null}
      />
    );

    const addButton = screen.getByText('Add Section');
    fireEvent.click(addButton);

    expect(mockOnSelectSection).toHaveBeenCalled();
  });

  it('should highlight selected section', () => {
    const { container } = render(
      <Canvas
        sections={mockSections}
        onSectionsChange={mockOnSectionsChange}
        onSelectSection={mockOnSelectSection}
        selectedSection={mockSections[0]}
      />
    );

    // The selected section should have the primary border class
    const sections = container.querySelectorAll('.border-primary');
    expect(sections.length).toBeGreaterThan(0);
  });

  it('should create new section with correct default values', () => {
    render(
      <Canvas
        sections={[]}
        onSectionsChange={mockOnSectionsChange}
        onSelectSection={mockOnSelectSection}
        selectedSection={null}
      />
    );

    const addButton = screen.getByText('Add Section');
    fireEvent.click(addButton);

    const newSections = mockOnSectionsChange.mock.calls[0][0];
    const newSection = newSections[0];

    expect(newSection.type).toBe('hero');
    expect(newSection.enabled).toBe(true);
    expect(newSection.order).toBe(0);
    expect(newSection.config.headline).toBe('New Section');
    expect(newSection.config.subheadline).toBe('Edit this section');
  });

  it('should not render empty state when sections exist', () => {
    render(
      <Canvas
        sections={mockSections}
        onSectionsChange={mockOnSectionsChange}
        onSelectSection={mockOnSelectSection}
        selectedSection={null}
      />
    );

    expect(screen.queryByText(/No sections yet/)).not.toBeInTheDocument();
  });
});
