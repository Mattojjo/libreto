import React, { useState } from 'react';
import "./Fetcher.css";
import Modal from '../modal/Modal';

const Fetcher = ({ notes = [], loading, error, deleteNote, updateNote }) => {
  const [selectedNote, setSelectedNote] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>Error: {error}</h2>;
  if (!notes.length) return <h2>No notes found</h2>;

  const openEditor = (note) => {
    setSelectedNote(note);
    setIsOpen(true);
  };

  const closeEditor = () => {
    setIsOpen(false);
    setSelectedNote(null);
  };

  const handleSave = async (updated) => {
    if (updateNote) await updateNote(updated.id, { title: updated.title, content: updated.content });
    closeEditor();
  };

  return (
    <>
      <div className="notes-list">
        {notes.map((note) => (
          <div
            key={note.id}
            className="note-item"
            role="button"
            tabIndex={0}
            onClick={() => openEditor(note)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openEditor(note);
              }
            }}
          >
            <div className="note-title">{note.title}</div>
            <div className="note-content">{note.content}</div>
            <div className="note-actions">
              <button onClick={(e) => { e.stopPropagation(); openEditor(note); }}>Edit</button>
            </div>
          </div>
        ))}
      </div>
      <Modal
        isOpen={isOpen}
        note={selectedNote}
        onClose={closeEditor}
        onSave={handleSave}
        onDelete={async (id) => {
          if (deleteNote) await deleteNote(id);
        }}
      />
    </>
  );
};

export default Fetcher;