import React, { useState, useEffect } from "react";

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
}

const ContactsList: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 20; // Adjust as needed

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("server/data/contacts.json"); // Adjust the URL as needed
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

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="table-container">
      {contacts.length > 0 ? (
        <table className="contacts-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Title</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>LinkedIn</th>
              <th>Twitter</th>
              <th>Relationship</th>
              <th>Interaction History</th>
              <th>Professional Interests</th>
              <th>Opportunities</th>
              <th>Personal Notes</th>
              <th>Last Contact Date</th>
              <th>Future Plans</th>
              <th>Referral Status</th>
              <th>Feedback</th>
              <th>Links</th>
              <th>Shared Documents</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact, index) => (
              <tr key={index}>
                <td>{contact.name}</td>
                <td>{contact.title}</td>
                <td>{contact.email}</td>
                <td>{contact.phoneNumber}</td>
                <td>{contact.linkedIn}</td>
                <td>{contact.twitter}</td>
                <td>{contact.relationship}</td>
                <td>{contact.interactionHistory}</td>
                <td>{contact.professionalInterests}</td>
                <td>{contact.opportunities}</td>
                <td>{contact.personalNotes}</td>
                <td>{contact.lastContactDate}</td>
                <td>{contact.futurePlans}</td>
                <td>{contact.referralStatus}</td>
                <td>{contact.feedback}</td>
                <td>{contact.links}</td>
                <td>{contact.sharedDocuments}</td>
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
  );
};

export default ContactsList;
