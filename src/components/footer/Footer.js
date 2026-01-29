import React, { useState } from 'react';
import './Footer.css'

const Footer = ({ onNoteAdded }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;
    setSubmitting(true);
    try {
      const response = await fetch('http://localhost:3001/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), content: content.trim() }),
      });
      if (!response.ok) throw new Error('Failed to add note');
      setTitle('');
      setContent('');
      if (onNoteAdded) onNoteAdded();
    } catch (err) {
      console.error(err);
      alert('Failed to add note');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="footer">
      <form className="footer-form" onSubmit={handleSubmit} noValidate>
        <label className="sr-only" htmlFor="note-title">Note title</label>
        <input
          id="note-title"
          className="footer-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note Title"
          aria-label="Note title"
        />

        <label className="sr-only" htmlFor="note-content">Note content</label>
        <input
          id="note-content"
          className="footer-input footer-input--wide"
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Note Content"
          aria-label="Note content"
        />

        <button
          className="footer-btn"
          type="submit"
          disabled={submitting || (!title.trim() && !content.trim())}
        >
          {submitting ? 'Adding…' : 'Submit'}
        </button>
      </form>
    </footer>
  );
};

export default Footer;