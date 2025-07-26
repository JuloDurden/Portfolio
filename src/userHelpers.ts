import { PersonalData } from './pages/Dashboard/sections/PersonalData/types';
import { AboutData } from './pages/Dashboard/sections/About/types';

// 🎯 TYPES BACKEND (basés sur schéma MongoDB)
export interface BackendUserData {
  _id: string;
  personalData: {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string; // ISO string
    githubUrl: string;
    profilePicture?: string;
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
  };
  aboutParagraphs: string[]; // [intro, journey, goals]
  currentJob: string;
  hobbies: string[];
  avatar?: string; // URL ou base64
  lastUpdated: string; // ISO string
}

// 🎯 TYPES FRONTEND COMBINÉS
export interface FrontendUserData {
  id: string;
  personalData: PersonalData;
  aboutData: AboutData;
  avatar?: string;
}

// 🔄 TRANSFORMATION BACKEND → FRONTEND
export const transformToFrontend = (backendData: any): FrontendUserData => {
  console.log('🔍 backendData reçu:', backendData);
  
  if (!backendData) {
    throw new Error('backendData is undefined');
  }
  
  return {
    id: backendData._id,
    personalData: {
      id: backendData._id,
      firstName: backendData.firstName,           // ✅ Pas .personalData
      lastName: backendData.lastName,             // ✅ Pas .personalData
      email: backendData.email,                   // ✅ Pas .personalData
      dateOfBirth: backendData.dateOfBirth,       // ✅ Pas .personalData
      githubUrl: backendData.githubUrl,           // ✅ Pas .personalData
      profilePicture: backendData.profilePicture,
      createdAt: backendData.createdAt || new Date().toISOString(),
      updatedAt: backendData.updatedAt || new Date().toISOString(),
    },
    aboutData: {
      currentJob: backendData.currentJob || '',
      introductionParagraph: backendData.introductionParagraph || '',  // ✅ Pas aboutParagraphs
      journeyParagraph: backendData.journeyParagraph || '',            // ✅ Pas aboutParagraphs  
      goalsParagraph: backendData.goalsParagraph || '',                // ✅ Pas aboutParagraphs
      hobbies: backendData.hobbies || [],
      lastUpdated: backendData.updatedAt ? new Date(backendData.updatedAt) : undefined,
    },
    avatar: backendData.profilePicture,
  };
};

// 🔄 TRANSFORMATION FRONTEND → BACKEND (Personal Data)
export const transformPersonalDataToBackend = (personalData: PersonalData) => {
  return {
    firstName: personalData.firstName,
    lastName: personalData.lastName,
    email: personalData.email,
    dateOfBirth: personalData.dateOfBirth, // String to String
    githubUrl: personalData.githubUrl,
    profilePicture: personalData.profilePicture,
    updatedAt: new Date().toISOString(),
  };
};

// 🔄 TRANSFORMATION FRONTEND → BACKEND (About Data)
export const transformAboutDataToBackend = (aboutData: AboutData) => {
  return {
    currentJob: aboutData.currentJob,
    introductionParagraph: aboutData.introductionParagraph,  // ✅ Pas aboutParagraphs
    journeyParagraph: aboutData.journeyParagraph,            // ✅ Pas aboutParagraphs
    goalsParagraph: aboutData.goalsParagraph,                // ✅ Pas aboutParagraphs
    hobbies: aboutData.hobbies,
  };
};


// 🎯 VALIDATION HELPERS
export const validatePersonalData = (data: PersonalData): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.firstName.trim()) {
    errors.firstName = 'Le prénom est requis';
  } else if (data.firstName.length > 50) {
    errors.firstName = 'Le prénom ne peut pas dépasser 50 caractères';
  }

  if (!data.lastName.trim()) {
    errors.lastName = 'Le nom est requis';
  } else if (data.lastName.length > 50) {
    errors.lastName = 'Le nom ne peut pas dépasser 50 caractères';
  }

  if (!data.email.trim()) {
    errors.email = 'L\'email est requis';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Format d\'email invalide';
  }

  if (!data.dateOfBirth.trim()) {
    errors.dateOfBirth = 'La date de naissance est requise';
  } else {
    const date = new Date(data.dateOfBirth);
    const today = new Date();
    if (isNaN(date.getTime())) {
      errors.dateOfBirth = 'Format de date invalide';
    } else if (date > today) {
      errors.dateOfBirth = 'La date de naissance ne peut pas être dans le futur';
    }
  }

  if (!data.githubUrl.trim()) {
    errors.githubUrl = 'L\'URL GitHub est requise';
  } else if (!/^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/?$/.test(data.githubUrl)) {
    errors.githubUrl = 'Format d\'URL GitHub invalide';
  }

  return errors;
};

export const validateAboutData = (data: AboutData): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.currentJob.trim()) {
    errors.currentJob = 'Le métier actuel est requis';
  } else if (data.currentJob.length > 100) {
    errors.currentJob = 'Le métier ne peut pas dépasser 100 caractères';
  }

  if (!data.introductionParagraph.trim()) {
    errors.introductionParagraph = 'L\'introduction est requise';
  } else if (data.introductionParagraph.length > 500) {
    errors.introductionParagraph = 'L\'introduction ne peut pas dépasser 500 caractères';
  }

  if (!data.journeyParagraph.trim()) {
    errors.journeyParagraph = 'Le parcours est requis';
  } else if (data.journeyParagraph.length > 500) {
    errors.journeyParagraph = 'Le parcours ne peut pas dépasser 500 caractères';
  }

  if (!data.goalsParagraph.trim()) {
    errors.goalsParagraph = 'Les objectifs sont requis';
  } else if (data.goalsParagraph.length > 500) {
    errors.goalsParagraph = 'Les objectifs ne peuvent pas dépasser 500 caractères';
  }

  if (data.hobbies.length === 0) {
    errors.hobbies = 'Au moins un hobby est requis';
  }

  return errors;
};
