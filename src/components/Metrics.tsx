import React, { useState, useEffect } from 'react';
import BarGraph from './BarGraph';
import PieChart from './PieChart';

const Metrics = () => {
  const [metrics, setMetrics] = useState({
    applicationsToday: 0,
    applicationRate: 0,
    totalApplications: 0,
    totalRejections: 0,
    phoneScreens: 0,
    emails: 0,
    interviews: 0
  });
  const [jobApplications, setJobApplications] = useState([]); // Add this line

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('server/data/jobApplications.json');
       
        const jobApplications = await response.json();

      // Today's date in the correct format
      const today = new Date().toISOString().split('T')[0];
      // console.log('Today:', today);

      // Calculate applications submitted today
      const applicationsToday = jobApplications.filter(app => {
        const submittedDate = new Date(app.dateSubmitted).toISOString().split('T')[0];
        // console.log('Submitted Date:', submittedDate);
        return submittedDate === today;
      }).length;

      // Determine this Monday's date
      const thisMonday = new Date();
      thisMonday.setDate(thisMonday.getDate() - thisMonday.getDay() );
      // console.log('This Monday:', thisMonday);
    

      // Figure how many applications have been submitted this week
      const applicationsThisWeek = jobApplications.filter(app => {
        const submittedDate = new Date(app.dateSubmitted);
        console.log('Submitted Date:', submittedDate)
        return submittedDate >= thisMonday;
      }).length;

      console.log('Applications this week:', applicationsThisWeek)

      // Weekly application rate
      const weeklyApplicationRate = 30;

      // Determine application rate
      const applicationRate = Math.floor(applicationsThisWeek / weeklyApplicationRate * 100) + '%';

      // Calculate metrics
      const totalApplications = jobApplications.length;
      const coverLetters = jobApplications.filter(app => app.coverLetter && app.coverLetter.trim() !== '').length;
      const totalRejections = jobApplications.filter(app => app.applicationStatus && app.applicationStatus.toLowerCase() === 'rejected').length;
      const phoneScreens = jobApplications.filter(app => app.phoneScreen && app.phoneScreen.trim() !== '').length;
      const emails = jobApplications.filter(app => app.notesComments && app.notesComments.toLowerCase().includes('email')).length;
      const interviews = jobApplications.filter(app => app.notesComments && app.notesComments.toLowerCase().includes('interview')).length;
       

        // Set metrics state
        setMetrics({ 
            applicationsToday,
            applicationRate,
            weeklyApplicationRate,
            totalApplications,
            coverLetters, 
            totalRejections, 
            phoneScreens,
            emails, 
            interviews 
        });
        // set jobApplications state
        setJobApplications(jobApplications)

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
      <p>Metrics are a great way to track your progress and help you stay motivated.</p>
      </div>
      
      <BarGraph
        totalApplications={metrics.totalApplications}
        coverLetters={metrics.coverLetters}
        totalEmails={metrics.emails} // Assuming you have this metric
        totalPhoneScreens={metrics.phoneScreens}
        totalInterviews={metrics.interviews}
        totalRejections={metrics.totalRejections}
        totalAcceptances={metrics.totalAcceptances} // Assuming you have this metric
        totalOffers={metrics.totalOffers} // Assuming you have this metric
        />
        <PieChart  data={jobApplications} groupByKey="applicationType" />
        <div className='metrics-notes'>
          <h3>Metrics Notes</h3>
          <p>Applications Today: {metrics.applicationsToday}</p>
          <p>Application Rate: {metrics.applicationRate}</p>
          <p className="application-notes">Application Rate is based on {metrics.weeklyApplicationRate} applications per week</p>
          <p>Total Applications: {metrics.totalApplications}</p>
          <p>Phone Screens: {metrics.phoneScreens}</p>
          <p>Emails: {metrics.emails}</p>
          <p>Cover Letters: {metrics.coverLetters}</p>
          <p>Total Rejections: {metrics.totalRejections}</p>
          <p className="application-notes">
              Conventional target conversion from application full CS style application to
              phone screen is 20%.
          </p>
          <p className="application-notes">
              You could possibly get {Math.floor(metrics.totalApplications * 0.2)} phone{" "}
              {metrics.phoneScreens > 1 ? "screens" : "screen"} with your current rate of
              applications if they were all Codesmith style applications.
          </p>
        </div>

    </>
  );
}

export default Metrics;
