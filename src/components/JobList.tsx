import React, { useState, useEffect } from 'react';
import { JobApplication } from '../types/jobApplication';
import getApplicationAgeInDays from '../utils/getApplicationAgeInDays';

const JobList = () => {
    const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 20;

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('server/data/jobApplications.json'); // Adjust the URL as needed
          const data = await response.json();
          setTotalPages(Math.ceil(data.length / itemsPerPage));
          const startIndex = (currentPage - 1) * itemsPerPage;
          const sortedData = data.sort((a: { dateSubmitted: string | number | Date; }, b: { dateSubmitted: string | number | Date; }) => 
            new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime()
          );
          const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);
          
          // Add age to each job application
          const dataWithAge = paginatedData.map((app: { dateSubmitted: string; }) => ({
            ...app,
            age: getApplicationAgeInDays(app.dateSubmitted)
          }));
    
          setJobApplications(dataWithAge);
        } catch (error) {
          console.error('Error fetching job applications:', error);
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
              <th>Age</th>
              <th>Double Down</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {jobApplications.map((application, index) => (
              <tr key={index}>
                <td >{application.dateSubmitted}</td>
                <td >{application.jobTitle}</td>
                <td >{application.company}</td>
                <td >{application.applicationStatus }</td>
                <td >{application.age}</td>
                <td >{application.doubleDown ? 'Yes' : 'No'}</td>
                <td >{application.notesComments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No job applications found.</p>
      )}
      {/* Pagination Controls */}
      <div className="pagination-container">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
          <button
          key={pageNumber}
          onClick={() => goToPage(pageNumber)}
          className={`pagination-btn ${currentPage === pageNumber ? 'active' : ''}`}
        >
          {pageNumber}
        </button>
        ))}
      </div>
    </div>
  );
};

export default JobList;
