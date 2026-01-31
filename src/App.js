import React, { useState } from 'react';
import Header from './components/header/Header';
import NotesList from './components/notes-list/NotesList';
import { useNotes } from './hooks/useNotes';

function App() {
  const { notes, loading, error, fetchNotes, deleteNote, updateNote } = useNotes();
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

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

  return (
    <div className="App">
      <Header
        onNoteAdded={fetchNotes}
        bulkMode={bulkMode}
        toggleBulkMode={toggleBulkMode}
        selectAll={selectAll}
        deleteSelected={deleteSelected}
        selectedCount={selectedIds.length}
        totalNotes={notes.length}
      />
      <NotesList
        notes={notes}
        loading={loading}
        error={error}
        deleteNote={deleteNote}
        updateNote={updateNote}
        bulkMode={bulkMode}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
      />
    </div>
  );
}

export default App;