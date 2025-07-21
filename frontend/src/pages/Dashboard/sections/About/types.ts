export interface AboutData {
  currentJob: string;
  introductionParagraph: string;
  journeyParagraph: string;
  goalsParagraph: string;
  hobbies: string[];
  lastUpdated?: Date;
}

export interface AboutFormState extends AboutData {
  isModified: boolean;
  validationErrors: AboutValidationErrors;
}

export interface AboutValidationErrors {
  currentJob?: string;
  introductionParagraph?: string;
  journeyParagraph?: string;
  goalsParagraph?: string;
  hobbies?: string;
}
