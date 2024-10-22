import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs(Router, { children: [_jsxs("nav", { className: "app-nav", children: [_jsx("img", { src: logo, className: "App-logo", alt: "logo" }), _jsxs("ul", { children: [_jsx("li", { children: _jsx(NavLink, { to: "/", className: ({ isActive }) => isActive ? 'active-link' : undefined, children: "Home" }) }), _jsx("li", { children: _jsx(NavLink, { to: "/job-form", className: ({ isActive }) => isActive ? 'active-link' : undefined, children: "Job Form" }) }), _jsx("li", { children: _jsx(NavLink, { to: "/job-list", className: ({ isActive }) => isActive ? 'active-link' : undefined, children: "Job List" }) }), _jsx("li", { children: _jsx(NavLink, { to: "/job-contact-form", className: ({ isActive }) => isActive ? 'active-link' : undefined, children: "Enter Contact" }) }), _jsx("li", { children: _jsx(NavLink, { to: "/job-contact-list", className: ({ isActive }) => isActive ? 'active-link' : undefined, children: "Contact List" }) }), _jsx("li", { children: _jsx(NavLink, { to: "/job-site-list", className: ({ isActive }) => isActive ? 'active-link' : undefined, children: "Job Search Sites " }) }), _jsx("li", { children: _jsx(NavLink, { to: "/metrics", className: ({ isActive }) => isActive ? 'active-link' : undefined, children: "Metrics" }) }), _jsx("li", { children: _jsx(NavLink, { to: "/journal", className: ({ isActive }) => isActive ? 'active-link' : undefined, children: "Journal" }) })] })] }), _jsxs(Routes, { children: [_jsx(Route, { path: "/job-form", element: _jsx(JobForm, {}) }), _jsx(Route, { path: "/job-list", element: _jsx(JobList, {}) }), _jsx(Route, { path: "/metrics", element: _jsx(Metrics, {}) }), _jsx(Route, { path: "/job-contact-form", element: _jsx(JobContactForm, {}) }), _jsx(Route, { path: "/job-contact-list", element: _jsx(ContactsList, {}) }), _jsx(Route, { path: "/job-site-list", element: _jsx(JobSiteList, {}) }), _jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/contact-details/:contactId", element: _jsx(ContactDetails, {}) }), _jsx(Route, { path: "/job-site-list/:siteId", element: _jsx(JobSiteDetails, {}) }), _jsx(Route, { path: "/journal", element: _jsx(JournalEntryForm, {}) })] })] }));
}
export default App;
