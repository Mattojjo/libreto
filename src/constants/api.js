export const API_BASE_URL = 'http://localhost:3001/api';
export const ENDPOINTS = {
  NOTES: `${API_BASE_URL}/notes`,
  NOTE_BY_ID: (id) => `${API_BASE_URL}/notes/${id}`
};