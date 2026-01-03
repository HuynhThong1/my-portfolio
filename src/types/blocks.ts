export type BlockType =
  | 'hero'
  | 'about'
  | 'skills'
  | 'projects'
  | 'projects-grid'
  | 'experience'
  | 'education'
  | 'contact'
  | 'contact-cta'
  | 'custom';

export interface BlockDefinition {
  type: BlockType;
  name: string;
  icon: string;
  defaultProps: Record<string, any>;
  editableProps: PropDefinition[];
}

export interface PropDefinition {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'select' | 'color' | 'image';
  options?: { label: string; value: string }[];
  defaultValue?: any;
}

export interface DragItem {
  id: string;
  type: BlockType;
  order: number;
}
