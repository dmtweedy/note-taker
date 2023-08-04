const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// middleware for serving static files
app.use(express.static('public'));

// middleware for parsing JSON in the request body
app.use(express.json());

// path to the db.json file
const notesData = path.join(__dirname, 'db', 'db.json');

// html routes
app.get('/notes', (res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('*', (res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// api routes
app.get('/api/notes', (res) => {
  fs.readFile(notesData, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read notes data.' });
    }
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

app.post('/api/notes', (req, res) => {
  fs.readFile(notesData, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read notes data.' });
    }

    const notes = JSON.parse(data);
    const newNote = {
      id: notes.length + 1,
      title: req.body.title,
      text: req.body.text,
    };
    notes.push(newNote);


  });
});


app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  fs.readFile(notesData, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read notes data.' });
    }
    const notes = JSON.parse(data);
    const updatedNotes = notes.filter((note) => note.id !== noteId);


  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});