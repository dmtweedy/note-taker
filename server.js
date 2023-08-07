const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up lowdb
const adapter = new FileSync('db/db.json');
const db = low(adapter);

// Initialize the database with empty notes
db.defaults({ notes: [] }).write();

// Endpoint to get all notes
app.get('/api/notes', (req, res) => {
  const notes = db.get('notes').value();
  res.json(notes);
});

// Endpoint to save a new note
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  const notes = db.get('notes').value();
  newNote.id = notes.length + 1;
  db.get('notes').push(newNote).write();
  res.json(newNote);
});

// Endpoint to delete a note by ID
app.delete('/api/notes/:id', (req, res) => {
  const noteId = parseInt(req.params.id);
  db.get('notes').remove({ id: noteId }).write();
  res.json({ message: 'Note deleted successfully.' })
});

app.get('/notes', (req, res) => {
  res.setHeader('Cache-Control', 'no-store'); // Disable caching
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3000; // Use the PORT environment variable or default to 3000
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});