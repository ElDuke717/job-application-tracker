import React, { useState, useEffect } from 'react';
import BarGraph from './BarGraph';
import PieChart from './PieChart';
import Footer from './Footer';

const Metrics = () => {
  const [metrics, setMetrics] = useState({
    applicationsToday: 0,
    applicationRate: 0,
    totalApplications: 0,
    totalRejections: 0,
    phoneScreens: 0,
    emails: 0,
    interviews: 0,
    // Add other metrics as needed
  });

  const [jobApplications, setJobApplications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Update the fetch URL to your API endpoint
        const response = await fetch('http://localhost:3001/job-applications');

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const jobApplications = await response.json();

        // Proceed with calculations
        calculateMetrics(jobApplications);

        // Update jobApplications state
        setJobApplications(jobApplications);

      } catch (error) {
        console.error('Error fetching job applications:', error);
      }
    };

    fetchData();
  }, []);

  const calculateMetrics = (jobApplications) => {
    // Today's date in the correct format (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];

    // Calculate applications submitted today
    const applicationsToday = jobApplications.filter(app => {
      const submittedDate = app.dateSubmitted;
      return submittedDate === today;
    }).length;

    // Determine this Monday's date
    const thisMonday = new Date();
    const dayOfWeek = thisMonday.getDay(); // 0 (Sun) to 6 (Sat)
    const daysSinceMonday = (dayOfWeek + 6) % 7;
    thisMonday.setDate(thisMonday.getDate() - daysSinceMonday);

    // Calculate applications submitted this week
    const applicationsThisWeek = jobApplications.filter(app => {
      const submittedDate = new Date(app.dateSubmitted);
      return submittedDate >= thisMonday;
    }).length;

    // Weekly application rate goal (adjust as needed)
    const weeklyApplicationGoal = 30;

    // Calculate application rate
    const applicationRate = weeklyApplicationGoal > 0
      ? Math.floor((applicationsThisWeek / weeklyApplicationGoal) * 100)
      : 0;

    // Calculate total applications
    const totalApplications = jobApplications.length;

    // Calculate cover letters
    const coverLetters = jobApplications.filter(app =>
      app.coverLetter &&
      app.coverLetter.trim().toLowerCase() !== '' &&
      app.coverLetter.slice(0, 4).toLowerCase() !== 'none'
    ).length;

    // Calculate total rejections
    const totalRejections = jobApplications.filter(app =>
      app.applicationStatus &&
      app.applicationStatus.toLowerCase() === 'rejected'
    ).length;

    // Calculate phone screens
    const phoneScreens = jobApplications.filter(app =>
      app.phoneScreen &&
      app.phoneScreen.trim() !== ''
    ).length;

    // Calculate emails
    const emails = jobApplications.filter(app =>
      app.notesComments &&
      app.notesComments.toLowerCase().includes('email')
    ).length;

    // Calculate interviews
    const interviews = jobApplications.filter(app =>
      app.notesComments &&
      app.notesComments.toLowerCase().includes('interview')
    ).length;

    // Calculate rejection rate
    const rejectionRate = totalApplications > 0
      ? ((totalRejections / totalApplications) * 100).toFixed()
      : 0;

    // Calculate average time to response
    const applicationsWithResponse = jobApplications.filter(app => app.updatedDate);
    const totalResponseTime = applicationsWithResponse.reduce((total, app) => {
      const dateSubmitted = new Date(app.dateSubmitted);
      const updatedDate = new Date(app.updatedDate);
      const timeDiff = updatedDate - dateSubmitted;
      const daysDiff = timeDiff / (1000 * 3600 * 24); // Convert milliseconds to days
      return total + daysDiff;
    }, 0);

    const averageTimeToResponse = applicationsWithResponse.length
      ? (totalResponseTime / applicationsWithResponse.length)
      : 0;

    // Calculate max and min time to response
    let maxTimeToResponse = 0;
    let minTimeToResponse = Number.MAX_SAFE_INTEGER;

    applicationsWithResponse.forEach(app => {
      const dateSubmitted = new Date(app.dateSubmitted);
      const updatedDate = new Date(app.updatedDate);
      const timeDiff = updatedDate - dateSubmitted;
      const daysDiff = timeDiff / (1000 * 3600 * 24); // Convert milliseconds to days

      if (daysDiff > maxTimeToResponse) {
        maxTimeToResponse = daysDiff;
      }
      if (daysDiff < minTimeToResponse) {
        minTimeToResponse = daysDiff;
      }
    });

    if (applicationsWithResponse.length === 0) {
      minTimeToResponse = 0;
    }

    // Calculate ghost rate
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    const ghostedApplications = jobApplications.filter(app => {
      const dateSubmitted = new Date(app.dateSubmitted);
      return !app.updatedDate && dateSubmitted < twoMonthsAgo;
    });

    const ghostRate = totalApplications > 0
      ? ((ghostedApplications.length / totalApplications) * 100).toFixed()
      : 0;

    // Calculate daily application rate for this week
    const getDailyApplicationRate = (startDate) => {
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 4); // Friday

      const applicationsThisWeek = jobApplications.filter(app => {
        const submittedDate = new Date(app.dateSubmitted);
        return submittedDate >= startDate && submittedDate <= endDate;
      });

      const businessDays = 5; // Monday to Friday
      const applicationsPerDay = applicationsThisWeek.length / businessDays;
      return applicationsPerDay;
    };

    const dailyApplicationRateThisWeek = getDailyApplicationRate(thisMonday).toFixed(2);

    // Determine the most applications submitted in a single day
    const applicationsByDate = jobApplications.reduce((acc, app) => {
      const date = new Date(app.dateSubmitted).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date]++;
      return acc;
    }, {});

    const maxApplicationsInADay = Math.max(...Object.values(applicationsByDate));

    // Update metrics state
    setMetrics({
      applicationsToday,
      applicationsThisWeek,
      applicationRate,
      weeklyApplicationRate: weeklyApplicationGoal,
      totalApplications,
      coverLetters,
      totalRejections,
      rejectionRate,
      phoneScreens,
      emails,
      interviews,
      ghostRate,
      averageTimeToResponse: averageTimeToResponse.toFixed(2),
      maxTimeToResponse: maxTimeToResponse.toFixed(2),
      minTimeToResponse: minTimeToResponse.toFixed(2),
      dailyApplicationRateThisWeek,
      maxApplicationsInADay,
      // Add other metrics as needed
    });
  };

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
            <tr><td>Application Rate:</td><td>{metrics.applicationRate}%</td></tr>
            <tr><td>Weekly Application Goal:</td><td>{metrics.weeklyApplicationRate}</td></tr>
            <tr><td>Daily Application Rate This Week:</td><td>{metrics.dailyApplicationRateThisWeek}</td></tr>
            <tr><td>Most Applications in a Day:</td><td>{metrics.maxApplicationsInADay}</td></tr>
            <tr><td>Total Applications:</td><td>{metrics.totalApplications}</td></tr>
            <tr><td>Cover Letters:</td><td>{metrics.coverLetters}</td></tr>
            <tr><td>Total Rejections:</td><td>{metrics.totalRejections}</td></tr>
            <tr><td>Rejections to Total Applications:</td><td>{metrics.rejectionRate}%</td></tr>
            <tr><td>Average Time to Response:</td><td>{metrics.averageTimeToResponse} days</td></tr>
            <tr><td>Max Time to Response:</td><td>{metrics.maxTimeToResponse} days</td></tr>
            <tr><td>Min Time to Response:</td><td>{metrics.minTimeToResponse} days</td></tr>
            <tr><td>Ghost Rate:</td><td>{metrics.ghostRate}%</td></tr>
          </tbody>
        </table>
        <p className="application-notes">Application Rate is based on a goal of {metrics.weeklyApplicationRate} applications per week.</p>
        <p className="application-notes">Ghost rate is based on applications older than two months without any response.</p>

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
          Conventional target conversion rate from application to phone screen is 20%.
        </p>
        <p className="application-notes">
          You could possibly get {Math.floor(metrics.totalApplications * 0.2)} phone{" "}
          {Math.floor(metrics.totalApplications * 0.2) !== 1 ? "screens" : "screen"} with your current rate of applications.
        </p>
      </div>

      <BarGraph
        totalApplications={metrics.totalApplications}
        coverLetters={metrics.coverLetters}
        totalEmails={metrics.emails}
        totalPhoneScreens={metrics.phoneScreens}
        totalInterviews={metrics.interviews}
        totalRejections={metrics.totalRejections}
        // Add other props as needed
      />
      <PieChart data={jobApplications} groupByKey="applicationType" />
      <Footer />
    </>
  );
};

export default Metrics;