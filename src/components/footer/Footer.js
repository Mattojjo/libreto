import React, { useState } from 'react';
import './Footer.css'

const Footer = ({ onNoteAdded }) => {
  const [newNote, setNewNote] = useState("");
  const [noteContent, setNoteContent] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newNote, content: noteContent }),
      });
      if (!response.ok) throw new Error('Failed to add note');
      setNewNote("");
      setNoteContent("");
      if (onNoteAdded) onNoteAdded(); // Trigger refresh
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add note');
    }
  };

  return (
    <div className="footer">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder='Note Title'
          id="noteInput"
          name="note"
        />
           <input
          type="text"
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder='Note Content'
          id="noteInput"
          name="note"
        />
        <button type="submit" onClick={handleSubmit}>Submit</button>
      </form>
    </div>
  );
};

export default Footer;