import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define the initial state for the form fields
const initialFormState = {
  id: uuidv4(),
  siteName: '',
  url: '',
  accountInfo: '',
  typeOfJobsListed: '',
  frequencyOfPosts: '',
  qualityOfListings: '',
  responseRate: '',
  description: '',
  networkingCapabilities: '',
  resourcesOffered: '',
  successRate: '',
  costOrFees: '',
  privacyAndSecurity: '',
  reviews: '',
  rating: 1, // Initialize the rating to the lowest possible value
  notes: '',
};

const JobSiteForm = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
     
      [name]: value,
    });
  };

  const handleRatingChange = (event) => {
    const rating = parseInt(event.target.value, 10);
    if (rating >= 1 && rating <= 5) {
      setFormData({ ...formData, rating });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    // Simple validation rules
    if (!formData.siteName.trim()) newErrors.siteName = 'Site name is required.';
    if (!formData.url.trim() || !/^https?:\/\/.+/.test(formData.url))
      newErrors.url = 'A valid URL is required.';
    if (!formData.notes.trim()) newErrors.notes = 'Notes are required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Form is valid if there are no errors
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('http://localhost:3001/job-sites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error('Network response was not ok.');
        // Handle success, e.g., clear form, show success message, etc.
        setFormData(initialFormState);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  return (
    <div className="job-site-form">
      <h1>Job Application Site Entry Form</h1>
      <form onSubmit={handleSubmit}>
        {/* Render input fields for form data */}
            <label>
            Site Name:
            <input type="text" name="siteName" value={formData.siteName} onChange={handleInputChange} />
            {errors.siteName && <div className="error">{errors.siteName}</div>}
            </label>
            {/* More fields for the rest of the form data... */}
            <label>
            URL:
            <input type="url" name="url" value={formData.url} onChange={handleInputChange} required />
            {errors.url && <div className="error">{errors.url}</div>}
        </label>
        <label>
            Account Information:
            <textarea name="accountInfo" value={formData.accountInfo} onChange={handleInputChange} />
        </label>
        <label>
            Type of Jobs Listed:
            <input type="text" name="jobType" value={formData.typeOfJobsListed} onChange={handleInputChange} />
        </label>
        <label>
            Frequency of Posts:
            <input type="text" name="postFrequency" value={formData.frequencyOfPosts} onChange={handleInputChange} />
        </label>

        <label>
            Quality of Listings:
            <input type="text" name="listingQuality" value={formData.qualityOfListings} onChange={handleInputChange} />
        </label>

        <label>
            Response Rate:
            <input type="text" name="responseRate" value={formData.responseRate} onChange={handleInputChange} />
        </label>
        <label>
            Description:
            <textarea name="description" value={formData.description} onChange={handleInputChange} />
        </label>
        <label>
          Networking Capabilities:
          <input type="text" name="networking" value={formData.networkingCapabilities} onChange={handleInputChange} />
        </label>

        <label>
          Resources Offered:
          <input type="text" name="resourcesOffered" value={formData.resourcesOffered} onChange={handleInputChange} />
        </label>

        <label>
          Success Rate:
          <input type="text" name="successRate" value={formData.successRate} onChange={handleInputChange} />
        </label>

        <label>
          Cost or Fees:
          <input type="text" name="costOrFees" value={formData.costOrFees} onChange={handleInputChange} />
        </label>

        <label>
          Privacy and Security:
          <input type="text" name="privacyAndSecurity" value={formData.privacyAndSecurity} onChange={handleInputChange} />
        </label>
        <label>
          Reviews:
          <textarea name="reviews" value={formData.reviews} onChange={handleInputChange} />
        </label>

        <label>
            Rating:
            <select name="rating" value={formData.rating} onChange={handleRatingChange}>
            {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                {num}
                </option>
            ))}
            </select>
        </label>
        <label>
            Notes:
            <textarea name="notes" value={formData.notes} onChange={handleInputChange} />
            {errors.notes && <div className="error">{errors.notes}</div>}
        </label>
        <button type="submit">Submit</button>
    </form>
    </div>
  );
};

export default JobSiteForm;
