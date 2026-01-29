import React, { useState, useEffect } from 'react';
import './Modal.css';

const Modal = ({ isOpen, note, onClose, onSave, onDelete }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (note) {
            setTitle(note.title || '');
            setContent(note.content || '');
        }
    }, [note]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!note) return onClose();
        onSave({ ...note, title: title.trim(), content: content.trim() });
    };

    const handleDelete = async () => {
        if (!note) return;
        // optional confirmation
        if (!window.confirm('Delete this note?')) return;
        if (onDelete) await onDelete(note.id);
        onClose();
    };

    return (
        <div className="modal-overlay" onMouseDown={onClose}>
            <div className="modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                <h3 className="modal-title">Edit Note</h3>
                <form className="modal-form" onSubmit={handleSubmit}>
                    <label className="modal-label">Title</label>
                    <input className="modal-input" value={title} onChange={(e) => setTitle(e.target.value)} />

                    <label className="modal-label">Content</label>
                    <textarea className="modal-textarea" value={content} onChange={(e) => setContent(e.target.value)} rows={6} />

                    <div className="modal-actions">
                        <button type="button" className="modal-btn modal-btn--cancel" onClick={onClose}>Cancel</button>
                        <button type="button" className="modal-btn modal-btn--danger" onClick={handleDelete}>Delete</button>
                        <button type="submit" className="modal-btn modal-btn--save">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;
