import React, { useState, useEffect } from 'react';
import Sidebar from './components/sidebar/Sidebar';
import NoteViewer from './components/note-viewer/NoteViewer';
import { useNotes } from './hooks/useNotes';
import './App.css'

function App() {
  const { notes, loading, error, fetchNotes, deleteNote, updateNote } = useNotes();
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);

  const toggleBulkMode = () => {
    setBulkMode(!bulkMode);
    setSelectedIds([]);
  };

  const selectAll = () => {
    setSelectedIds(selectedIds.length === notes.length ? [] : notes.map(n => n.id));
  };

  const deleteSelected = async () => {
    if (!selectedIds.length) return;
    if (!window.confirm(`Delete ${selectedIds.length} note(s)?`)) return;
    for (const id of selectedIds) {
      await deleteNote(id);
    }
    setSelectedIds([]);
    setBulkMode(false);
  };

  const handleNoteSelect = (note) => {
    setSelectedNote(note);
  };

  useEffect(() => {
    if (notes.length > 0 && !selectedNote) {
      setSelectedNote(notes[0]);
    } else if (notes.length > 0 && selectedNote && !notes.find(n => n.id === selectedNote.id)) {
      setSelectedNote(notes[0]);
    } else if (notes.length === 0) {
      setSelectedNote(null);
    }
  }, [notes, selectedNote]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="App">
      <div className="layout-container">
        <NoteViewer note={selectedNote} onUpdateNote={updateNote} />
        <Sidebar
          notes={notes}
          onNoteAdded={fetchNotes}
          deleteNote={deleteNote}
          updateNote={updateNote}
          selectedNote={selectedNote}
          onNoteSelect={handleNoteSelect}
          bulkMode={bulkMode}
          toggleBulkMode={toggleBulkMode}
          selectAll={selectAll}
          deleteSelected={deleteSelected}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          selectedCount={selectedIds.length}
          totalNotes={notes.length}
        />
      </div>
    </div>
  );
}

export default App;