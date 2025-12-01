export enum Category {
  GENERAL = 'General',
  CHILDHOOD = 'Childhood',
  ROMANCE = 'Romance',
  CAREER = 'Career',
  TRAVEL = 'Travel',
  FAMILY = 'Family',
  LESSONS = 'Life Lessons'
}

export interface Comment {
  id: string;
  author: string;
  relation: string; // e.g., "Granddaughter", "Best Friend"
  text: string;
  timestamp: number;
}

export interface JournalEntry {
  id: string;
  text: string;
  date: string; // YYYY-MM-DD
  category: Category;
  imageUrl?: string;
  timestamp: any; // Firestore timestamp
  comments: Comment[];
  isAiPrompted?: boolean;
}

export interface UserProfile {
  uid: string;
  isAnonymous: boolean;
}

export type ViewMode = 'timeline' | 'story';
