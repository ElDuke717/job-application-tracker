import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

// Define the contact interface based on your JSON structure
interface Contact {
  name: string;
  title: string;
  email: string;
  phoneNumber: string;
  linkedIn: string;
  twitter: string;
  relationship: string;
  interactionHistory: string;
  professionalInterests: string;
  opportunities: string;
  personalNotes: string;
  lastContactDate: string;
  futurePlans: string;
  referralStatus: string;
  feedback: string;
  links: string;
  sharedDocuments: string;
  id: string;
  company: string;
}

const ContactsList: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 20; // Adjust as needed

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/contacts"); // Adjust the URL as needed
        const data: Contact[] = await response.json();
        setTotalPages(Math.ceil(data.length / itemsPerPage));
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

        setContacts(paginatedData);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchData();
  }, [currentPage]);

  const navigate = useNavigate(); // useNavigate hook for navigation

  const goToDetails = (contactId: string) => {
    navigate(`/contact-details/${contactId}`); // Navigate to contact details page
  };

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
    <div className="table-container">
      {contacts.length > 0 ? (
        <table className="contacts-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Title</th>
              <th>Company</th>
              <th>Last Contact Date</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact, index) => (
              <tr key={index}>
                <td>{contact.name}</td>
                <td>{contact.title}</td>
                <td>{contact.company}</td>
                <td>{new Date(contact.lastContactDate).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => goToDetails(contact.id)}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No contacts found.</p>
      )}
      {/* Pagination Controls */}
      <div className="pagination-container">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => goToPage(pageNumber)}
              className={`pagination-btn ${
                currentPage === pageNumber ? "active" : ""
              }`}
            >
              {pageNumber}
            </button>
          )
        )}
      </div>
    </div>
    <Footer />
    </>
  );
};

export default ContactsList;
