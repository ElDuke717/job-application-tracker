import React, { useState, useEffect } from 'react';
import JobSiteFormModal from './JobSiteFormModal'; 
import { useNavigate } from "react-router-dom";

// Define the type for the job site entry
type JobSiteEntry = {
    id: string;
    siteName: string;
    url: string;
    accountInfo: string;
    typeOfJobsListed: string;
    frequencyOfPosts: string;
    qualityOfListings: string;
    responseRate: string;
    description: string;
    networkingCapabilities: string;
    resourcesOffered: string;
    successRate: string;
    costOrFees: string;
    privacyAndSecurity: string;
    reviews: string;
    rating: number;
    notes: string;
};

// JobSiteList component
const JobSiteList = () => {
    const [jobSites, setJobSites] = useState<JobSiteEntry[]>([]);
    const [activeJobSite, setActiveJobSite] = useState<JobSiteEntry | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 20; 

    const [showModal, setShowModal] = useState(false); // State to control modal visibility
  
    useEffect(() => {
      const fetchJobSites = async () => {
        try {
          const response = await fetch('http://localhost:3001/job-site-list');
          const data: JobSiteEntry[] = await response.json();
          setTotalPages(Math.ceil(data.length / itemsPerPage));
          const startIndex = (currentPage - 1) * itemsPerPage;
          const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);
          
            setJobSites(paginatedData);
        } catch (error) {
          console.error('Error fetching job sites:', error);
        }
      };
  
      fetchJobSites();
    }, [currentPage]);
  
    const navigate = useNavigate(); // useNavigate hook for navigation
  
    const goToDetails = (siteId: string) => {
      navigate(`/job-site-list/${siteId}`); // Navigate to contact details page
    };

    const goToPage = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // Modal Controls

    // Function to open the modal
    const handleOpenModal = () => {
        setShowModal(true);
      };
  
      // Function to close the modal
      const handleCloseModal = () => {
        setShowModal(false);
      };
  
      // Function to handle new job site submission
      const handleAddJobSite = (newSite: JobSiteEntry) => {
        setJobSites([...jobSites, newSite]);
        handleCloseModal();
      };
  
  

  return (
    
    <div className="table-container">
      {jobSites.length > 0 ? (
        <table className="job-sites-table">
          <thead>
            <tr>
              <th>Site</th>
              <th>Rating</th>
              <th>Type of Jobs</th>
              <th>Quality of Listings</th>
            </tr>
          </thead>
          <tbody>
            {jobSites.map((site, index) => (
              <tr key={index}>
                <td>{site.siteName}</td>
                <td>{site.rating}</td>
                <td>{site.typeOfJobsListed}</td>
                <td>{site.qualityOfListings}</td>
                <td>
                  <button onClick={() => goToDetails(site.id)}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No sites found.</p>
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
      {/* Button to open the modal */}
      <button className="add-site-button"onClick={handleOpenModal}>Add New Job Site</button>

        {/* Modal for adding new job site */}
        {showModal && (
        <div className="modal">
            <div className="modal-content">
            <JobSiteFormModal
                closeModal={handleCloseModal}
                onSave={handleAddJobSite}
            />
            </div>
        </div>
        )}
    </div>
  );
};

export default JobSiteList;
  