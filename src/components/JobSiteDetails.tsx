import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import EditJobSiteDetailsModal from "./EditJobSiteDetailsModal";

const JobSiteDetails = () => {
  const [site, setSite] = useState(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const { siteId } = useParams(); // Extract UUID from the URL

  useEffect(() => {
    const fetchSiteDetails = async () => {
      try {
        const response = await fetch("http://localhost:3001/job-site-list"); 
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const sites = await response.json();
        const foundSite = sites.find((c) => c.id === siteId); // Find the site with the matching UUID
        setSite(foundSite);
      } catch (error) {
        console.error("Error fetching site details:", error);
      }
    };

    fetchSiteDetails();
  }, [siteId]);

  // Function to handle opening the modal
  const handleOpenModal = () => {
    setShowModal(true);
  };

    // Function to handle closing the modal
    const handleCloseModal = () => {
        setShowModal(false);
    };

  if (!site) {
    return <div>Loading...</div>;
  }

  // Function to handle saving changes
    const handleSaveChanges = async (updatedSite) => {
        try {
        const response = await fetch(`http://localhost:3001/contacts/${updatedSite.id}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedSite),
            });
            if (response.ok) {
                setSite(updatedSite);
            } else {
                console.error('Error saving site:', response);
            }
        } catch (error) {
        console.error('Error saving site:', error);
        }
        
        handleCloseModal();
    };

    
    return (
        <div className="site-details">
          <h2>Job Application Site Details</h2>
          
          {/* Basic Information Section */}
          <div className="section">
            <h3>Basic Information</h3>
            {site.siteName && <p>Site Name: {site.siteName}</p>}
            {site.url && <p>URL: <a href={site.url} target="_blank" rel="noopener noreferrer">{site.url}</a></p>}
          </div>
      
          {/* Professional Details Section */}
          <div className="section">
            <h3>Professional Details</h3>
            {site.typeOfJobsListed && <p>Type of Jobs Listed: {site.typeOfJobsListed}</p>}
            {site.frequencyOfPosts && <p>Frequency of Posts: {site.frequencyOfPosts}</p>}
            {site.qualityOfListings && <p>Quality of Listings: {site.qualityOfListings}</p>}
            {site.responseRate && <p>Response Rate: {site.responseRate}</p>}
            {site.description && <p>Description: {site.description}</p>}
            {site.networkingCapabilities && <p>Networking Capabilities: {site.networkingCapabilities}</p>}
            {site.resourcesOffered && <p>Resources Offered: {site.resourcesOffered}</p>}
            {site.successRate && <p>Success Rate: {site.successRate}</p>}
            {site.costOrFees && <p>Cost or Fees: {site.costOrFees}</p>}
            {site.privacyAndSecurity && <p>Privacy and Security: {site.privacyAndSecurity}</p>}
            {site.rating !== undefined && <p>Rating: {site.rating}</p>}
            {site.reviews && <p>Reviews: {site.reviews}</p>}
            {site.notes && <p>Notes: {site.notes}</p>}
          </div>
          
          <button
            className="edit-details-button"
            onClick={handleOpenModal}
            > Edit Details 
          </button>
          <Link to="/job-site-list" className="back-to-contacts">
            Back to Job App Site List
          </Link>
          {showModal && (
            <EditJobSiteDetailsModal
              site={site}
              onClose={handleCloseModal}
              onSave={handleSaveChanges}
            /> 
          )}
        </div>
      );
    };

export default JobSiteDetails;
