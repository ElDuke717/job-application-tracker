import { useState } from 'react'
import logo from './assets/job-app-logo.svg'
import viteLogo from '/vite.svg'
import './App.css'
import JobForm from './components/JobForm'

function App() {
 

  return (
    <>
    <img src={logo} className="App-logo" alt="logo" />
      <JobForm />
    </>
  )
}

export default App
