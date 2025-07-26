import { useState, useEffect } from 'react';

interface Skill {
  _id: string;
  id: string;
  name: string;
  description: string;
  level: string;
  icon: string;
  categories: string[];
  isVisible: boolean;
  order: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UseSkillsReturn {
  skills: Skill[];
  skillsCount: number;
  visibleSkills: Skill[];
  visibleSkillsCount: number;
  featuredSkills: Skill[];
  skillsByCategory: Record<string, Skill[]>;
  loading: boolean;
  error: string | null;
  refetchSkills: () => void;
}

export const useSkills = (autoRefresh = false): UseSkillsReturn => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching skills...');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/skills`);
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Skills fetchées:', data);
      
      if (data.success && data.data) {
        // Trier par ordre puis par nom
        const sortedSkills = data.data.sort((a: Skill, b: Skill) => {
          if (a.order !== b.order) return a.order - b.order;
          return a.name.localeCompare(b.name);
        });
        setSkills(sortedSkills);
        setError(null);
      } else {
        throw new Error('Format de réponse invalide');
      }
    } catch (err) {
      console.error('❌ Erreur fetch skills:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // 🔄 Auto-refresh toutes les 30 secondes si demandé
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchSkills();
      }, 30000); // 30 secondes

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // 🎯 DONNÉES CALCULÉES
  const visibleSkills = skills.filter(skill => skill.isVisible);
  const featuredSkills = skills.filter(skill => skill.featured && skill.isVisible);
  
  const skillsByCategory = skills.reduce((acc, skill) => {
    skill.categories.forEach(category => {
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill);
    });
    return acc;
  }, {} as Record<string, Skill[]>);

  return {
    skills,
    skillsCount: skills.length,
    visibleSkills,
    visibleSkillsCount: visibleSkills.length,
    featuredSkills,
    skillsByCategory,
    loading,
    error,
    refetchSkills: fetchSkills
  };
};
