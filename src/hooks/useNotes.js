import { useState, useEffect, useCallback } from 'react';
import { ENDPOINTS } from '../constants/api';

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(ENDPOINTS.NOTES);
      if (!response.ok) throw new Error('Failed to fetch notes');
      const data = await response.json();
      setNotes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteNote = async (id) => {
    try {
      await fetch(ENDPOINTS.NOTE_BY_ID(id), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      fetchNotes();
    } catch (error) {
      console.log(error);
    }
  };

  const updateNote = async (id, { title, content }) => {
    try {
      await fetch(ENDPOINTS.NOTE_BY_ID(id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      });
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return {
    notes,
    loading,
    error,
    fetchNotes,
    deleteNote,
    updateNote
  };
};