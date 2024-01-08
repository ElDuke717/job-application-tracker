import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const initialContactState = {
  id: uuidv4,
  name: '',
  title: '',
  email: '',
  phoneNumber: '',
  linkedIn: '',
  twitter: '',
  relationship: '',
  interactionHistory: '',
  professionalInterests: '',
  opportunities: '',
  personalNotes: '',
  lastContactDate: '',
  futurePlans: '',
  referralStatus: '',
  feedback: '',
  links: '',
  sharedDocuments: ''
};

const JobContactForm = ({ initialData = initialContactState }) => {
  const [contact, setContact] = useState(initialData);

  // state variable for showing modal
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setContact({ ...contact, [name]: value });
  };

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    onSaveContact(contact);
    setContact(initialContactState); // Reset form after submission
  };

  useEffect(() => {
    let timer: number | undefined;
    if (showModal) {
      timer = setTimeout(() => setShowModal(false), 3000);
    }
    return () => clearTimeout(timer);
  }, [showModal]);
  

  const onSaveContact = async (contactData: ContactData) => {
    

    // Generate a unique ID for a new contact
    const contactToSave = {
      ...contactData,
      id: contactData.id || uuidv4(), // Only generate a new ID if one doesn't already exist
    };
        
    const response = await fetch('http://localhost:3001/save-contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactToSave),
    });
    if (response.ok) {
     // Reset the form to initial state
     setContact(initialContactState);
     // Show modal
     setShowModal(true);
     // Hide modal after 3 seconds
     setTimeout(() => setShowModal(false), 3000);
    } else {
      // Handle error
      console.log('Failed to save application');
    }
  };

   // JSX for modal (simple example)
   const modal = (
    <div style={{ display: showModal ? 'block' : 'none', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '5px', boxShadow: '0px 0px 10px rgba(0,0,0,0.5)', color: "black" }}>
      <p>Contact saved successfully!</p>
    </div>
  );
  

  // Add input fields for each property in the contact
  return (
    <>
    {modal}
    <form className="job-contact-form" onSubmit={handleSubmit}>
      {/* Render input fields here */}
      <div>
  <label htmlFor="name">Name:</label>
  <input
    type="text"
    id="name"
    name="name"
    value={contact.name}
    onChange={handleChange}
  />
</div>

<div>
  <label htmlFor="title">Title:</label>
  <input
    type="text"
    id="title"
    name="title"
    value={contact.title}
    onChange={handleChange}
  />
</div>

<div>
  <label htmlFor="email">Email:</label>
  <input
    type="email"
    id="email"
    name="email"
    value={contact.email}
    onChange={handleChange}
  />
</div>

<div>
  <label htmlFor="phoneNumber">Phone Number:</label>
  <input
    type="tel"
    id="phoneNumber"
    name="phoneNumber"
    value={contact.phoneNumber}
    onChange={handleChange}
  />
</div>

<div>
  <label htmlFor="linkedIn">LinkedIn Profile:</label>
  <input
    type="url"
    id="linkedIn"
    name="linkedIn"
    value={contact.linkedIn}
    onChange={handleChange}
  />
</div>

<div>
  <label htmlFor="twitter">Twitter Handle:</label>
  <input
    type="text"
    id="twitter"
    name="twitter"
    value={contact.twitter}
    onChange={handleChange}
  />
</div>

<div>
  <label htmlFor="relationship">Relationship:</label>
  <input
    type="text"
    id="relationship"
    name="relationship"
    value={contact.relationship}
    onChange={handleChange}
  />
</div>

<div>
  <label htmlFor="interactionHistory">Interaction History:</label>
  <textarea
    id="interactionHistory"
    name="interactionHistory"
    value={contact.interactionHistory}
    onChange={handleChange}
  />
</div>

<div>
  <label htmlFor="professionalInterests">Professional Interests:</label>
  <textarea
    id="professionalInterests"
    name="professionalInterests"
    value={contact.professionalInterests}
    onChange={handleChange}
  />
</div>

<div>
  <label htmlFor="opportunities">Potential Opportunities Mentioned:</label>
  <textarea
    id="opportunities"
    name="opportunities"
    value={contact.opportunities}
    onChange={handleChange}
  />
</div>

<div>
  <label htmlFor="personalNotes">Personal Notes:</label>
  <textarea
    id="personalNotes"
    name="personalNotes"
    value={contact.personalNotes}
    onChange={handleChange}
  />
</div>

<div>
  <label htmlFor="lastContactDate">Last Contact Date:</label>
  <input
    type="date"
    id="lastContactDate"
    name="lastContactDate"
    value={contact.lastContactDate}
    onChange={handleChange}
  />
</div>

<div>
  <label htmlFor="futurePlans">Future Contact Plans:</label>
  <textarea
    id="futurePlans"
    name="futurePlans"
    value={contact.futurePlans}
    onChange={handleChange}
  />
</div>

<div>
  <label htmlFor="referralStatus">Referral Status:</label>
  <input
    type="text"
    id="referralStatus"
    name="referralStatus"
    value={contact.referralStatus}
    onChange={handleChange}
  />
</div>

<div>
  <label htmlFor="feedback">Feedback or Advice Provided:</label>
  <textarea
    id="feedback"
    name="feedback"
    value={contact.feedback}
    onChange={handleChange}
  />
</div>

<div>
  <label htmlFor="links">Links:</label>
  <textarea
    id="links"
    name="links"
    value={contact.links}
    onChange={handleChange}
  />
</div>

<div>
  <label htmlFor="sharedDocuments">Shared Documents:</label>
  <textarea
    id="sharedDocuments"
    name="sharedDocuments"
    value={contact.sharedDocuments}
    onChange={handleChange}
  />
</div>

      <button type="submit">Save Contact</button>
    </form>
</>
  );
};

export default JobContactForm;
