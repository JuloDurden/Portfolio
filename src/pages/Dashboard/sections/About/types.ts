export interface AboutData {
  currentJob: string;
  introductionParagraph: string;
  journeyParagraph: string;
  goalsParagraph: string;
  hobbies: string[];
}

export interface AboutValidationErrors {
  currentJob?: string;
  introductionParagraph?: string;
  journeyParagraph?: string;
  goalsParagraph?: string;
  hobbies?: string;
}

