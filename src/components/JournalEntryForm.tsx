import React, { useState, useEffect } from 'react';

const JournalEntryForm = () => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');

    // Journal Entry State
    const [journalEntries, setJournalEntries] = useState([]);
    const [visibleEntries, setVisibleEntries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesToShow, setEntriesToShow] = useState(5);

    useEffect(() => {
        // Fetch journal entries when the component is mounted
        const fetchEntries = async () => {
            const response = await fetch('http://localhost:3001/journal-entries');
            if (response.ok) {
                const entries = await response.json();
                setJournalEntries(entries.sort((a, b) => new Date(b.date) - new Date(a.date))); // Sort by date descending
                setVisibleEntries(entries.slice(0, entriesToShow)); // Show initial 5 entries
            }
        };
        fetchEntries();
    }, [entriesToShow]); // Refetch when entriesToShow changes

    
    // Add a new journal entry
    const handleSubmit = async () => {
        if (!date || !content) {
            alert('Please fill in all the fields');
            return;
        }

        const entry = {
            date,
            content,
            tags: tags.split(',').map(tag => tag.trim())
        };

        
        // Send the data to the server
        const response = await fetch('http://localhost:3001/journal-entries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(entry),
        });
        if (response.ok) {

        // Clear the form
        setTitle('');
        setContent('');
        setTags('');
    } else {
        console.error('Error adding journal entry');
    }
    };

    // Load more entries
    const handleLoadMore = () => {
        // Increase the number of entries to show by 5
        setEntriesToShow(prevEntriesToShow => prevEntriesToShow + 5);
    };

    // Search entries
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);

        // Filter the journal entries based on the search term
        if (e.target.value) {
            const filteredEntries = journalEntries.filter(entry =>
                entry.content.toLowerCase().includes(e.target.value.toLowerCase()) ||
                entry.tags.some(tag => tag.toLowerCase().includes(e.target.value.toLowerCase()))
            );
            setVisibleEntries(filteredEntries);
        } else {
            setVisibleEntries(journalEntries.slice(0, entriesToShow));
        }
    };

    return (
        <div className="journal-container">
            <div className="form-container">
                <h2>Add a Journal Entry</h2>
                <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
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
<table className="journal-entries-table">
    <thead>
        <tr>
            <th>Date</th>
            <th>Entry</th>
            <th>Tags</th>
        </tr>
    </thead>
    <tbody>
        {visibleEntries.map((entry, index) => (
            <tr key={index}>
                <td>{entry.date}</td>
                <td>{entry.content}</td>
                <td>{entry.tags.join(', ')}</td>
            </tr>
        ))}
    </tbody>
</table>

                {searchTerm === '' && (
                    <button onClick={handleLoadMore}>Load More</button>
                )}
            </div>
        </div>
    );
};

export default JournalEntryForm;
