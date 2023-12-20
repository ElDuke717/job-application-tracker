import React, { useState, useEffect } from 'react';
import BarGraph from './BarGraph';

const Metrics = () => {
  const [metrics, setMetrics] = useState({
    totalApplications: 0,
    totalRejections: 0,
    phoneScreens: 0,
    emails: 0,
    interviews: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('server/data/jobApplications.json');
        console.log(response)
        const jobApplications = await response.json();

        // Calculate metrics
        const totalApplications = jobApplications.length;
        const totalRejections = jobApplications.filter(app => app.applicationStatus === 'Rejected').length;
        const phoneScreens = jobApplications.filter(app => app.notesComments.toLowerCase().includes('phone')).length;
        const emails = jobApplications.filter(app => app.notesComments.toLowerCase().includes('email')).length;
        const interviews = jobApplications.filter(app => app.notesComments.toLowerCase().includes('interview')).length;

        // Set metrics state
        setMetrics({ 
            totalApplications, 
            totalRejections, 
            phoneScreens,
            emails: 0, 
            interviews: 0 
        });

      } catch (error) {
        console.error('Error fetching job applications:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Metrics</h1>
      <div>
        <p>Total Applications: {metrics.totalApplications}</p>
        <p>Total Rejections: {metrics.totalRejections}</p>
        <p>Phone Screens: {metrics.phoneScreens}</p>
        <p>Emails: {metrics.emails}</p>
        <p>Interviews: {metrics.interviews}</p>
      </div>
      <BarGraph />
    </div>
  );
}

export default Metrics;
