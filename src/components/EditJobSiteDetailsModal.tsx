import React, { useState } from "react";

const JobSiteDetailsModal = ({ site, onClose, onSave }) => {
  const [updatedSite, setUpdatedSite] = useState(site);

  const handleChange = (e) => {
    setUpdatedSite({ ...updatedSite, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3001/job-site-list/${site.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedSite),
        }
      );

      if (response.ok) {
        onSave(updatedSite);
      } else {
        throw new Error("Error updating site");
      }
    } catch (error) {
      console.error("Failed to update site:", error);
    }
  };

  return (
    <div className="modal update-site-modal">
      <div className="modal-content">
        <h2>Edit Site Details</h2>
        <form onSubmit={handleSubmit}>
          {/* Site Name */}
          <label>
            Site Name:
            <input
              type="text"
              name="siteName"
              value={updatedSite.siteName}
              onChange={handleChange}
            />
          </label>
          {/* URL */}
          <label>
            URL:
            <input
              type="text"
              name="url"
              value={updatedSite.url}
              onChange={handleChange}
            />
          </label>
          {/* Account Info */}
          <label>
            Account Info:
            <input
              type="text"
              name="accountInfo"
              value={updatedSite.accountInfo || ""}
              onChange={handleChange}
            />
          </label>
          {/* Response Rate */}
          <label>
            Response Rate:
            <input
              type="text"
              name="responseRate"
              value={updatedSite.responseRate || ""}
              onChange={handleChange}
            />
          </label>
          {/* Description */}
          <label>
            Description:
            <textarea
              name="description"
              value={updatedSite.description || ""}
              onChange={handleChange}
            />
          </label>
          {/* Networking Capabilities */}
          <label>
            Networking Capabilities:
            <input
              type="text"
              name="networkingCapabilities"
              value={updatedSite.networkingCapabilities || ""}
              onChange={handleChange}
            />
          </label>
          {/* Resources Offered */}
          <label>
            Resources Offered:
            <input
              type="text"
              name="resourcesOffered"
              value={updatedSite.resourcesOffered || ""}
              onChange={handleChange}
            />
          </label>
          {/* Success Rate */}
          <label>
            Success Rate:
            <input
              type="text"
              name="successRate"
              value={updatedSite.successRate || ""}
              onChange={handleChange}
            />
          </label>
          {/* Cost or Fees */}
          <label>
            Cost or Fees:
            <input
              type="text"
              name="costOrFees"
              value={
  
            updatedSite.costOrFees || ""}
            onChange={handleChange}
            />
            </label>
            {/* Privacy and Security */}
            <label>
            Privacy and Security:
            <input
            type="text"
            name="privacyAndSecurity"
            value={updatedSite.privacyAndSecurity || ""}
            onChange={handleChange}
            />
            </label>
            {/* Reviews */}
        <label>
            Reviews:
            <textarea
            name="reviews"
            value={updatedSite.reviews || ""}
            onChange={handleChange}
            />
        </label>
        {/* Rating */}
        <label>
            Rating:
            <input
            type="number"
            name="rating"
            value={updatedSite.rating}
            onChange={handleChange}
            min="1"
            max="5"
        />
        </label>
        {/* Notes */}
        <label>
        Notes:
        <textarea
        name="notes"
        value={updatedSite.notes || ""}
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

export default JobSiteDetailsModal;
