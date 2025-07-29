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
  
  // Mapping exact selon modèle backend
  formData.append('type', data.type === 'experience' ? 'work' : 'education');
  formData.append('position', data.title); // title → position
  formData.append('company', data.company);
  formData.append('location', data.location);
  formData.append('startDate', data.startDate);
  
  // ✅ CORRECTION : Arrays comme éléments séparés (pas JSON.stringify)
  data.description.forEach((desc, index) => {
    formData.append(`description[${index}]`, desc);
  });
  
  data.technologies.forEach((tech, index) => {
    formData.append(`technologies[${index}]`, tech);
  });
  
  if (data.endDate && !data.isCurrentlyActive) {
    formData.append('endDate', data.endDate);
  }
  // Si isCurrentlyActive = true, on n'envoie pas endDate
  
  // Photo OBLIGATOIRE selon modèle
  if (data.photoFile) {
    formData.append('image', data.photoFile); // photoFile → image
  }
  
  return formData;
};

// ✅ HELPER : Convertir FormData en ExperienceFormData
const formDataToExperienceFormData = (formData: FormData): ExperienceFormData => {
  // Récupérer les descriptions
  const descriptions: string[] = [];
  let i = 0;
  while (formData.get(`description[${i}]`) !== null) {
    const desc = formData.get(`description[${i}]`) as string;
    if (desc && desc.trim()) descriptions.push(desc.trim());
    i++;
  }

  // Récupérer les technologies
  const technologies: string[] = [];
  i = 0;
  while (formData.get(`technologies[${i}]`) !== null) {
    const tech = formData.get(`technologies[${i}]`) as string;
    if (tech && tech.trim()) technologies.push(tech.trim());
    i++;
  }

  // Construire l'objet ExperienceFormData
  const experienceData: ExperienceFormData = {
    type: (formData.get('type') as string) === 'work' ? 'experience' : 'formation',
    title: formData.get('position') as string || '',
    company: formData.get('company') as string || '',
    location: formData.get('location') as string || '',
    startDate: formData.get('startDate') as string || '',
    endDate: formData.get('endDate') as string || '',
    isCurrentlyActive: !formData.get('endDate') || (formData.get('endDate') as string).trim() === '',
    description: descriptions,
    technologies: technologies,
    photoFile: formData.get('image') as File || null
  };

  return experienceData;
};

// ✅ CORRECTION : mapToBackendUpdate pour les modifications (ENVOIE TOUS LES CHAMPS)
const mapToBackendUpdate = (data: ExperienceFormData) => {
  const formData = new FormData();
  
  // ✅ ENVOYER TOUS LES CHAMPS POUR LA MODIFICATION
  formData.append('type', data.type === 'experience' ? 'work' : 'education');
  formData.append('position', data.title);
  formData.append('company', data.company || ''); // Peut être vide
  formData.append('location', data.location || '');
  formData.append('startDate', data.startDate);
  
  // ✅ EndDate : soit une date, soit vide pour "en cours"
  if (data.endDate && !data.isCurrentlyActive) {
    formData.append('endDate', data.endDate);
  } else {
    formData.append('endDate', ''); // Sera interprété comme null côté serveur
  }
  
  // ✅ Arrays : tous les éléments même si inchangés
  if (data.description && data.description.length > 0) {
    data.description.forEach((desc, index) => {
      formData.append(`description[${index}]`, desc || '');
    });
  }
  
  if (data.technologies && data.technologies.length > 0) {
    data.technologies.forEach((tech, index) => {
      formData.append(`technologies[${index}]`, tech || '');
    });
  }
  
  // ✅ Image seulement si nouvelle
  if (data.photoFile) {
    formData.append('image', data.photoFile);
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
    
    // ✅ CORRECTION : URL DIRECTE CLOUDINARY
    photo: backendExp.image || null,
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
  const createExperience = async (formData: FormData): Promise<Experience> => {
    console.log('📤 Envoi création expérience...');
    
    // ✅ LOGS POUR DEBUG
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`📁 ${key}:`, value.name, value.type, value.size);
      } else {
        console.log(`📝 ${key}:`, value);
      }
    }

    // ✅ CORRECTION : Utilise getAuthHeadersForFormData()
    const response = await fetch(`${API_BASE_URL}/api/experiences`, {
      method: 'POST',
      headers: getAuthHeadersForFormData(),
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      console.log('❌ Create error response:', error);
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(error)}`);
    }

    const result = await response.json();
    console.log('✅ Expérience créée:', result);
    
    // ✅ MAP LA RÉPONSE ET AJOUTE À LA LISTE
    const newExperience = mapFromBackend(result.data);
    setExperiences(prev => [...prev, newExperience]);
    
    return newExperience;
  };

  // ====================================
  // ✏️ MODIFIER UNE EXPÉRIENCE - ✅ CORRIGÉ POUR ACCEPTER FormData ET ExperienceFormData
  // ====================================
  const updateExperience = async (id: string, data: ExperienceFormData | FormData): Promise<Experience> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Modification expérience avec données:', data);
      
      // ✅ Gérer les deux cas : ExperienceFormData ou FormData
      let formData: FormData;
      
      if (data instanceof FormData) {
        // ✅ C'est déjà du FormData, on l'utilise directement
        formData = data;
        console.log('📤 FormData reçu directement pour update');
      } else {
        // ✅ C'est du ExperienceFormData, on le convertit
        formData = mapToBackendUpdate(data);
        console.log('📤 ExperienceFormData converti en FormData pour update');
      }
      
      // ✅ DEBUG : Voir ce qui est envoyé
      console.log('📤 FormData envoyé pour update:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`📁 ${key}:`, value.name, value.type, value.size);
        } else {
          console.log(`📝 ${key}:`, value);
        }
      }
      
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
      console.log('✅ Expérience modifiée:', result);
      
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
    clearError: () => setError(null),
    
    // ✅ HELPER EXPORTÉ
    formDataToExperienceFormData
  };
};

export default useExperiences;
