import Footer from "./Footer";

const Home = () => {
  return (
    <>
      <div className="home">
        <h1>Welcome to the Job Application Tracker!</h1>
        <p>
          This app is designed to help you keep track of your job applications.
        </p>
        <p>
          Use the navigation bar above to navigate to the Job Form, Job List, or
          Metrics page.
        </p>
      </div>
      <Footer />
    </>
  );
};

export default Home;
