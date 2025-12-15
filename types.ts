export interface SlideContent {
  id: number;
  title: string;
  subtitle?: string;
  points: string[];
  type: 'cover' | 'content' | 'section' | 'list';
  icon?: string;
}

export enum SlideType {
  COVER = 'cover',
  CONTENT = 'content',
  SECTION = 'section',
  LIST = 'list',
}