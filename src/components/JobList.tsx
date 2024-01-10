import React, { useState, useEffect } from "react";
import { JobApplication } from "../types/jobApplication";
import getApplicationAgeInDays from "../utils/getApplicationAgeInDays";

const JobList = () => {
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null);

  const handleEditClick = (application) => {
    setEditingApplication(application);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingApplication(null);
  };

  const handleSaveChanges = (updatedApplication) => {
    const updatedApplications = jobApplications.map(app =>
      app.id === updatedApplication.id ? updatedApplication : app
    );
    setJobApplications(updatedApplications);
    handleCloseModal();
  };
  


  // Add pagination logic here
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("server/data/jobApplications.json"); // Adjust the URL as needed
        const data = await response.json();
        setTotalPages(Math.ceil(data.length / itemsPerPage));
        const startIndex = (currentPage - 1) * itemsPerPage;
        const sortedData = data.sort(
          (
            a: { dateSubmitted: string | number | Date },
            b: { dateSubmitted: string | number | Date }
          ) =>
            new Date(b.dateSubmitted).getTime() -
            new Date(a.dateSubmitted).getTime()
        );
        const paginatedData = sortedData.slice(
          startIndex,
          startIndex + itemsPerPage
        );

        // Add age to each job application
        const dataWithAge = paginatedData.map(
          (app: { dateSubmitted: string }) => ({
            ...app,
            age: getApplicationAgeInDays(app.dateSubmitted),
          })
        );

        setJobApplications(dataWithAge);
      } catch (error) {
        console.error("Error fetching job applications:", error);
      }
    };

    fetchData();
  }, [currentPage]);

  const goToPage = (pageNumber: React.SetStateAction<number>) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="table-container">
      {jobApplications.length > 0 ? (
        <table className="job-table">
          <thead>
            <tr>
              <th>Date Submitted</th>
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
            {jobApplications.map((application, index) => (
              <tr key={application.id}>
                <td>{application.dateSubmitted}</td>
                <td>{application.jobTitle}</td>
                <td>{application.company}</td>
                <td>{application.applicationStatus}</td>
                <td>{application.age}</td>
                <td>{application.doubleDown ? "Yes" : "No"}</td>
                <td>{application.notesComments}</td>
                <td>
                <button className="job-data-edit" onClick={() => handleEditClick(application)}>Edit</button>
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
  );
};

const EditJobApplicationModal = ({ application, onClose, onSave }) => {
  const [editedApplication, setEditedApplication] = useState(application);

  const handleSave = () => {
    onSave(editedApplication);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <form onSubmit={handleSave}>
            <div className="form-group">
              <label htmlFor="dateSubmitted">Date Submitted</label>
              <input
                type="date"
                id="dateSubmitted"
                name="dateSubmitted"
                value={editedApplication.dateSubmitted}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="jobTitle">Job Title</label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                value={editedApplication.jobTitle}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="company">Company</label>
              <input
                type="text"
                id="company"
                name="company"
                value={editedApplication.company}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="applicationStatus">Status</label>
              <input
                type="text"
                id="applicationStatus"
                name="applicationStatus"
                value={editedApplication.applicationStatus}
                onChange={handleInputChange}
              />
            </div>

            {/* Add more fields as needed... */}

            <button type="submit">Save Changes</button>
          </form>

      </div>
    </div>
  );
};

export default JobList;
