import React, { useState, useEffect } from 'react';

const JournalEntryModal = ({ entry, isOpen, onClose, onSave }) => {
    const [editedEntry, setEditedEntry] = useState(entry || { date: '', content: '', tags: [] });

    useEffect(() => {
        if (!entry) {
        setEditedEntry(entry); // Set the edited entry when the entry prop changes
        }
    }, [entry]);

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
                    value={editedEntry.tags.join(', ')}
                    onChange={(e) => setEditedEntry({ ...editedEntry, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                />
                <button onClick={handleSave}>Save</button>
            </div>
        </div>
    );
};

export default JournalEntryModal;