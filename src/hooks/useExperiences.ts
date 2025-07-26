import { useState, useEffect, useMemo } from 'react';
import { API_BASE_URL, getAuthHeaders, getAuthHeadersForFormData } from '../config/api';
import { 
  Experience, 
  ExperienceFormData,
  ExperiencesStats 
} from '../pages/Dashboard/sections/Experiences/types';

// ====================================
// 🔄 MAPPING FRONTEND ↔ BACKEND
// ====================================

// Frontend → Backend
const mapToBackend = (data: ExperienceFormData) => {
  const formData = new FormData();
  
  // Mapping exact selon ton modèle backend
  formData.append('type', data.type === 'experience' ? 'work' : 'education');
  formData.append('position', data.title); // title → position
  formData.append('company', data.company);
  formData.append('location', data.location);
  formData.append('startDate', data.startDate);
  
  // ❌ ATTENTION: le backend n'a pas isCurrentlyActive !
  // formData.append('isCurrentlyActive', data.isCurrentlyActive.toString());
  
  // Arrays → JSON strings (ton backend les attend comme ça)
  formData.append('description', JSON.stringify(data.description));
  formData.append('technologies', JSON.stringify(data.technologies));
  
  if (data.endDate && !data.isCurrentlyActive) {
    formData.append('endDate', data.endDate);
  }
  // Si isCurrentlyActive = true, on n'envoie pas endDate
  
  // Photo OBLIGATOIRE selon ton modèle
  if (data.photoFile) {
    formData.append('image', data.photoFile); // photoFile → image
  }
  
  return formData;
};

// Backend → Frontend - 🚨 PARSING FORCÉ
const mapFromBackend = (backendExp: any): Experience => {
  
  // Helper pour parser les arrays mal formés
  const parseArrayField = (field: any): string[] => {
    
    if (!field) return [];
    
    // Si c'est déjà un array de strings normaux
    if (Array.isArray(field) && field.length > 0 && typeof field[0] === 'string') {
      // Si le premier élément commence par [ c'est du JSON
      if (field[0].startsWith('[')) {
        try {
          return JSON.parse(field[0]);
        } catch {
          return field;
        }
      }
      return field;
    }
    
    // Si c'est un string JSON
    if (typeof field === 'string' && field.startsWith('[')) {
      try {
        return JSON.parse(field);
      } catch {
        return [field];
      }
    }
    
    return Array.isArray(field) ? field : [];
  };

  return {
    id: backendExp._id || backendExp.id,
    type: backendExp.type === 'work' ? 'experience' : 'formation',
    title: backendExp.position,
    company: backendExp.company || '',
    location: backendExp.location,
    startDate: backendExp.startDate,
    endDate: backendExp.endDate,
    isCurrentlyActive: !backendExp.endDate,
    
    // 🚨 PARSING FORCÉ
    description: parseArrayField(backendExp.description),
    technologies: parseArrayField(backendExp.technologies),
    
    photo: backendExp.image ? `${API_BASE_URL}/uploads/${backendExp.image}` : null,
    createdAt: backendExp.createdAt,
    updatedAt: backendExp.updatedAt
  };
};

// ====================================
// 🪝 HOOK PRINCIPAL
// ====================================

const useExperiences = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ====================================
  // 📊 STATS CALCULÉES
  // ====================================
  const stats = useMemo((): ExperiencesStats => {
    const totalExperiences = experiences.filter(exp => exp.type === 'experience').length;
    const totalFormations = experiences.filter(exp => exp.type === 'formation').length;
    const activeExperiences = experiences.filter(exp => exp.isCurrentlyActive).length;
    
    return {
      totalExperiences,
      totalFormations,
      totalCount: experiences.length,
      activeExperiences
    };
  }, [experiences]);

  // ====================================
  // 🔄 CHARGEMENT INITIAL
  // ====================================
  const fetchExperiences = async () => {
    setLoading(true);
    setError(null);
    
    try { 
      const response = await fetch(`${API_BASE_URL}/api/experiences`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        const mappedExperiences = result.data.map(mapFromBackend);
        setExperiences(mappedExperiences);
      } else {
        throw new Error(result.message || 'Erreur lors du chargement');
      }
    } catch (err) {
      console.error('❌ Erreur fetchExperiences:', err);
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  // ====================================
  // ➕ CRÉER UNE EXPÉRIENCE
  // ====================================
  const createExperience = async (data: ExperienceFormData): Promise<Experience> => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = mapToBackend(data);
      
      const response = await fetch(`${API_BASE_URL}/api/experiences`, {
        method: 'POST',
        headers: getAuthHeadersForFormData(),
        body: formData
      });
            
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Create error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Erreur lors de la création');
      }
      
      const newExperience = mapFromBackend(result.data);
      
      // Recharger la liste complète
      await fetchExperiences();
      
      return newExperience;
    } catch (err) {
      console.error('❌ Erreur createExperience:', err);
      const errorMsg = err instanceof Error ? err.message : 'Erreur de création';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ====================================
  // ✏️ MODIFIER UNE EXPÉRIENCE
  // ====================================
  const updateExperience = async (id: string, data: ExperienceFormData): Promise<Experience> => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = mapToBackend(data);
      
      const response = await fetch(`${API_BASE_URL}/api/experiences/${id}`, {
        method: 'PUT',
        headers: getAuthHeadersForFormData(),
        body: formData
      });
            
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Update error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Erreur lors de la modification');
      }
      
      const updatedExperience = mapFromBackend(result.data);
      setExperiences(prev => 
        prev.map(exp => exp.id === id ? updatedExperience : exp)
      );
      
      return updatedExperience;
    } catch (err) {
      console.error('❌ Erreur updateExperience:', err);
      const errorMsg = err instanceof Error ? err.message : 'Erreur de modification';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ====================================
  // 🗑️ SUPPRIMER UNE EXPÉRIENCE
  // ====================================
  const deleteExperience = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      
      const response = await fetch(`${API_BASE_URL}/api/experiences/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
            
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Delete error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Erreur lors de la suppression');
      }
      
      setExperiences(prev => prev.filter(exp => exp.id !== id));
    } catch (err) {
      console.error('❌ Erreur deleteExperience:', err);
      const errorMsg = err instanceof Error ? err.message : 'Erreur de suppression';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ====================================
  // 🚀 CHARGEMENT INITIAL
  // ====================================
  useEffect(() => {
    fetchExperiences();
  }, []);

  return {
    // States
    experiences,
    loading,
    error,
    stats,
    
    // Actions
    createExperience,
    updateExperience,
    deleteExperience,
    refetch: fetchExperiences,
    
    // Utils
    clearError: () => setError(null)
  };
};

export default useExperiences;
