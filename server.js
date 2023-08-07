const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const notesData = path.join(__dirname, './db/db.json');
console.log("Path to db.json:", notesData);

const readNotesFromFile = (callback) => {
  fs.readFile(notesData, 'utf8', (err, data) => {
    if (err) {
      console.log("Error reading file:", err);
      return callback([]);
    }
    try {
      const notes = JSON.parse(data);
      callback(notes);
    } catch (error) {
      console.log("Error parsing JSON:", error);
      callback([]);
    }
  });
};

const writeNotesToFile = (notes, callback) => {
  fs.writeFile(notesData, JSON.stringify(notes, null, 2), (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
};

app.get('/api/notes', (req, res) => {
  readNotesFromFile((notes) => {
    res.json(notes);
  });
});

app.post('/api/notes', (req, res) => {
  readNotesFromFile((notes) => {
    const newNote = {
      id: uuidv4(),
      title: req.body.title,
      text: req.body.text,
    };
    notes.push(newNote);

    writeNotesToFile(notes, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save the note.' });
      }
      res.json(newNote);
    });
  });
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  readNotesFromFile((notes) => {
    const updatedNotes = notes.filter((note) => note.id !== noteId);

    writeNotesToFile(updatedNotes, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete note.' });
      }
      res.json({ message: 'Note deleted successfully.' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});