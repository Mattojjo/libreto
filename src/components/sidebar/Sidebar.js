import React, { useState } from 'react';
import { Plus, CheckSquare, Square, X, Trash2, Edit2 } from 'lucide-react';
import AddNoteModal from '../header/AddNoteModal';
import Modal from '../modal/Modal';
import './Sidebar.css';

const Sidebar = ({ 
  notes = [], 
  onNoteAdded, 
  deleteNote, 
  updateNote, 
  selectedNote,
  onNoteSelect,
  bulkMode, 
  toggleBulkMode, 
  selectAll, 
  deleteSelected, 
  selectedIds, 
  setSelectedIds,
  selectedCount, 
  totalNotes 
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState(null);

  const openEditor = (note, e) => {
    e.stopPropagation();
    setNoteToEdit(note);
    setIsEditModalOpen(true);
  };

  const closeEditor = () => {
    setIsEditModalOpen(false);
    setNoteToEdit(null);
  };

  const handleSave = async (updated) => {
    if (updateNote) await updateNote(updated.id, { title: updated.title, content: updated.content });
    closeEditor();
  };

  const toggleSelect = (id, e) => {
    e.stopPropagation();
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <>
      <div className="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">Libreto</h1>
          <div className="sidebar-actions">
            <button
              className="sidebar-bulk-btn"
              onClick={toggleBulkMode}
              title={bulkMode ? 'Cancel selection' : 'Select multiple'}
            >
              {bulkMode ? <X size={18} /> : <CheckSquare size={18} />}
            </button>
            <button
              className="sidebar-add-btn"
              onClick={() => setIsAddModalOpen(true)}
              title="Add new note"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {bulkMode && (
          <div className="bulk-controls">
            <button
              className="sidebar-select-all-btn"
              onClick={selectAll}
              title={selectedCount === totalNotes ? 'Deselect all' : 'Select all'}
            >
              {selectedCount === totalNotes ? <Square size={16} /> : <CheckSquare size={16} />}
              <span>Select All</span>
            </button>
            <button
              className="sidebar-delete-btn"
              onClick={deleteSelected}
              disabled={selectedCount === 0}
              title={`Delete ${selectedCount} selected`}
            >
              <Trash2 size={16} />
              <span>Delete ({selectedCount})</span>
            </button>
          </div>
        )}

        <div className="notes-sidebar-list">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`note-sidebar-item ${selectedNote?.id === note.id ? 'active' : ''} ${bulkMode ? 'bulk-mode' : ''} ${selectedIds.includes(note.id) ? 'selected' : ''}`}
              onClick={() => bulkMode ? toggleSelect(note.id, { stopPropagation: () => {} }) : onNoteSelect(note)}
            >
              {bulkMode && (
                <div className="bulk-checkbox" onClick={(e) => toggleSelect(note.id, e)}>
                  {selectedIds.includes(note.id) ? <CheckSquare size={16} /> : <Square size={16} />}
                </div>
              )}
              <div className="note-sidebar-content">
                <h3 className="note-sidebar-title">{note.title}</h3>
                <p className="note-sidebar-preview">
                  {note.content.slice(0, 60)}{note.content.length > 60 ? '...' : ''}
                </p>
                <span className="note-sidebar-date">
                  {formatDate(note.createdAt || note.updatedAt)}
                </span>
              </div>
              {!bulkMode && (
                <button
                  className="note-edit-btn"
                  onClick={(e) => openEditor(note, e)}
                  title="Edit note"
                >
                  <Edit2 size={14} />
                </button>
              )}
            </div>
          ))}
          {notes.length === 0 && (
            <div className="empty-state">
              <p>No notes yet</p>
              <p>Click the + button to create your first note</p>
            </div>
          )}
        </div>
      </div>

      <AddNoteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onNoteAdded={(newNote) => {
          onNoteAdded();
          setIsAddModalOpen(false);
        }}
      />

      {noteToEdit && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={closeEditor}
          note={noteToEdit}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default Sidebar;