// Notes API Server — SQLite version
const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const PORT = 8080;

// Open (or create) the database file
const db = new Database(path.join(__dirname, 'notes.db'));

// Create the notes table if it doesn't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        body TEXT,
        createdAt TEXT DEFAULT (datetime('now'))
    )
`);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// GET /notes - return all notes
app.get('/notes', (req, res) => {
    const notes = db.prepare('SELECT * FROM notes ORDER BY id DESC').all();
    res.json(notes);
});

// GET /notes/:id - return a single note
app.get('/notes/:id', (req, res) => {
    const note = db.prepare('SELECT * FROM notes WHERE id = ?').get(req.params.id);
    if (!note) {
        return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
});

// POST /notes - create a new note
app.post('/notes', (req, res) => {
    const result = db.prepare(
        'INSERT INTO notes (title, description, body) VALUES (?, ?, ?)'
    ).run(req.body.title, req.body.description, req.body.body);

    const newNote = db.prepare('SELECT * FROM notes WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newNote);
});

// DELETE /notes/:id - delete a note
app.delete('/notes/:id', (req, res) => {
    db.prepare('DELETE FROM notes WHERE id = ?').run(req.params.id);
    res.json({ message: 'Note deleted' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
