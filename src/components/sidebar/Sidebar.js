import React, { useState } from 'react';
import { Plus, CheckSquare, Square, X, Trash2 } from 'lucide-react';
import { ENDPOINTS } from '../../constants/api';

const SimpleModal = ({ isOpen, onClose, title, onSave, note = null, existingIds = [], setRecentlyAddedId = () => {} }) => {
  const [formTitle, setFormTitle] = useState(note?.title || '');
  const [formContent, setFormContent] = useState(note?.content || '');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    try {
      if (note) {
        await fetch(ENDPOINTS.NOTE_BY_ID(note.id), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: formTitle, content: formContent })
        });
      } else {
        await fetch(ENDPOINTS.NOTES, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: formTitle, content: formContent })
        });
      }

      await onSave();

      // detect new note by comparing ids
      try {
        const resp = await fetch(ENDPOINTS.NOTES);
        const data = await resp.json();
        const newNote = data.find(n => !existingIds.includes(n.id));
        if (newNote) {
          setRecentlyAddedId(newNote.id);
          setTimeout(() => setRecentlyAddedId(null), 3000);
        }
      } catch (err) {
        console.error('Error detecting new note:', err);
      }

      setFormTitle('');
      setFormContent('');
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] transition-discrete" onClick={onClose}>
      <div className="bg-surface w-[90%] max-w-[500px] p-6 rounded-lg transform transition-discrete" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <button className="bg-transparent border-none text-muted cursor-pointer text-2xl leading-none" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Note title..." value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="w-full p-3 border border-white/10 bg-base text-foreground mb-4 outline-none rounded-md" autoFocus />
          <textarea placeholder="Write your note..." value={formContent} onChange={(e) => setFormContent(e.target.value)} className="w-full p-3 border border-white/10 bg-base text-foreground mb-4 min-h-[7.5rem] resize-y outline-none rounded-md" rows={10} />
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 border-none cursor-pointer bg-white/10 text-foreground rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 border-none cursor-pointer bg-accent text-white rounded-md">{note ? 'Update' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Sidebar = ({ notes = [], onNoteAdded, deleteNote, updateNote, selectedNote, onNoteSelect, bulkMode, toggleBulkMode, selectAll, deleteSelected, selectedIds, setSelectedIds, selectedCount, totalNotes }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [recentlyAddedId, setRecentlyAddedId] = useState(null);

  const toggleSelect = (id, e) => {
    e.stopPropagation();
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
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
      <div className="w-[17.5rem] bg-surface border-l border-white/10 flex flex-col overflow-hidden rounded-r-lg">
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h1 className="text-xl font-bold text-foreground">Libreto</h1>
          <div className="flex gap-2">
            <button className="w-8 h-8 border-none bg-white/10 text-foreground cursor-pointer flex items-center justify-center rounded-md" onClick={toggleBulkMode} title={bulkMode ? 'Cancel selection' : 'Select multiple'}>
              {bulkMode ? <X size={18} /> : <CheckSquare size={18} />}
            </button>
            <button className="w-8 h-8 border-none bg-accent text-white cursor-pointer flex items-center justify-center rounded-md" onClick={() => setIsAddModalOpen(true)} title="Add new note">
              <Plus size={18} />
            </button>
          </div>
        </div>

        {bulkMode && (
          <div className="p-2 border-b border-white/10 flex gap-2">
            <button className="p-2 border-none cursor-pointer text-sm flex items-center gap-1 bg-accent/20 text-accent rounded-md" onClick={selectAll} title={selectedCount === totalNotes ? 'Deselect all' : 'Select all'}>
              {selectedCount === totalNotes ? <Square size={16} /> : <CheckSquare size={16} />}
              <span>Select All</span>
            </button>
            <button className="p-2 border-none cursor-pointer text-sm flex items-center gap-1 bg-danger/20 text-danger rounded-md disabled:opacity-50" onClick={deleteSelected} disabled={selectedCount === 0} title={`Delete ${selectedCount} selected`}>
              <Trash2 size={16} />
              <span>Delete ({selectedCount})</span>
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {notes.map((note) => {
            const isActive = selectedNote?.id === note.id;
            const isSelected = selectedIds.includes(note.id);
            return (
              <div key={note.id} className={`relative p-3 border-b border-white/5 cursor-pointer flex gap-2 transition-colors rounded-md ${isActive ? 'bg-accent/15' : isSelected ? 'bg-white/10' : 'hover:bg-white/5'}`} onClick={() => bulkMode ? toggleSelect(note.id, { stopPropagation: () => {} }) : onNoteSelect(note)}>
                {note.id === recentlyAddedId && (
                  <span className="absolute right-3 top-3 flex items-center">
                    <span className="w-3 h-3 bg-accent rounded-full absolute opacity-75 animate-ping"></span>
                    <span className="w-3 h-3 bg-accent rounded-full relative"></span>
                  </span>
                )}
                {bulkMode && (
                  <div className="text-accent shrink-0 flex items-start pt-0.5" onClick={(e) => toggleSelect(note.id, e)}>
                    {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="mb-1">
                    <div className="inline-block bg-white/5 px-2 py-1 rounded-md font-poppins text-sm font-semibold text-foreground truncate">{note.title}</div>
                  </div>
                  <div>
                    <div className="inline-block bg-white/3 px-2 py-1 rounded-md text-xs text-muted truncate">
                      {note.content.slice(0, 60)}{note.content.length > 60 ? '...' : ''}
                    </div>
                  </div>
                  <span className="text-[0.7rem] text-muted block mt-2">{formatDate(note.createdAt || note.updatedAt)}</span>
                </div>
              </div>
            );
          })}
          {notes.length === 0 && (
            <div className="py-8 px-4 text-center text-muted">
              <p>No notes yet</p>
              <p className="mt-1">Click the + button to create your first note</p>
            </div>
          )}
        </div>
      </div>

      <SimpleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Note"
        onSave={async () => {
          await onNoteAdded();
          setIsAddModalOpen(false);
        }}
        existingIds={notes.map(n => n.id)}
        setRecentlyAddedId={setRecentlyAddedId}
      />
    </>
  );
};

export default Sidebar;



