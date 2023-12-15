import React, { useState, ChangeEventHandler } from "react";
import { JobApplication } from "../types/jobApplication";

// initial state for form
const initialJobApplicationState: JobApplication = {
  dateSubmitted: new Date().toISOString().split("T")[0], // current date in YYYY-MM-DD format, type is a string rather than a Date object
  company: "",
  jobTitle: "",
  location: "",
  applicationStatus: "Not Submitted", // default status
  applicationType: "",
  resume: "", // URL or file path
  coverLetter: "", // URL or file path
  jobPostingURL: "",
  internalContact: {
    name: "",
    title: "",
  },
  internalContactEmail: "",
  doubleDown: false,
  notesComments: "",
};


// JobForm component
const JobForm = () => {
  // jobApplication state variable
    const [jobApplication, setJobApplication] = useState<JobApplication>(
    initialJobApplicationState
  );

  // state variable for form errors
const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // update state when user types in input fields
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target as HTMLInputElement | HTMLTextAreaElement;
    const checked = type === "checkbox" ? (event.target as HTMLInputElement).checked : false;

    if (type === "checkbox") {
      setJobApplication(prevState => ({ ...prevState, [name]: checked }));
    } else if (name === "internalContactName" || name === "internalContactTitle") {
      const field = name === "internalContactName" ? "name" : "title";
      setJobApplication(prevState => ({
        ...prevState,
        internalContact: {
          ...prevState.internalContact,
          [field]: value,
        },
      }));
    } else {
      setJobApplication(prevState => ({ ...prevState, [name]: value }));
    }
  };

  // validate form errors
const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
  
    // Required field validation
    const requiredFields = ['company', 'jobTitle', 'location', 'applicationType', 'resume', 'coverLetter', 'jobPostingURL' ];
    requiredFields.forEach(field => {
      if (!jobApplication[field].trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });
  
    // Email format validation
    if (jobApplication.internalContactEmail && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(jobApplication.internalContactEmail)) {
      newErrors.internalContactEmail = 'Invalid email format';
    }
  
    // URL validation for jobPostingURL
    const urlFields = ['jobPostingURL'];
    urlFields.forEach(field => {
      if (jobApplication[field] && !/^https?:\/\/.+/.test(jobApplication[field])) {
        newErrors[field] = `Invalid URL format for ${field}`;
      }
    });
  
    // Add more specific validation rules as needed for other fields
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      console.log(jobApplication);
      // Proceed with submitting data
    } else {
      console.log("Validation errors", errors);
      // Handle the display of validation errors
    }
  };
  

  return (
    // JSX form
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="company">Company:</label>
        <input
          type="text"
          id="company"
          name="company"
          value={jobApplication.company}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label htmlFor="dateSubmitted">Date Submitted:</label>
        <input
          type="date"
          id="dateSubmitted"
          name="dateSubmitted"
          value={jobApplication.dateSubmitted}
          onChange={handleInputChange}
        />
      </div>

      {/* Location field */}
      <div>
        <label htmlFor="location">Location:</label>
        <input
          type="text"
          id="location"
          name="location"
          value={jobApplication.location}
          onChange={handleInputChange}
        />
      </div>

      {/* Application Status field */}
      <div>
        <label htmlFor="applicationStatus">Application Status:</label>
        <input
          type="text"
          id="applicationStatus"
          name="applicationStatus"
          value={jobApplication.applicationStatus}
          onChange={handleInputChange}
        />
      </div>

      {/* Application Type field */}
      <div>
        <label htmlFor="applicationType">Application Type:</label>
        <input
          type="text"
          id="applicationType"
          name="applicationType"
          value={jobApplication.applicationType}
          onChange={handleInputChange}
        />
      </div>

      {/* Resume field */}
      <div>
        <label htmlFor="resume">Resume (URL/File Path):</label>
        <input
          type="text"
          id="resume"
          name="resume"
          value={jobApplication.resume}
          onChange={handleInputChange}
        />
      </div>

      {/* Cover Letter field */}
      <div>
        <label htmlFor="coverLetter">Cover Letter (URL/File Path):</label>
        <input
          type="text"
          id="coverLetter"
          name="coverLetter"
          value={jobApplication.coverLetter}
          onChange={handleInputChange}
        />
      </div>

      {/* Job Posting URL field */}
      <div>
        <label htmlFor="jobPostingURL">Job Posting URL:</label>
        <input
          type="text"
          id="jobPostingURL"
          name="jobPostingURL"
          value={jobApplication.jobPostingURL}
          onChange={handleInputChange}
        />
      </div>

      {/* Internal Contact Name field */}
      <div>
        <label htmlFor="internalContactName">Internal Contact Name:</label>
        <input
          type="text"
          id="internalContactName"
          name="internalContactName" // Adjusted name attribute
          value={jobApplication.internalContact?.name}
          onChange={handleInputChange}
        />
      </div>

      {/* Internal Contact Title field */}
      <div>
        <label htmlFor="internalContactTitle">Internal Contact Title:</label>
        <input
          type="text"
          id="internalContactTitle"
          name="internalContactTitle" // Adjusted name attribute
          value={jobApplication.internalContact?.title}
          onChange={handleInputChange}
        />
      </div>

      {/* Internal Contact Email field */}
      <div>
        <label htmlFor="internalContactEmail">Internal Contact Email:</label>
        <input
          type="text"
          id="internalContactEmail"
          name="internalContactEmail"
          value={jobApplication.internalContactEmail}
          onChange={handleInputChange}
        />
      </div>

      {/* Double Down field */}
      <div>
        <label htmlFor="doubleDown">Double Down:</label>
        <input
          type="checkbox"
          id="doubleDown"
          name="doubleDown"
          checked={jobApplication.doubleDown}
          onChange={handleInputChange}
        />
      </div>

      {/* Notes/Comments field */}
      <div>
        <label htmlFor="notesComments">Notes/Comments:</label>
        <textarea
          id="notesComments"
          name="notesComments"
          value={jobApplication.notesComments}
          onChange={
            handleInputChange as unknown as ChangeEventHandler<HTMLTextAreaElement>
          }
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default JobForm;
