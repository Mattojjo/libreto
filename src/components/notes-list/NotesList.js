import React, { useState } from 'react';
import { Edit2, CheckCircle } from 'lucide-react';
import "./NotesList.css";
import Modal from '../modal/Modal';
import { FormattedText } from '../../utils/textFormatter';

const NotesList = ({ notes = [], loading, error, deleteNote, updateNote, bulkMode, selectedIds, setSelectedIds }) => {
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

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <>
      <div className="notes-list">
        {notes.map((note) => (
          <div
            key={note.id}
            className={`note-item ${bulkMode ? 'bulk-mode' : ''} ${selectedIds.includes(note.id) ? 'selected' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => bulkMode ? toggleSelect(note.id) : openEditor(note)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                bulkMode ? toggleSelect(note.id) : openEditor(note);
              }
            }}
          >
            {bulkMode && (
              <div className="note-checkbox-wrapper" onClick={(e) => e.stopPropagation()}>
                {selectedIds.includes(note.id) ? (
                  <CheckCircle size={20} className="note-checkbox checked" onClick={() => toggleSelect(note.id)} />
                ) : (
                  <div className="note-checkbox unchecked" onClick={() => toggleSelect(note.id)} />
                )}
              </div>
            )}
            <FormattedText text={note.title} className="note-title" />
            <FormattedText text={note.content} className="note-content" />
            {!bulkMode && (
              <div className="note-actions">
                <button onClick={(e) => { e.stopPropagation(); openEditor(note); }}>
                  <Edit2 size={16} />
                </button>
              </div>
            )}
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

export default NotesList;