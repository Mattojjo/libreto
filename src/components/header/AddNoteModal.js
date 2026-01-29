import React, { useState } from 'react';
import './AddNoteModal.css';

const AddNoteModal = ({ isOpen, onClose, onNoteAdded }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

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
            onClose();
        } catch (err) {
            console.error(err);
            alert('Failed to add note');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onMouseDown={onClose}>
            <div className="add-modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                <h3 className="add-modal-title">Add New Note</h3>
                <form className="add-modal-form" onSubmit={handleSubmit}>
                    <label className="add-modal-label">Title</label>
                    <input
                        className="add-modal-input"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter note title"
                        autoFocus
                    />

                    <label className="add-modal-label">Content</label>
                    <textarea
                        className="add-modal-textarea"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Enter note content"
                        rows={6}
                    />

                    <div className="add-modal-actions">
                        <button type="button" className="add-modal-btn add-modal-btn--cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="add-modal-btn add-modal-btn--save"
                            disabled={submitting || (!title.trim() && !content.trim())}
                        >
                            {submitting ? 'Adding…' : 'Add Note'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddNoteModal;
