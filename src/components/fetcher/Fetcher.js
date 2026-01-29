import React from 'react';
import "./Fetcher.css";

const Fetcher = ({ notes = [], loading, error, deleteNote }) => {
  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>Error: {error}</h2>;
  if (!notes.length) return <h2>No notes found</h2>;

  return (
    <div className="notes-list">
      {notes.map((note) => (
        <div key={note.id} className="note-item">
          <div className="note-title">{note.title}</div>
          <div className="note-content">{note.content}</div>
          <button onClick={() => deleteNote?.(note.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default Fetcher;