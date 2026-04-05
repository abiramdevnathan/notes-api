// Notes API Server
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8080;

const NOTES_FILE = path.join(__dirname, 'notes.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// GET /notes - return all notes
app.get('/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync(NOTES_FILE, 'utf8'));
    res.json(notes);
});

// GET /notes/:id - return a single note
app.get('/notes/:id', (req, res) => {
    const notes = JSON.parse(fs.readFileSync(NOTES_FILE, 'utf8'));
    const note = notes.find(n => n.id === req.params.id);
    if (!note) {
        return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
});

// POST /notes - create a new note
app.post('/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync(NOTES_FILE, 'utf8'));
    const newNote = {
        id: Date.now().toString(),
        title: req.body.title,
        description: req.body.description,
        body: req.body.body,
        createdAt: new Date().toISOString()
    };
    notes.push(newNote);
    fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2));
    res.status(201).json(newNote);
});

// DELETE /notes/:id - delete a note
app.delete('/notes/:id', (req, res) => {
    const notes = JSON.parse(fs.readFileSync(NOTES_FILE, 'utf8'));
    const filtered = notes.filter(n => n.id !== req.params.id);
    fs.writeFileSync(NOTES_FILE, JSON.stringify(filtered, null, 2));
    res.json({ message: 'Note deleted' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
