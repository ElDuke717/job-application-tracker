import React, { useState, useEffect } from 'react';

const JournalEntryModal = ({ entry, isOpen, onClose, onSave }) => {
    const [editedEntry, setEditedEntry] = useState(entry || { date: '', content: '', tags: [] });

    useEffect(() => {
        if (entry) {
            setEditedEntry(entry); // Update when entry prop changes and is truthy
        }
    }, [entry]);

    // Helper function to format tags for display
    const formatTags = (tags) => {
        let tagsArray = [];

        if (typeof tags === 'string') {
            try {
                // Attempt to parse the string as JSON
                tagsArray = JSON.parse(tags);

                // Ensure the parsed data is an array
                if (!Array.isArray(tagsArray)) {
                    throw new Error('Parsed tags data is not an array.');
                }
            } catch (error) {
                console.error('Error parsing tags:', error);
                // Fallback: Split the string by commas if JSON parsing fails
                tagsArray = tags.split(',').map(tag => tag.trim());
            }
        } else if (Array.isArray(tags)) {
            // If tags are already an array, use them directly
            tagsArray = tags;
        } else {
            // Handle other data types if necessary
            tagsArray = [String(tags)];
        }

        return tagsArray.join(', ');
    };

    // Handler for saving the edited entry
    const handleSave = () => {
        onSave(editedEntry); // Pass the edited entry back to the parent component
        onClose(); // Close the modal
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Edit Journal Entry</h2>
                <input 
                    type="date"
                    value={editedEntry.date}
                    onChange={(e) => setEditedEntry({ ...editedEntry, date: e.target.value })}
                />
                <textarea 
                    value={editedEntry.content}
                    onChange={(e) => setEditedEntry({ ...editedEntry, content: e.target.value })}
                />
                <input 
                    type="text"
                    value={formatTags(editedEntry.tags)}
                    onChange={(e) => {
                        const input = e.target.value;
                        const tagsArray = input.split(',').map(tag => tag.trim());
                        setEditedEntry({ ...editedEntry, tags: tagsArray });
                    }}
                    placeholder="Tags (comma-separated)" 
                />
                <button onClick={handleSave}>Save</button>
            </div>
        </div>
    );
};

export default JournalEntryModal;