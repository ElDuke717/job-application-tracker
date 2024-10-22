import './JobForm.css';
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Footer from './Footer';

// Initial state for form
const initialJobApplicationState = {
  dateSubmitted: new Date().toISOString().split("T")[0], // current date in YYYY-MM-DD format
  updatedDate: "",
  id: "", 
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
  const [jobApplication, setJobApplication] = useState(initialJobApplicationState);

  // state variable for form errors
  const [errors, setErrors] = useState({});

  // state variable for showing modal
  const [showModal, setShowModal] = useState(false);

  // Update state when user types in input fields
  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === "checkbox") {
      setJobApplication((prevState) => ({ ...prevState, [name]: checked }));
    } else {
      setJobApplication((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  // Validate form errors
  const validateForm = () => {
    const newErrors = {};

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
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    // Email format validation
    if (jobApplication.internalContactEmail) {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (!emailRegex.test(jobApplication.internalContactEmail)) {
        newErrors.internalContactEmail = "Invalid email format";
      }
    }

    // URL validation for jobPostingURL
    const urlFields = ["jobPostingURL"];
    urlFields.forEach((field) => {
      if (jobApplication[field] && !/^https?:\/\/.+/.test(jobApplication[field])) {
        newErrors[field] = `Invalid URL format for ${field}`;
      }
    });

    // Add more specific validation rules as needed for other fields

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission and save data to local database
  const handleSubmit = async (event) => {
    event.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      try {
        const response = await fetch("http://localhost:3001/save-application", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...jobApplication, id: uuidv4() }), // Generate a new UUID for each submission
        });
  
        if (response.ok) {
          // Reset the form to initial state and generate a new UUID
          setJobApplication({ ...initialJobApplicationState, id: uuidv4() });
          // Show modal
          setShowModal(true);
          // Hide modal after 3 seconds
          setTimeout(() => setShowModal(false), 3000);
        } else {
          console.log("Failed to save application");
          // Optionally, set an error state here to inform the user
        }
      } catch (error) {
        console.error("Network error:", error);
        // Optionally, set an error state here to inform the user
      }
    } else {
      console.log("Validation errors", errors);
      // Optionally, you can focus the first error field or scroll to the error messages
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
        zIndex: 1000, // Ensure the modal appears above other elements
      }}
    >
      <p>Application saved successfully!</p>
    </div>
  );

  return (
    <>
      {modal}
      <div className="application-form form-container">
        <h1 className="form-title">Job Application Form</h1>
        <h2 className="component-subtitle">Enter Job Application Details Here</h2>
        <form onSubmit={handleSubmit}>
          {/* Company field */}
          <div className="form-group">
            <label htmlFor="company">Company:</label>
            <input
              type="text"
              id="company"
              name="company"
              value={jobApplication.company}
              onChange={handleInputChange}
              className={errors.company ? "input-error" : ""}
            />
            {errors.company && (
              <div className="error-message">{errors.company}</div>
            )}
          </div>

          {/* Job Title field */}
          <div className="form-group">
            <label htmlFor="jobTitle">Job Title:</label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={jobApplication.jobTitle}
              onChange={handleInputChange}
              className={errors.jobTitle ? "input-error" : ""}
            />
            {errors.jobTitle && (
              <div className="error-message">{errors.jobTitle}</div>
            )}
          </div>

          {/* Date Submitted field */}
          <div className="form-group">
            <label htmlFor="dateSubmitted">Date Submitted:</label>
            <input
              type="date"
              id="dateSubmitted"
              name="dateSubmitted"
              value={jobApplication.dateSubmitted}
              onChange={handleInputChange}
              className={errors.dateSubmitted ? "input-error" : ""}
            />
            {errors.dateSubmitted && (
              <div className="error-message">{errors.dateSubmitted}</div>
            )}
          </div>

          {/* Location field */}
          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={jobApplication.location}
              onChange={handleInputChange}
              className={errors.location ? "input-error" : ""}
            />
            {errors.location && (
              <div className="error-message">{errors.location}</div>
            )}
          </div>

          {/* Application Status field */}
          <div className="form-group">
            <label htmlFor="applicationStatus">Application Status:</label>
            <select
              id="applicationStatus"
              name="applicationStatus"
              className="drop-down"
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
              <div className="error-message">{errors.applicationStatus}</div>
            )}
          </div>

          {/* Application Type field */}
          <div className="form-group">
            <label htmlFor="applicationType">Application Type:</label>
            <select
              id="applicationType"
              name="applicationType"
              className="drop-down"
              value={jobApplication.applicationType}
              onChange={handleInputChange}
            >
              <option value="">Choose One</option>
              <option value="LinkedIn Easy Apply">LinkedIn Easy Apply</option>
              <option value="Quick apply">Quick apply</option>
              <option value="Traditional">Traditional</option>
              <option value="Codesmith style">Codesmith style</option>
              <option value="Workday application">Workday</option>
              <option value="Greenhouse application">Greenhouse</option>
              <option value="Wellfound">Wellfound</option>
              <option value="Dice">Dice</option>
              <option value="Y-combinator">Y-combinator</option>
              <option value="Lever">Lever</option>
              <option value="TechFetch">TechFetch</option>
              <option value="BreezyHR">BreezyHR</option>
              <option value="Ashby">Ashby</option>
              <option value="Indeed">Indeed</option>
              <option value="Otta">Otta</option>
              <option value="Ziprecruiter">Ziprecruiter</option>
              <option value="Other company system">Other company system</option>
              <option value="Other">Other</option>
            </select>
            {errors.applicationType && (
              <div className="error-message">{errors.applicationType}</div>
            )}
          </div>

          {/* Resume field */}
          <div className="form-group">
            <label htmlFor="resume">Resume Version:</label>
            <input
              type="text"
              id="resume"
              name="resume"
              value={jobApplication.resume}
              onChange={handleInputChange}
              className={errors.resume ? "input-error" : ""}
            />
            {errors.resume && (
              <div className="error-message">{errors.resume}</div>
            )}
          </div>

          {/* Cover Letter field */}
          <div className="form-group">
            <label htmlFor="coverLetter">
              Cover Letter? (n/a or filename if included):
            </label>
            <input
              type="text"
              id="coverLetter"
              name="coverLetter"
              value={jobApplication.coverLetter}
              onChange={handleInputChange}
              className={errors.coverLetter ? "input-error" : ""}
            />
            {errors.coverLetter && (
              <div className="error-message">{errors.coverLetter}</div>
            )}
          </div>

          {/* Job Posting URL field */}
          <div className="form-group">
            <label htmlFor="jobPostingURL">Job Posting URL:</label>
            <input
              type="text"
              id="jobPostingURL"
              name="jobPostingURL"
              value={jobApplication.jobPostingURL}
              onChange={handleInputChange}
              className={errors.jobPostingURL ? "input-error" : ""}
            />
            {errors.jobPostingURL && (
              <div className="error-message">{errors.jobPostingURL}</div>
            )}
          </div>

          {/* Internal Contact Name field */}
          <div className="form-group">
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
          <div className="form-group">
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
          <div className="form-group">
            <label htmlFor="internalContactEmail">
              Internal Contact Email:
            </label>
            <input
              type="email"
              id="internalContactEmail"
              name="internalContactEmail"
              value={jobApplication.internalContactEmail}
              onChange={handleInputChange}
              className={errors.internalContactEmail ? "input-error" : ""}
            />
            {errors.internalContactEmail && (
              <div className="error-message">{errors.internalContactEmail}</div>
            )}
          </div>

          {/* Double Down field */}
          <div className="form-group checkbox-group">
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
          <div className="form-group">
            <label htmlFor="notesComments">Notes/Comments:</label>
            <textarea
              id="notesComments"
              name="notesComments"
              className="notes-textarea"
              value={jobApplication.notesComments}
              onChange={handleInputChange}
            />
          </div>

          <button className="submit-button" type="submit">Submit</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default JobForm;