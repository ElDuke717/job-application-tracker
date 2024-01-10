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
            {jobApplications.map((application) => (
              <tr key={application.id}>
                <td>{application.dateSubmitted}</td>
                <td>{application.updatedDate === '' ? 'None' : application.updatedDate}</td>
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
  const [editedApplication, setEditedApplication] = useState(application || {});

  useEffect(() => {
    setEditedApplication(application || {});
  }, [application]);

  const handleInputChange = (e) => {
    setEditedApplication({ ...editedApplication, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSave(editedApplication);
    onClose();
  };


  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
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
              <option value="Phone screen">Phone Screen</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Accepted">Accepted</option>
              <option value="Declined">Declined</option>
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

           <button className="submit-button" type="submit">Save Changes</button>
            
          </form>

      </div>
    </div>
  );
};

export default JobList;
