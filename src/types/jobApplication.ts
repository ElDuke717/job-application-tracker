export interface JobApplication {
  dateSubmitted: string;
  company: string;
  jobTitle: string;
  location: string;
  applicationStatus: string;
  applicationType: string;
  resume: string; // URL or file path
  coverLetter: string; // URL or file path
  jobPostingURL: string;
  internalContact: {
    name: string;
    title: string;
  };
  internalContactEmail: string;
  doubleDown: boolean;
  notesComments: string;
}
