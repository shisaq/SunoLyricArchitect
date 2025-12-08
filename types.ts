
export type Language = 'en' | 'zh';

export interface Translation {
  en: string;
  zh: string;
}

export interface SongBlock {
  id: string;
  type: string; // e.g., '[Verse]', '[Chorus]'
  tags: string[]; // e.g., ['[Mood: Happy]']
  lines: string; // The actual lyrics
}

export interface SongState {
  globalTags: string[];
  blocks: SongBlock[];
}

export interface TemplatePayload {
  globalTags: string[];
  blocks: Omit<SongBlock, 'id'>[];
}

export interface TagDefinition {
  id: string;
  tag: string;
  label: Translation;
  description: Translation;
  category: TagCategory;
  templatePayload?: TemplatePayload; // For templates
}

export enum TagCategory {
  STRUCTURE = 'structure',
  VOCAL = 'vocal',
  MOOD = 'mood',
  INSTRUMENT = 'instrument',
  GENRE = 'genre',
  TEMPLATE = 'template'
}

export interface CategoryMeta {
  id: TagCategory;
  name: Translation;
  icon: string;
  description: Translation;
}

export interface DragItem {
  tag: string;
  category: TagCategory;
  id: string;
  payload?: TemplatePayload;
}
