import React, { useState, ChangeEventHandler } from "react";
import { JobApplication } from "../types/jobApplication";

// initial state for form
const initialJobApplicationState: JobApplication = {
  dateSubmitted: new Date().toISOString().split("T")[0], // current date in YYYY-MM-DD format, type is a string rather than a Date object
  company: "",
  jobTitle: "",
  location: "",
  applicationStatus: "Submitted", // default status
  applicationType: "",
  resume: "", // filename or other details
  coverLetter: "", // yes or no or other details
  jobPostingURL: "",
  internalContactName: "",
  internalContactTitle: "",
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

  // state variable for showing modal
  const [showModal, setShowModal] = useState<boolean>(false);

  // update state when user types in input fields
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = event.target;
    if (type === "checkbox") {
      setJobApplication((prevState) => ({ ...prevState, [name]: checked }));
    } else {
      setJobApplication((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  // validate form errors
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Required field validation
    const requiredFields = [
      "company",
      "jobTitle",
      "location",
      "applicationType",
      "resume",
      "coverLetter",
      "jobPostingURL",
    ];
    requiredFields.forEach((field) => {
      if (!jobApplication[field].trim()) {
        newErrors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`;
      }
    });

    // Email format validation
    if (jobApplication.internalContactEmail) {
      if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
          jobApplication.internalContactEmail
        )
      ) {
        newErrors.internalContactEmail = "Invalid email format";
      }
    } else {
      // If the email field is blank, do not add an error (assuming it's optional)
      // If the email field is mandatory, you can add an error here
      // newErrors.internalContactEmail = 'Email is required';
    }

    // URL validation for jobPostingURL
    const urlFields = ["jobPostingURL"];
    urlFields.forEach((field) => {
      if (
        jobApplication[field] &&
        !/^https?:\/\/.+/.test(jobApplication[field])
      ) {
        newErrors[field] = `Invalid URL format for ${field}`;
      }
    });

    // Add more specific validation rules as needed for other fields

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // handle form submission and save data to local databbase
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      try {
        const response = await fetch("http://localhost:3001/save-application", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jobApplication),
        });

        if (response.ok) {
          // Reset the form to initial state
          setJobApplication(initialJobApplicationState);
          // Show modal
          setShowModal(true);
          // Hide modal after 3 seconds
          setTimeout(() => setShowModal(false), 3000);
        } else {
          console.log("Failed to save application");
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    } else {
      console.log("Validation errors", errors);
    }
  };

  // JSX for modal 
  const modal = (
    <div
      style={{
        display: showModal ? "block" : "none",
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "5px",
        boxShadow: "0px 0px 10px rgba(0,0,0,0.5)",
        color: "black",
      }}
    >
      <p>Application saved successfully!</p>
    </div>
  );

  return (
    // JSX form
    <>
      {modal}
      <div className="form-container">
        <h1>Job Application Form</h1>
        <h2>Enter Job Application Details Here</h2>
        <form onSubmit={handleSubmit}>
          {/* Company field */}
          <div>
            <label htmlFor="company">Company:</label>
            <input
              type="text"
              id="company"
              name="company"
              value={jobApplication.company}
              onChange={handleInputChange}
            />
            {errors.company && (
              <div style={{ color: "red" }}>{errors.company}</div>
            )}
          </div>

          {/* Job Title field */}
          <div>
            <label htmlFor="jobTitle">Job Title:</label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={jobApplication.jobTitle}
              onChange={handleInputChange}
            />
            {errors.jobTitle && (
              <div style={{ color: "red" }}>{errors.jobTitle}</div>
            )}
          </div>

          {/* Date Submitted field */}
          <div>
            <label htmlFor="dateSubmitted">Date Submitted:</label>
            <input
              type="date"
              id="dateSubmitted"
              name="dateSubmitted"
              value={jobApplication.dateSubmitted}
              onChange={handleInputChange}
            />
            {errors.dateSubmitted && (
              <div style={{ color: "red" }}>{errors.dateSubmitted}</div>
            )}
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
            {errors.location && (
              <div style={{ color: "red" }}>{errors.location}</div>
            )}
          </div>

          {/* Application Status field */}
          <div>
            <label htmlFor="applicationStatus">Application Status:</label>
            <select
              id="applicationStatus"
              name="applicationStatus"
              value={jobApplication.applicationStatus}
              onChange={handleInputChange}
            >
              <option value="Not Submitted">Not Submitted</option>
              <option value="Submitted">Submitted</option>
              <option value="Rejected">Rejected</option>
              <option value="Phone Screen">Phone Screen</option>
              <option value="Move to interview">Move to interview</option>
            </select>
            {errors.applicationStatus && (
              <div style={{ color: "red" }}>{errors.applicationStatus}</div>
            )}
          </div>

          {/* Application Type field */}
          <div>
            <label htmlFor="applicationType">Application Type:</label>
            <select
              id="applicationType"
              name="applicationType"
              value={jobApplication.applicationType}
              onChange={handleInputChange}
            >
              <option value="choose one">Choose One</option>
              <option value="LinkedIn Easy Apply">LinkedIn Easy Apply</option>
              <option value="Quick apply">Quick apply</option>
              <option value="Traditional">Traditional</option>
              <option value="Codesmith style">Codesmith style</option>
              <option value="Workday application">Workday application</option>
              <option value="Wellfound">Wellfound application</option>
              <option value="Dice">Dice application</option>
              <option value="Other company system">Other company system</option>
              <option value="Other">Other</option>
            </select>
            {errors.applicationType && (
              <div style={{ color: "red" }}>{errors.applicationType}</div>
            )}
          </div>

          {/* Resume field */}
          <div>
            <label htmlFor="resume">Resume Version:</label>
            <input
              type="text"
              id="resume"
              name="resume"
              value={jobApplication.resume}
              onChange={handleInputChange}
            />
            {errors.resume && (
              <div style={{ color: "red" }}>{errors.resume}</div>
            )}
          </div>

          {/* Cover Letter field */}
          <div>
            <label htmlFor="coverLetter">
              Cover Letter? (n/a or filename if included):
            </label>
            <input
              type="text"
              id="coverLetter"
              name="coverLetter"
              value={jobApplication.coverLetter}
              onChange={handleInputChange}
            />
            {errors.coverLetter && (
              <div style={{ color: "red" }}>{errors.coverLetter}</div>
            )}
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
            {errors.jobPostingURL && (
              <div style={{ color: "red" }}>{errors.jobPostingURL}</div>
            )}
          </div>

          {/* Internal Contact Name field */}
          <div>
            <label htmlFor="internalContactName">Internal Contact Name:</label>
            <input
              type="text"
              id="internalContactName"
              name="internalContactName"
              value={jobApplication.internalContactName}
              onChange={handleInputChange}
            />
            {/* Display error message if any */}
          </div>

          {/* Internal Contact Title field */}
          <div>
            <label htmlFor="internalContactTitle">
              Internal Contact Title:
            </label>
            <input
              type="text"
              id="internalContactTitle"
              name="internalContactTitle"
              value={jobApplication.internalContactTitle}
              onChange={handleInputChange}
            />
            {/* Display error message if any */}
          </div>

          {/* Internal Contact Email field */}
          <div>
            <label htmlFor="internalContactEmail">
              Internal Contact Email:
            </label>
            <input
              type="text"
              id="internalContactEmail"
              name="internalContactEmail"
              value={jobApplication.internalContactEmail}
              onChange={handleInputChange}
            />
            {errors.internalContactEmail && (
              <div style={{ color: "red" }}>{errors.internalContactEmail}</div>
            )}
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
            {/* No validation error for checkbox typically */}
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
      </div>
    </>
  );
};

export default JobForm;
