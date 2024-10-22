export interface JobApplication {
  age: ReactNode;
  dateSubmitted: string;
  company: string;
  jobTitle: string;
  location: string;
  applicationStatus: string;
  applicationType: string;
  resume: string; // filename
  coverLetter: string; // yes or no
  jobPostingURL: string;
  internalContactName: string;
  internalContactTitle: string;
  internalContactEmail: string;
  doubleDown: boolean;
  notesComments: string;
}
