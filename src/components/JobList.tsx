import React, { useState, useEffect } from 'react';
import { JobApplication } from '../types/jobApplication';

const JobList = () => {
    const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('server/data/jobApplications.json'); // Adjust the URL as needed
            const data = await response.json();
            setTotalPages(Math.ceil(data.length / itemsPerPage));
            const startIndex = (currentPage - 1) * itemsPerPage;
            const paginatedData = data.sort((a, b) => 
              new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime()
            ).slice(startIndex, startIndex + itemsPerPage);
            setJobApplications(paginatedData);
          } catch (error) {
            console.error('Error fetching job applications:', error);
          }
        };
    
        fetchData();
      }, [currentPage]);

      const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
      };

  return (
    <div style={{ padding: '20px' }}>
      {jobApplications.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date Submitted</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Job Title</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Company</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Double Down</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {jobApplications.map((application, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{application.dateSubmitted}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{application.jobTitle}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{application.company}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{application.doubleDown ? 'Yes' : 'No'}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{application.notesComments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No job applications found.</p>
      )}
      {/* Pagination Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
          <button
            key={pageNumber}
            onClick={() => goToPage(pageNumber)}
            style={{
              margin: '0 5px',
              padding: '5px 10px',
              background: currentPage === pageNumber ? 'blue' : 'grey',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {pageNumber}
          </button>
        ))}
      </div>
    </div>
  );
};

export default JobList;
