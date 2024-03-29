import React, { useState, useEffect } from "react";
import { JobApplication } from "../types/jobApplication";
import getApplicationAgeInDays from "../utils/getApplicationAgeInDays";
import Footer from "./Footer";

const JobList = () => {
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingApplication, setEditingApplication] =
    useState<JobApplication | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleEditClick = (application) => {
    setEditingApplication(application);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingApplication(null);
  };

  const handleSaveChanges = async (updatedApplication) => {
    try {
      const response = await fetch(
        `http://localhost:3001/update-application/${updatedApplication.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedApplication),
        }
      );
      if (response.ok) {
        const updatedApplications = jobApplications.map((app) =>
          app.id === updatedApplication.id ? updatedApplication : app
        );
        setJobApplications(updatedApplications);
      } else {
        console.error("Error saving job application:", response);
      }
    } catch (error) {
      console.error("Error saving job application:", error);
    }

    handleCloseModal();
  };

  // Filter job applications based on the search term
  const filteredApplications = jobApplications.filter(
    (application) =>
      application.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.company.toLowerCase().includes(searchTerm.toLowerCase())
    // You can add more fields to filter by if necessary
  );

  // Add pagination logic here
  const itemsPerPage = 20;

  // Get the job application data from the server - include the search term in the request
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Include the search term in the request
        const url = new URL("http://localhost:3001/job-applications");
        if (searchTerm) {
          url.searchParams.append("search", searchTerm); // Assuming your API accepts `search` as a query parameter
        }
  
        const response = await fetch(url); // Use the URL with the search parameter
        const data = await response.json();
  
        setTotalPages(Math.ceil(data.length / itemsPerPage));
        const startIndex = (currentPage - 1) * itemsPerPage;
        const sortedData = data.sort(
          (a, b) =>
            new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime()
        );
        const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);
  
        // Add age to each job application
        const dataWithAge = paginatedData.map((app) => ({
          ...app,
          age: getApplicationAgeInDays(app.dateSubmitted),
        }));
  
        setJobApplications(dataWithAge);
      } catch (error) {
        console.error("Error fetching job applications:", error);
      }
    };
  
    fetchData();
  }, [currentPage, searchTerm]); // Add searchTerm as a dependency
  

  const goToPage = (pageNumber: React.SetStateAction<number>) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
    <div className="table-container">
      {/* Search Input */}
      <input
        className="search-input"
        type="text"
        placeholder="Search by job title or company..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredApplications.length > 0 ? (
        <table className="job-table">
          <thead>
            <tr>
              <th>Date Submitted</th>
              <th>Date Updated</th>
              <th>Job Title</th>
              <th>Company</th>
              <th>Status</th>
              <th>Age (days)</th>
              <th>Double Down</th>
              <th>Notes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((application) => (
              <tr key={application.id}>
                <td>{application.dateSubmitted}</td>
                <td>
                  {application.updatedDate === ""
                    ? "No updates yet"
                    : application.updatedDate}
                </td>
                <td>
                  <a
                    href={application.jobPostingURL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {" "}
                    {application.jobTitle}
                  </a>
                </td>
                <td>{application.company}</td>
                <td>{application.applicationStatus}</td>
                <td>{application.age}</td>
                <td>{application.doubleDown ? "Yes" : "No"}</td>
                <td>{application.notesComments}</td>
                <td>
                  <button
                    className="job-data-edit"
                    onClick={() => handleEditClick(application)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          {showModal && (
            <EditJobApplicationModal
              application={editingApplication}
              onClose={handleCloseModal}
              onSave={handleSaveChanges}
            />
          )}
        </table>
      ) : (
        <p>No job applications found.</p>
      )}
      {/* Pagination Controls */}
      <div className="pagination-container">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => goToPage(pageNumber)}
              className={`pagination-btn ${
                currentPage === pageNumber ? "active" : ""
              }`}
            >
              {pageNumber}
            </button>
          )
        )}
      </div>
    </div>
     <Footer />
    </>
  );
};

// Modal for editing job application data
const EditJobApplicationModal = ({ application, onClose, onSave }) => {
  const [editedApplication, setEditedApplication] = useState(application || {});

  useEffect(() => {
    setEditedApplication(application || {});
  }, [application]);

  const handleInputChange = (e) => {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    setEditedApplication({ ...editedApplication, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await onSave(editedApplication);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Edit Job Application</h2>
        <hr />
        <h2>{editedApplication.company}</h2>
        <h3>{editedApplication.jobTitle}</h3>

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="dateSubmitted">Update Date</label>
            <input
              type="date"
              id="updatedDate"
              name="updatedDate"
              value={editedApplication.updatedDate}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="applicationStatus">Application Status</label>
            <select
              id="applicationStatus"
              name="applicationStatus"
              className="drop-down"
              value={editedApplication.applicationStatus}
              onChange={handleInputChange}
            >
              <option value="none">Select an option</option>
              <option value="Rejected">Rejected</option>
              <option value="Email">Email</option>
              <option value="Phone screen">Phone Screen</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Accepted">Accepted</option>
              <option value="Declined">Declined</option>
              <option value="Expired">Expired</option>
              <option value="Ghosted">Ghosted</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="doubleDown">Double Down</label>
            <input
              type="checkbox"
              id="doubleDown"
              name="doubleDown"
              checked={editedApplication.doubleDown}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="notesComments">Notes</label>
            <textarea
              id="notesComments"
              name="notesComments"
              className="notes-textarea"
              value={editedApplication.notesComments}
              onChange={handleInputChange}
            />
          </div>

          <button className="submit-button" type="submit">
            Save Changes
          </button>
        </form>
      </div>
      
    </div>
  );
};

export default JobList;
