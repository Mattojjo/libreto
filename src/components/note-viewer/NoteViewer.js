import React, { useState, useEffect } from 'react';
import { FormattedText } from '../../utils/textFormatter';
import { Edit2, Save, X } from 'lucide-react';

const NoteViewer = ({ note, onUpdateNote }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note?.title || '');
  const [editContent, setEditContent] = useState(note?.content || '');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, [note?.id]);

  useEffect(() => {
    if (note) {
      setEditTitle(note.title);
      setEditContent(note.content);
    }
  }, [note]);

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center h-full text-muted bg-surface rounded-l-lg p-8">
        <div className="text-center">
          <div className="text-5xl mb-4">📝</div>
          <h2 className="text-xl font-semibold mb-2">Select a note to view</h2>
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
    <div className={`flex-1 overflow-y-auto p-8 bg-surface transform transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className="flex flex-col mb-8">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="text-[2rem] font-bold border border-surface rounded p-2 mb-2 bg-base text-white outline-none w-full"
            placeholder="Note title..."
          />
        ) : (
          <div className="mb-2">
            <div className="inline-block bg-white/5 px-3 py-1 rounded-md font-poppins text-[2rem] font-bold text-foreground truncate">{note.title}</div>
          </div>
        )}
        <div className="flex gap-4 mb-4 flex-wrap">
          <span className="text-muted text-sm">Created: {formatDate(note.createdAt)}</span>
          {note.updatedAt && note.updatedAt !== note.createdAt && (
            <span className="text-muted text-sm">Updated: {formatDate(note.updatedAt)}</span>
          )}
        </div>
        <div className="flex gap-2 self-end">
          {isEditing ? (
            <>
              <button
                className="bg-transparent border-none cursor-pointer p-2 rounded flex items-center justify-center transition-colors text-accent hover:bg-accent/10"
                onClick={handleSave}
                title="Save"
              >
                <Save size={16} />
              </button>
              <button
                className="bg-transparent border-none cursor-pointer p-2 rounded flex items-center justify-center transition-colors text-danger hover:bg-danger/10"
                onClick={handleCancel}
                title="Cancel"
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <button
              className="bg-transparent border-none cursor-pointer p-2 rounded flex items-center justify-center transition-colors text-accent hover:bg-accent/10"
              onClick={handleEdit}
              title="Edit"
            >
              <Edit2 size={16} />
            </button>
          )}
        </div>
      </div>
      <div>
        {isEditing ? (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full min-h-[400px] border border-surface rounded p-4 bg-base text-white font-[inherit] text-base resize-y outline-none"
            placeholder="Write your note..."
            rows={20}
          />
        ) : (
          <div className="bg-white/3 p-4 rounded-md">
            <FormattedText text={note.content} className="text-foreground leading-relaxed" />
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteViewer;


