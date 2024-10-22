import { useState } from "react";

const EditContactDetailsModal = ({ contact, onClose, onSave }) => {
  const [updatedContact, setUpdatedContact] = useState(contact);

  const handleChange = (e) => {
    setUpdatedContact({ ...updatedContact, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3001/contacts/${contact.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedContact),
        }
      );

      if (response.ok) {
        onSave(updatedContact);
      } else {
        throw new Error("Error updating contact");
      }
    } catch (error) {
      console.error("Failed to update contact:", error);
    }
  };

  return (
    <div className="modal update-contact-modal">
      <div className="modal-content">
        <h2>Edit Contact Details</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={updatedContact.name}
              onChange={handleChange}
            />
          </label>
          {/* Title */}
          <label>
            Title:
            <input
              type="text"
              name="title"
              value={updatedContact.title}
              onChange={handleChange}
            />
          </label>
          {/* Company */}
          <label>
            Company:
            <input
              type="text"
              name="company"
              value={updatedContact.company}
              onChange={handleChange}
            />
          </label>
          {/* ... other fields ... */}

          <label>
            Relationship:
            <input
              type="text"
              name="relationship"
              value={updatedContact.relationship}
              onChange={handleChange}
            />
          </label>
          {/* Email field */}
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={updatedContact.email || ""}
              onChange={handleChange}
            />
          </label>

          {/* Phone Number field */}
          <label>
            Phone Number:
            <input
              type="text"
              name="phoneNumber"
              value={updatedContact.phoneNumber || ""}
              onChange={handleChange}
            />
          </label>

          {/* LinkedIn field */}
          <label>
            LinkedIn:
            <input
              type="text"
              name="linkedIn"
              value={updatedContact.linkedIn || ""}
              onChange={handleChange}
            />
          </label>

          {/* Twitter field */}
          <label>
            Twitter:
            <input
              type="text"
              name="twitter"
              value={updatedContact.twitter || ""}
              onChange={handleChange}
            />
          </label>

          {/* Interaction History field */}
          <label>
            Interaction History:
            <textarea
              name="interactionHistory"
              value={updatedContact.interactionHistory || ""}
              onChange={handleChange}
            />
          </label>

          {/* Professional Interests field */}
          <label>
            Professional Interests:
            <textarea
              name="professionalInterests"
              value={updatedContact.professionalInterests || ""}
              onChange={handleChange}
            />
          </label>

          {/* Opportunities field */}
          <label>
            Opportunities:
            <textarea
              name="opportunities"
              value={updatedContact.opportunities || ""}
              onChange={handleChange}
            />
          </label>

          {/* Personal Notes field */}
          <label>
            Personal Notes:
            <textarea
              name="personalNotes"
              value={updatedContact.personalNotes || ""}
              onChange={handleChange}
            />
          </label>

          {/* Last Contact Date field */}
          <label>
            Last Contact Date:
            <input
              type="date"
              name="lastContactDate"
              value={updatedContact.lastContactDate || ""}
              onChange={handleChange}
            />
          </label>

          {/* Future Plans field */}
          <label>
            Future Plans:
            <textarea
              name="futurePlans"
              value={updatedContact.futurePlans || ""}
              onChange={handleChange}
            />
          </label>

          {/* Referral Status field */}
          <label>
            Referral Status:
            <input
              type="text"
              name="referralStatus"
              value={updatedContact.referralStatus || ""}
              onChange={handleChange}
            />
          </label>

          {/* Feedback field */}
          <label>
            Feedback:
            <textarea
              name="feedback"
              value={updatedContact.feedback || ""}
              onChange={handleChange}
            />
          </label>

          {/* Links field */}
          <label>
            Links:
            <textarea
              name="links"
              value={updatedContact.links || ""}
              onChange={handleChange}
            />
          </label>

          {/* Shared Documents field */}
          <label>
            Shared Documents:
            <textarea
              name="sharedDocuments"
              value={updatedContact.sharedDocuments || ""}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Save Changes</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditContactDetailsModal;
