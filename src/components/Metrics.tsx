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
        // console.log('Submitted Date:', submittedDate)
        return submittedDate >= thisMonday;
      }).length;

      console.log('Applications this week:', applicationsThisWeek)

      // Weekly application rate
      const weeklyApplicationRate = 30;

      // Determine application rate
      const applicationRate = Math.floor(applicationsThisWeek / weeklyApplicationRate * 100) + '%';

      // Calculate metrics
      const totalApplications = jobApplications.length;
      const coverLetters = jobApplications.filter(app => app.coverLetter && app.coverLetter.trim() !== '' && app.coverLetter.trim() !== 'none').length;
      const totalRejections = jobApplications.filter(app => app.applicationStatus && app.applicationStatus.toLowerCase() === 'rejected').length;
      const phoneScreens = jobApplications.filter(app => app.phoneScreen && app.phoneScreen.trim() !== '').length;
      const emails = jobApplications.filter(app => app.notesComments && app.notesComments.toLowerCase().includes('email')).length;
      const interviews = jobApplications.filter(app => app.notesComments && app.notesComments.toLowerCase().includes('interview')).length;

      // Calculate the average time to response
      const applicationsWithResponse = jobApplications.filter(app => app.updatedDate);
      const totalResponseTime = applicationsWithResponse.reduce((total, app) => {
          const dateSubmitted = new Date(app.dateSubmitted);
          const updatedDate = new Date(app.updatedDate);
          const timeDiff = updatedDate - dateSubmitted;
          const daysDiff = timeDiff / (1000 * 3600 * 24); // Convert milliseconds to days
          return total + daysDiff;
      }, 0);
      const averageTimeToResponse = applicationsWithResponse.length ? (totalResponseTime / applicationsWithResponse.length) : 0;

      // Calculate the max and min time to response
      // Initialize variables for max and min time to response
      let maxTimeToResponse = 0;
      let minTimeToResponse = Number.MAX_SAFE_INTEGER;

      applicationsWithResponse.forEach(app => {
          const dateSubmitted = new Date(app.dateSubmitted);
          const updatedDate = new Date(app.updatedDate);
          const timeDiff = updatedDate - dateSubmitted;
          const daysDiff = timeDiff / (1000 * 3600 * 24); // Convert milliseconds to days

          // Update max and min time to response
          if (daysDiff > maxTimeToResponse) {
              maxTimeToResponse = daysDiff;
          }
          if (daysDiff < minTimeToResponse) {
              minTimeToResponse = daysDiff;
          }
      });

      // Handle the case where there are no applications with response
      if (applicationsWithResponse.length === 0) {
          minTimeToResponse = 0;
      }
       
      // Calculate the ghost rate
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2); // Set to two months ago

      const ghostedApplications = jobApplications.filter(app => {
          const dateSubmitted = new Date(app.dateSubmitted);
          return !app.updatedDate && dateSubmitted < twoMonthsAgo;
      });
      const ghostRate = jobApplications.length ? (ghostedApplications.length / jobApplications.length * 100) : 0;

        // Set metrics state
        setMetrics({ 
            applicationsToday,
            applicationsThisWeek,
            applicationRate,
            weeklyApplicationRate,
            totalApplications,
            coverLetters, 
            totalRejections, 
            phoneScreens,
            emails, 
            interviews,
            averageTimeToResponse: averageTimeToResponse.toFixed(2), // Round to 2 decimal places
            maxTimeToResponse: maxTimeToResponse.toFixed(2), // Round to 2 decimal places
            minTimeToResponse: minTimeToResponse.toFixed(2), // Round to 2 decimal places
            ghostRate: ghostRate.toFixed(2) // Round to 2 decimal places 
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
    <div className='metrics-notes'>
        {/* Application Metrics */}
        <h2>Application Metrics</h2>
        <hr />
        <table>
            <tbody>
                <tr><td>Applications Today:</td><td>{metrics.applicationsToday}</td></tr>
                <tr><td>Applications This Week:</td><td>{metrics.applicationsThisWeek}</td></tr>
                <tr><td>Application Rate:</td><td>{metrics.applicationRate}</td></tr>
                <tr><td>Total Applications:</td><td>{metrics.totalApplications}</td></tr>
                <tr><td>Cover Letters:</td><td>{metrics.coverLetters}</td></tr>
                <tr><td>Total Rejections:</td><td>{metrics.totalRejections}</td></tr>
                <tr><td>Rejections to total applications:</td><td>{Math.floor(metrics.totalRejections / metrics.totalApplications * 100)}%</td></tr>
                <tr><td>Average Time to Response:</td><td>{metrics.averageTimeToResponse} days</td></tr>
                <tr><td>Max Time to Response:</td><td>{metrics.maxTimeToResponse} days</td></tr>
                <tr><td>Min Time to Response:</td><td>{metrics.minTimeToResponse} days</td></tr>
                <tr><td>Ghost Rate:</td><td>{metrics.ghostRate}%</td></tr>
            </tbody>
        </table>
        <p className="application-notes">Application Rate is based on {metrics.weeklyApplicationRate} applications per week</p>
        <p className="application-notes">Ghost rate is based on applications that are older than two months and have not received an update or any response.</p>
        
        {/* Interview Metrics */}
        <h2>Interview Metrics</h2>
        <hr />
        <table>
            <tbody>
                <tr><td>Phone Screens:</td><td>{metrics.phoneScreens}</td></tr>
                <tr><td>Emails:</td><td>{metrics.emails}</td></tr>
                <tr><td>Interviews:</td><td>{metrics.interviews}</td></tr>
            </tbody>
        </table>
        <p className="application-notes">
            Conventional target conversion rate from full CS style application to phone screen is 20%.
        </p>
        <p className="application-notes">
            You could possibly get {Math.floor(metrics.totalApplications * 0.2)} phone{" "}
            {Math.floor(metrics.totalApplications * 0.2) > 1 ? "screens" : "screen"} with your current rate of applications if they were all Codesmith style applications.
        </p>
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
        
    </>
  );
}

export default Metrics;
