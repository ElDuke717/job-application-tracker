import logo from "./assets/job-app-logo.png";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import JobForm from "./components/JobForm";
import JobList from "./components/JobList";
import Metrics from "./components/Metrics";
import Home from "./components/Home";
import JobContactForm from "./components/JobContactForm";
import ContactsList from "./components/ContactsList";
import ContactDetails from "./components/ContactDetails";

function App() {
  return (
    <Router>
      <nav className="app-nav">
        <img src={logo} className="App-logo" alt="logo" />
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/job-form">Job Form</Link>
          </li>
          <li>
            <Link to="/job-list">Job List</Link>
          </li>
          <li>
            <Link to="/job-contact-form">Enter Contact</Link>
          </li>
          <li>
            <Link to="/job-contact-list">Contact List</Link>
          </li>
          <li>
            <Link to="/metrics">Metrics</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/job-form" element={<JobForm />} />
        <Route path="/job-list" element={<JobList />} />
        <Route path="/metrics" element={<Metrics />} />
        <Route path="/job-contact-form" element={<JobContactForm />} />
        <Route path="/job-contact-list" element={<ContactsList />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/contact-details/:contactId"
          element={<ContactDetails />}
        />
      </Routes>
    </Router>
  );
}

export default App;
