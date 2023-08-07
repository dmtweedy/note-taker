const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const dbPath = path.join(__dirname, 'db', 'db.json');

// Endpoint to get all notes
app.get('/api/notes', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the database file:', err);
      return res.status(500).json({ error: 'Failed to read the database.' });
    }

    try {
      const notes = JSON.parse(data);
      res.json(notes);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return res.status(500).json({ error: 'Failed to parse JSON.' });
    }
  });
});

// Endpoint to save a new note
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the database file:', err);
      return res.status(500).json({ error: 'Failed to read the database.' });
    }

    try {
      const notes = JSON.parse(data);
      newNote.id = notes.length + 1;
      notes.push(newNote);

      fs.writeFile(dbPath, JSON.stringify(notes, null, 2), 'utf8', (writeErr) => {
        if (writeErr) {
          console.error('Error writing to the database file:', writeErr);
          return res.status(500).json({ error: 'Failed to write to the database.' });
        }

        res.json(newNote);
      });
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return res.status(500).json({ error: 'Failed to parse JSON.' });
    }
  });
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});