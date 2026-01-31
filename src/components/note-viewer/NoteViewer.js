import React from 'react';
import { FormattedText } from '../../utils/textFormatter';
import './NoteViewer.css';

const NoteViewer = ({ note }) => {
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
        <h1 className="note-viewer-title">{note.title}</h1>
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
      </div>
      <div className="note-viewer-content">
        <FormattedText text={note.content} />
      </div>
    </div>
  );
};

export default NoteViewer;