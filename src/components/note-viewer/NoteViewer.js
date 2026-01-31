import React, { useState } from 'react';
import { FormattedText } from '../../utils/textFormatter';
import { Edit2, Save, X } from 'lucide-react';
import './NoteViewer.css';

const NoteViewer = ({ note, onUpdateNote }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note?.title || '');
  const [editContent, setEditContent] = useState(note?.content || '');

  if (!note) {
    return (
      <div className="note-viewer empty-viewer">
        <div className="empty-note-state">
          <div className="empty-note-icon">📝</div>
          <h2>Select a note to view</h2>
          <p>Choose a note from the sidebar to see its content here</p>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editTitle.trim() || !editContent.trim()) return;
    await onUpdateNote(note.id, { title: editTitle, content: editContent });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className='note-viewer'>
      <div className="note-viewer-header">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="note-edit-title"
            placeholder="Note title..."
          />
        ) : (
          <h1 className="note-viewer-title">{note.title}</h1>
        )}
        <div className="note-viewer-meta">
          <span className="note-meta-item">
            Created: {formatDate(note.createdAt)}
          </span>
          {note.updatedAt && note.updatedAt !== note.createdAt && (
            <span className="note-meta-item">
              Updated: {formatDate(note.updatedAt)}
            </span>
          )}
        </div>
        <div className="note-viewer-actions">
          {isEditing ? (
            <>
              <button className="note-action-btn save-btn" onClick={handleSave} title="Save">
                <Save size={16} />
              </button>
              <button className="note-action-btn cancel-btn" onClick={handleCancel} title="Cancel">
                <X size={16} />
              </button>
            </>
          ) : (
            <button className="note-action-btn edit-btn" onClick={handleEdit} title="Edit">
              <Edit2 size={16} />
            </button>
          )}
        </div>
      </div>
      <div className="note-viewer-content">
        {isEditing ? (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="note-edit-content"
            placeholder="Write your note..."
            rows={20}
          />
        ) : (
          <FormattedText text={note.content} />
        )}
      </div>
    </div>
  );
};

export default NoteViewer;