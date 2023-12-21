import { useState } from 'react';
import logo from './assets/job-app-logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import JobForm from './components/JobForm';
import JobList from './components/JobList';
import Metrics from './components/Metrics';

function App() {
  return (
    <Router>
      <nav>
        <img src={logo} className="App-logo" alt="logo" />
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/job-form">Job Form</Link></li>
          <li><Link to="/job-list">Job List</Link></li>
          <li><Link to="/metrics">Metrics</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/job-form" element={<JobForm />} />
        <Route path="/job-list" element={<JobList />} />
        <Route path="/metrics" element={<Metrics />} />
        <Route path="/" element={<h1 className='graph'>Welcome to the Job Application Tracker</h1>} />
      </Routes>
    </Router>
  );
}

export default App;

