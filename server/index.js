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
    console.log('GET /api/notes endpoint hit');
    const data = readDb();
    if (!data) {
        console.log('Error reading data');
        return res.status(500).json({ message: 'Error reading data' });
    }
    console.log('Sending notes data:', JSON.parse(data));
    res.json(JSON.parse(data));
});

app.post('/api/notes', (req, res) => {
    try {
        const notes = JSON.parse(readDb()) || [];
        const newNote = {
            id: Date.now(),
            title: req.body.title,
            content: req.body.content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
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

// PUT endpoint implementation
app.put('/api/notes/:id', (req, res) => {
    try {
        const notes = JSON.parse(readDb()) || [];
        const id = parseInt(req.params.id);
        const { title, content } = req.body;
        
        const noteIndex = notes.findIndex(note => note.id === id);
        
        if (noteIndex === -1) {
            return res.status(404).json({ message: 'Note not found' });
        }

        notes[noteIndex] = {
            ...notes[noteIndex],
            title: title || notes[noteIndex].title,
            content: content || notes[noteIndex].content,
            updatedAt: new Date().toISOString()
        };

        if (writeDb(notes)) {
            res.json({ message: 'Note updated successfully', note: notes[noteIndex] });
        } else {
            res.status(500).json({ message: 'Error writing data' });
        }
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`API available at http://localhost:${port}/api/notes`);
});