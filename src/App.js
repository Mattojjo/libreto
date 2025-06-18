import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Fetcher from './components/fetcher/Fetcher';

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="App">
      <Header />
      <Fetcher notes={notes} loading={loading} error={error} deleteNote={deleteNote} />
      <Footer onNoteAdded={fetchNotes} />
    </div>
  );
}

export default App;