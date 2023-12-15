import React, { useState, useEffect } from 'react';
import { JobApplication } from '../types/jobApplication';

const JobList = () => {
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);

  // Fetching data and other logic will go here
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/job-applications'); // Adjust URL as needed
        const data = await response.json();
        setJobApplications(data);
      } catch (error) {
        console.error('Error fetching job applications:', error);
      }
    };
  
    fetchData();
  }, []);
    
  return (
    <div>
      {jobApplications.length > 0 ? (
        <ul>
          {jobApplications.map((application, index) => (
            <li key={index}>
              {/* Display application details */}
              Company: {application.company}, Job Title: {application.jobTitle} {/* Add more details as needed */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No job applications found.</p>
      )}
    </div>
  );
  
};

export default JobList;
