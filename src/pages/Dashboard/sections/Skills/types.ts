export interface Skill {
  id: string;
  name: string;
  description: string;
  level: number; // 0-100
  icon: string; // URL ou upload
  categories: string[];
}

export interface SkillFormData {
  name: string;
  description: string;
  level: number;
  icon: string;
  categories: string[];
}

export interface SkillsGrouped {
  [category: string]: Skill[];
}
