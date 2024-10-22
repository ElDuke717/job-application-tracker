import React, { useState, useEffect } from 'react';
import JournalEntryModal from './JournalEntryModal';
import { v4 as uuidv4 } from 'uuid';
import Footer from './Footer';

const JournalEntryForm = () => {
    const [date, setDate] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');

    // Journal Entry State
    const [journalEntries, setJournalEntries] = useState([]);
    const [visibleEntries, setVisibleEntries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesToShow, setEntriesToShow] = useState(5);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEntry, setCurrentEntry] = useState(null);

    const handleOpenModal = (entry) => {
        setCurrentEntry(entry);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveEntry = async (updatedEntry) => {
        try {
            const response = await fetch(`http://localhost:3001/journal-entries/${updatedEntry.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedEntry),
            });
    
            if (response.ok) {
                // Update journalEntries state
                const updatedEntries = journalEntries.map(entry =>
                    entry.id === updatedEntry.id ? updatedEntry : entry
                );
                setJournalEntries(updatedEntries);
    
                // Also update visibleEntries state if it includes the updated entry
                const updatedVisibleEntries = visibleEntries.map(entry =>
                    entry.id === updatedEntry.id ? updatedEntry : entry
                );
                setVisibleEntries(updatedVisibleEntries);
            } else {
                console.error('Error saving journal entry:', response);
            }
        } catch (error) {
            console.error('Error saving journal entry:', error);
        }
        
        handleCloseModal();
    };

    useEffect(() => {
        // Fetch journal entries when the component is mounted
        const fetchEntries = async () => {
            try {
                const response = await fetch('http://localhost:3001/journal-entries');
                if (response.ok) {
                    const entries = await response.json();
                    // Sort by date descending
                    const sortedEntries = entries.sort((a, b) => new Date(b.date) - new Date(a.date));
                    setJournalEntries(sortedEntries);
                    setVisibleEntries(sortedEntries.slice(0, entriesToShow)); // Show initial entries
                } else {
                    console.error('Error fetching journal entries:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching journal entries:', error);
            }
        };
        fetchEntries();
    }, [entriesToShow]); // Refetch when entriesToShow changes

    // Helper function to format tags
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

    // Add a new journal entry
    const handleSubmit = async () => {
        if (!date || !content) {
            alert('Please fill in all the fields');
            return;
        }

        // Format tags as an array
        const tagsArray = tags.split(',').map(tag => tag.trim());

        const entry = {
            id: uuidv4(),
            date,
            content,
            tags: tagsArray
        };

        try {
            // Send the data to the server
            const response = await fetch('http://localhost:3001/journal-entries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(entry),
            });
            if (response.ok) {
                // Optionally, fetch the updated entries or append the new entry
                setJournalEntries(prevEntries => [entry, ...prevEntries]);
                setVisibleEntries(prevVisible => [entry, ...prevVisible].slice(0, entriesToShow));

                // Clear the form
                setDate('');
                setContent('');
                setTags('');
            } else {
                console.error('Error adding journal entry:', response.statusText);
                alert('Failed to add journal entry.');
            }
        } catch (error) {
            console.error('Error adding journal entry:', error);
            alert('An error occurred while adding the journal entry.');
        }
    };

    // Load more entries
    const handleLoadMore = () => {
        // Increase the number of entries to show by 5
        setEntriesToShow(prevEntriesToShow => prevEntriesToShow + 5);
    };

    // Search entries
    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        // Filter the journal entries based on the search term
        if (term) {
            const lowerTerm = term.toLowerCase();
            const filteredEntries = journalEntries.filter(entry =>
                entry.content.toLowerCase().includes(lowerTerm) ||
                (entry.tags && formatTags(entry.tags).toLowerCase().includes(lowerTerm))
            );
            setVisibleEntries(filteredEntries.slice(0, entriesToShow));
        } else {
            setVisibleEntries(journalEntries.slice(0, entriesToShow));
        }
    };

    return (
        <>
            <div className="journal-container">
                <div className="form-container">
                    <h2>Add a Journal Entry</h2>
                    <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        placeholder="Select Date"
                    />
                    <textarea 
                        className="journal-entry-content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="How did the job search go today?  What did you accomplish?  What are you proud of?  What are you struggling with?  What are you grateful for?  What are you looking forward to tomorrow?  Write it all down here"
                    />
                    <input 
                        type="text" 
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="Tags (comma-separated)" 
                    />
                    <button onClick={handleSubmit}>Submit Entry</button>
                </div>
                <div className="journal-entries table-container">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Search journal entries"
                    />
                    <h2>Journal Entries</h2>
                    { isModalOpen && <JournalEntryModal 
                        entry={currentEntry}
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        onSave={handleSaveEntry}
                    />}
                <table className="journal-entries-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Entry</th>
                            <th>Tags</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleEntries.map((entry) => (
                            <tr key={entry.id}>
                                <td>{new Date(entry.date).toLocaleDateString()}</td>
                                <td className='table-journal-content'>{entry.content}</td>
                                <td>{formatTags(entry.tags)}</td>
                                <td>
                                    <button onClick={() => handleOpenModal(entry)}>View/Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                    {searchTerm === '' && (
                        <button onClick={handleLoadMore}>Load More</button>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default JournalEntryForm;