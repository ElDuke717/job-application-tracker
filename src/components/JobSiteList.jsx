import React, { useState, useEffect } from 'react';
import JobSiteFormModal from './JobSiteFormModal'; 
import { useNavigate } from "react-router-dom";
import Footer from './Footer';


const JobSiteList = () => {
    const [jobSites, setJobSites] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 20; 

    const [showModal, setShowModal] = useState(false); // State to control modal visibility
  
    const navigate = useNavigate(); // useNavigate hook for navigation

    // Function to fetch job sites from the server
    const fetchJobSites = async () => {
        try {
            const response = await fetch('http://localhost:3001/job-site-list');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setTotalPages(Math.ceil(data.length / itemsPerPage));
            const startIndex = (currentPage - 1) * itemsPerPage;
            const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);
            setJobSites(paginatedData);
        } catch (error) {
            console.error('Error fetching job sites:', error);
            // Optionally, set an error state here to inform the user
        }
    };

    useEffect(() => {
        fetchJobSites();
    }, [currentPage]);
  
    // Navigate to the details page of a specific job site
    const goToDetails = (siteId) => {
        navigate(`/job-site-list/${siteId}`); // Navigate to job site details page
    };

    // Handle page navigation for pagination
    const goToPage = (pageNumber) => {
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
    const handleAddJobSite = async (newSite) => {
        try {
            const response = await fetch('http://localhost:3001/add-job-site', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newSite),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            // Re-fetch job sites to update the list
            await fetchJobSites();
        } catch (error) {
            console.error('Error adding new job site:', error);
            // Optionally, set an error state here to inform the user
        }

        // Close the modal
        handleCloseModal();
    };

    return (
        <>
            <div className="table-container">
                {jobSites.length > 0 ? (
                    <table className="job-sites-table">
                        <thead>
                            <tr>
                                <th>Site</th>
                                <th>Have I Used It?</th>
                                <th>Rating</th>
                                <th>Success Rate</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobSites.map((site) => (
                                <tr key={site.id}>
                                    <td>
                                        <a href={site.url} target="_blank" rel="noopener noreferrer">
                                            <h4>{site.siteName}</h4>
                                        </a>
                                    </td>
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
                <button className="add-site-button" onClick={handleOpenModal}>
                    Add New Job Site
                </button>

                {/* Modal for adding new job site */}
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <div className="modal-header">
                                <h2>Add New Job Site</h2>
                                <span className="close" onClick={handleCloseModal}>
                                    &times;
                                </span>
                            </div>
                            <div className="modal-body">
                                <JobSiteFormModal
                                    closeModal={handleCloseModal}
                                    onSave={handleAddJobSite}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default JobSiteList;