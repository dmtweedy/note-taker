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

});

app.post('/api/notes', (req, res) => {

});


app.delete('/api/notes/:id', (req, res) => {

});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});