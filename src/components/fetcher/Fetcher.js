import React from 'react';
import "./Fetcher.css";

const Fetcher = ({ notes, loading, error, deleteNote }) => {


   const content =() =>{}
  return (
    <div>
      {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h2>Error: {error}</h2>
      ) : notes.length === 0 ? (
        <h2>No notes found</h2>
      ) : (
        <div>
          <div className="notes-list">
            {notes.map(note => (
              <div key={note.id} className="note-item">
                <div className="note-title">Title: {note.title}</div>
                <div className="note-content">Content: {note.content}</div>
                <button onClick={() => deleteNote(note.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Fetcher;