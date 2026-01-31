import React, { useState } from 'react';
import { Plus, CheckSquare, Square, X, Trash2 } from 'lucide-react';
import { ENDPOINTS } from '../../constants/api';
import './Sidebar.css';

const SimpleModal = ({ isOpen, onClose, title, onSave, note = null }) => {
  const [formTitle, setFormTitle] = useState(note?.title || '');
  const [formContent, setFormContent] = useState(note?.content || '');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    try {
      if (note) {
        // Edit existing note
        await fetch(ENDPOINTS.NOTE_BY_ID(note.id), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: formTitle, content: formContent })
        });
      } else {
        // Add new note
        await fetch(ENDPOINTS.NOTES, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: formTitle, content: formContent })
        });
      }
      onSave();
      setFormTitle('');
      setFormContent('');
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Note title..."
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            className="modal-input"
            autoFocus
          />
          <textarea
            placeholder="Write your note..."
            value={formContent}
            onChange={(e) => setFormContent(e.target.value)}
            className="modal-textarea"
            rows={10}
          />
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="modal-btn-cancel">
              Cancel
            </button>
            <button type="submit" className="modal-btn-save">
              {note ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

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

      <SimpleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Note"
        onSave={() => {
          onNoteAdded();
          setIsAddModalOpen(false);
        }}
      />
    </>
  );
};

export default Sidebar;