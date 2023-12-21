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
       
        const jobApplications = await response.json();
        console.log('jobApplications', jobApplications);

        // Calculate metrics
        const totalApplications = jobApplications.length;
        const totalRejections = jobApplications.filter(app => app.applicationStatus && app.applicationStatus.toLowerCase() === 'rejected').length;
        const phoneScreens = jobApplications.filter(app => app.phoneScreen && app.phoneScreen.trim() !== '').length;
        const emails = jobApplications.filter(app => app.notesComments && app.notesComments.toLowerCase().includes('email')).length;
        const interviews = jobApplications.filter(app => app.notesComments && app.notesComments.toLowerCase().includes('interview')).length;

        // Set metrics state
        setMetrics({ 
            totalApplications, 
            totalRejections, 
            phoneScreens,
            emails, 
            interviews 
        });

      } catch (error) {
        console.error('Error fetching job applications:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
     <div className='metrics-container'>
      <h1>Metrics</h1>
      <div className='metrics'>
        <p>Total Applications: {metrics.totalApplications}</p>
        <p>Total Rejections: {metrics.totalRejections}</p>
        <p>Phone Screens: {metrics.phoneScreens}</p>
        <p>Emails: {metrics.emails}</p>
        <p>Interviews: {metrics.interviews}</p>
      </div>
      </div>
      <BarGraph
        totalApplications={metrics.totalApplications}
        totalEmails={metrics.emails} // Assuming you have this metric
        totalPhoneScreens={metrics.phoneScreens}
        totalInterviews={metrics.interviews}
        totalRejections={metrics.totalRejections}
        totalAcceptances={metrics.totalAcceptances} // Assuming you have this metric
        totalOffers={metrics.totalOffers} // Assuming you have this metric
        />
     
    </>
  );
}

export default Metrics;
