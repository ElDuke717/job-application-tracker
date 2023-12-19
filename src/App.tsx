import { useState } from 'react'
import logo from './assets/job-app-logo.svg'
import './App.css'
import JobForm from './components/JobForm'
import JobList from './components/JobList'

function App() {
 

  return (
    <>
    <img src={logo} className="logo" alt="logo" />
    
      <JobForm />
      <JobList />
    </>
  )
}

export default App
