import React, { useState, useEffect } from 'react';
import JobSiteForm from './JobSiteForm'; // Assume this is the form component you've created

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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [activeJobSite, setActiveJobSite] = useState<JobSiteEntry | null>(null);
  
    useEffect(() => {
      const fetchJobSites = async () => {
        try {
          const response = await fetch('http://localhost:3001/job-site-list');
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data: JobSiteEntry[] = await response.json();
          setJobSites(data);
        } catch (error) {
          setError('Failed to fetch job sites');
        } finally {
          setLoading(false);
        }
      };
  
      fetchJobSites();
    }, []);
  
    // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
  };


  // Function to handle form submission from the modal
  const handleFormSubmit = (jobSite: JobSiteEntry) => {
    if (activeJobSite) {
      // Edit existing job site
      setJobSites(
        jobSites.map((site) => (site.id === jobSite.id ? jobSite : site))
      );
    } else {
      // Add new job site
      setJobSites([...jobSites, jobSite]);
    }
    setShowModal(false);
    closeModal();
  };

  // Open modal to add a new job site
  const handleAddNewJobSite = () => {
    setActiveJobSite(null); // Ensure no active job site is set for new entries
    setShowModal(true);
    };
    
    // Open modal to edit an existing job site
    const handleEditJobSite = (jobSite: JobSiteEntry) => {
    setActiveJobSite(jobSite);
    setShowModal(true);
    };

  if (loading) {
    return <div>Loading job sites...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <button onClick={handleAddNewJobSite}>Add Job Site</button>
  
      {/* Job Sites List */}
      {jobSites.length > 0 ? (
        <ul>
          {jobSites.map((site) => (
            <li key={site.id}>
              <h3>{site.siteName}</h3>
              {/* Display other details as needed */}
              <button onClick={() => handleEditJobSite(site)}>Edit</button>
            </li>
          ))}
        </ul>
      ) : (
        <div>No Job Sites Listed</div>
      )}
  
      {/* Modal for JobSiteForm */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <JobSiteForm
                activeJobSite={activeJobSite}
                handleFormSubmit={handleFormSubmit}
                closeModal={closeModal} // Pass closeModal as a prop
            />
          </div>
        </div>
      )}
    </div>
  );
  };
  export default JobSiteList;
  