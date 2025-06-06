const express = require('express');
const app = express();
const port = 3001;

app.use(express.json());
const cors = require('cors');
app.use(cors());

const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');

function readDb() {
    try {
        return fs.readFileSync(dbPath, 'utf-8');
    } catch (error) {
        console.error('Error reading file:', error);
        return null;
    }
}

function writeDb(data) {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing file:', error);
        return false;
    }
}

app.get('/api/notes', (req, res) => {
    const data = readDb();
    if (!data) return res.status(500).json({ message: 'Error reading data' });
    res.json(JSON.parse(data));
});

app.post('/api/notes', (req, res) => {
    try {
        const notes = JSON.parse(readDb()) || [];
        const newNote = {
            id: Date.now(),
            title: req.body.title,
            content: req.body.content
        };
        notes.push(newNote);
        if (writeDb(notes)) {
            res.json({ message: 'Note added successfully' });
        } else {
            res.status(500).json({ message: 'Error writing data' });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE endpoint implementation
app.delete('/api/notes/:id', (req, res) => {
    try {
        const notes = JSON.parse(readDb()) || [];
        const id = parseInt(req.params.id);
        
        const filteredNotes = notes.filter(note => note.id !== id);
        
        if (notes.length === filteredNotes.length) {
            return res.status(404).json({ message: 'Note not found' });
        }

        if (writeDb(filteredNotes)) {
            res.json({ message: 'Note deleted successfully' });
        } else {
            res.status(500).json({ message: 'Error writing data' });
        }
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});