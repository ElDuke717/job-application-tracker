import React, { useState, useEffect } from 'react';
import JobSiteFormModal from './JobSiteFormModal'; 
import { useNavigate } from "react-router-dom";

// Define the type for the job site entry
type JobSiteEntry = {
    id: string;
    siteName: string;
    url: string;
    accountInfo: string;
    haveIUsed: string;
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
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 20; 

    const [showModal, setShowModal] = useState(false); // State to control modal visibility
  
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

    useEffect(() => {
      
  
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
    const handleAddJobSite = async (newSite: JobSiteEntry) => {
        // Add the new site to the server via API
        // Assuming you have an endpoint to add a new site
        try {
            const response = await fetch('http://localhost:3001/add-job-site', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newSite),
            });
            if (!response.ok) throw new Error('Network response was not ok.');
            
            // Re-fetch job sites to update the list
            await fetchJobSites();
        } catch (error) {
            console.error('Error adding new job site:', error);
        }

        // Close the modal
        handleCloseModal();
    };
  
  

  return (
    
    <div className="table-container">
      {jobSites.length > 0 ? (
        <table className="job-sites-table">
          <thead>
            <tr>
              <th>Site</th>
              <th>Have I used it?</th>
              <th>Rating</th>
              <th>Success Rate</th>

            </tr>
          </thead>
          <tbody>
            {jobSites.map((site, index) => (
              <tr key={index}>
                <td><a href={site.url} ><h4>{site.siteName}</h4></a></td>
                <td>{site.haveIUsed}</td>
                <td>{site.rating}</td>
                <td>{site.successRate}</td>
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
  