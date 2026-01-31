import React, { useState } from 'react';
import Sidebar from './components/sidebar/Sidebar';
import NoteViewer from './components/note-viewer/NoteViewer';
import { useNotes } from './hooks/useNotes';

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

  if (loading) {
    return (
      <div className="App">
        <div className="loading-state">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <div className="error-state">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="App">
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
      <NoteViewer note={selectedNote} className="main-content" />
    </div>
  );
}

export default App;