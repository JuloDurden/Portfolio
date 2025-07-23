export interface TimelineItem {
  id: number;
  title: string;
  content: string;
  icon?: string; // Pour les emojis ou icônes
  image?: string; // Pour About uniquement
}

export interface ScrollTimelineProps {
  title: string; // "Mon processus" ou "Mon parcours"
  items: TimelineItem[];
  showImages?: boolean; // false pour Home, true pour About
  theme?: 'light' | 'dark';
  className?: string;
}