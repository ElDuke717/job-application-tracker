import logo from "./assets/job-app-logo.png";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, NavLink } from "react-router-dom";
import JobForm from "./components/JobForm";
import JobList from "./components/JobList";
import Metrics from "./components/Metrics";
import Home from "./components/Home";
import JobContactForm from "./components/JobContactForm";
import ContactsList from "./components/ContactsList";
import ContactDetails from "./components/ContactDetails";
import JobSiteList from "./components/JobSiteList";
import JobSiteDetails from "./components/JobSiteDetails";
import JournalEntryForm from "./components/JournalEntryForm";

function App() {
    

  return (
    <Router>
      
      <nav className="app-nav">
        <img src={logo} className="App-logo" alt="logo" />
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? 'active-link' : undefined}>Home</NavLink>
          </li>
          <li>
            <NavLink to="/job-form" className={({ isActive }) => isActive ? 'active-link' : undefined}>Job Form</NavLink>
          </li>
          <li>
            <NavLink to="/job-list" className={({ isActive }) => isActive ? 'active-link' : undefined}>Job List</NavLink>
          </li>
          <li>
            <NavLink to="/job-contact-form" className={({ isActive }) => isActive ? 'active-link' : undefined}>Enter Contact</NavLink>
          </li>
          <li>
            <NavLink to="/job-contact-list" className={({ isActive }) => isActive ? 'active-link' : undefined}>Contact List</NavLink>
          </li>
          <li>
            <NavLink to="/job-site-list" className={({ isActive }) => isActive ? 'active-link' : undefined}>Job Search Sites </NavLink>
          </li>
          <li>
            <NavLink to="/metrics" className={({ isActive }) => isActive ? 'active-link' : undefined}>Metrics</NavLink>
          </li>
          <li>
            <NavLink to="/journal" className={({ isActive }) => isActive ? 'active-link' : undefined}>Journal</NavLink>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/job-form" element={<JobForm />} />
        <Route path="/job-list" element={<JobList />} />
        <Route path="/metrics" element={<Metrics />} />
        <Route path="/job-contact-form" element={<JobContactForm />} />
        <Route path="/job-contact-list" element={<ContactsList />} />
        <Route path="/job-site-list" element={<JobSiteList />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/contact-details/:contactId"
          element={<ContactDetails />}
        />
        <Route
          path="/job-site-list/:siteId"
          element={<JobSiteDetails />}
        />
        <Route
          path="/journal"
          element={<JournalEntryForm />}
        />
      </Routes>
    </Router>
  );
}

export default App;
