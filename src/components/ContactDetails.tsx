import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import EditContactDetailsModal from "./EditContactDetailsModal";

const ContactDetails = () => {
  const [contact, setContact] = useState(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const { contactId } = useParams(); // Extract UUID from the URL

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        const response = await fetch("http://localhost:3001/contacts"); // Adjust the path as necessary
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const contacts = await response.json();
        const foundContact = contacts.find((c) => c.id === contactId); // Find the contact with the matching UUID
        setContact(foundContact);
      } catch (error) {
        console.error("Error fetching contact details:", error);
      }
    };

    fetchContactDetails();
  }, [contactId]);

  // Function to handle opening the modal
  const handleOpenModal = () => {
    setShowModal(true);
  };

    // Function to handle closing the modal
    const handleCloseModal = () => {
        setShowModal(false);
    };

  if (!contact) {
    return <div>Loading...</div>;
  }

  // Function to handle saving changes
    const handleSaveChanges = async (updatedContact) => {
        try {
        const response = await fetch(`http://localhost:3001/contacts/${updatedContact.id}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedContact),
            });
            if (response.ok) {
                setContact(updatedContact);
            } else {
                console.error('Error saving contact:', response);
            }
        } catch (error) {
        console.error('Error saving contact:', error);
        }
        
        handleCloseModal();
    };

    
  return (
    <div className="contact-details">
      <h2>Contact Details</h2>
      <div className="section">
        <h3>Basic Information</h3>
        {contact.name && <p>Name: {contact.name}</p>}
        {contact.title && <p>Title: {contact.title}</p>}
        {contact.company && <p>Company: {contact.company}</p>}
      </div>
      <div className="section">
        <h3>Contact Information</h3>
        {contact.phone && <p>Phone: {contact.phone}</p>}
        {contact.email && <p>Email: {contact.email}</p>}
        {contact.linkedIn && (
          <p>
            LinkedIn: <a href={contact.linkedIn}>{contact.linkedIn}</a>
          </p>
        )}
        {contact.twitter && <p>Twitter: {contact.twitter}</p>}
      </div>
      <div className="section">
        <h3>Professional Details</h3>
        {contact.relationship && <p>Relationship: {contact.relationship}</p>}
        {contact.interactionHistory && (
          <p>Interaction History: {contact.interactionHistory}</p>
        )}
        {contact.professionalInterests && (
          <p>Professional Interests: {contact.professionalInterests}</p>
        )}
        {contact.opportunities && <p>Opportunities: {contact.opportunities}</p>}
        {contact.personalNotes && (
          <p>Personal Notes: {contact.personalNotes}</p>
        )}
      </div>
      <div className="section">
        <h3>Additional Information</h3>
        {contact.lastContactDate && (
          <p>Last Contact Date: {contact.lastContactDate}</p>
        )}
        {contact.futurePlans && <p>Future Plans: {contact.futurePlans}</p>}
        {contact.referralStatus && (
          <p>Referral Status: {contact.referralStatus}</p>
        )}
        {contact.feedback && <p>Feedback: {contact.feedback}</p>}
        {contact.links && <p>Links: {contact.links}</p>}
        {contact.sharedDocuments && (
          <p>Shared Documents: {contact.sharedDocuments}</p>
        )}
      </div>
      <button
        className="edit-details-button"
        onClick={handleOpenModal}
        > Edit Details 
        </button>
        <Link to="/job-contact-list" className="back-to-contacts">
      Back to Contacts List
    </Link>
        {showModal && (
        <EditContactDetailsModal
          contact={contact}
          onClose={handleCloseModal}
          onSave={handleSaveChanges}
        /> 
        )}
    </div>
  );
};

export default ContactDetails;
