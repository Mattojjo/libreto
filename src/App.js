import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/header/Header';
import Fetcher from './components/fetcher/Fetcher';

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/notes');
      if (!response.ok) throw new Error('Failed to fetch notes');
      const data = await response.json();
      setNotes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);


  const deleteNote = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/notes/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      // Re-fetch notes from server for consistency
      fetchNotes();
    } catch (error) {
      console.log(error);
    }
  };

  const updateNote = async (id, { title, content }) => {
    try {
      await fetch(`http://localhost:3001/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      });
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

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
      <Fetcher
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