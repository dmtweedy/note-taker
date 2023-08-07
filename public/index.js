let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

if (window.location.pathname === '/notes') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelector('.list-group');
}

// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

const getNotes = () => fetch('/api/notes', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
}).then((response) => response.json());

const saveNote = (note) => fetch('/api/notes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(note),
}).then((response) => response.json());

const deleteNote = (id) => fetch(`/api/notes/${id}`, {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
  },
}).then((response) => response.json());

const renderActiveNote = () => {
  hide(saveNoteBtn);

  if (activeNote.id) {
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

const handleNoteDelete = (e) => {
  e.stopPropagation();
  const note = e.target.parentElement;
  const noteId = JSON.parse(note.getAttribute('data-note')).id;
  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.getAttribute('data-note'));
  renderActiveNote();
};

const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

const renderNoteList = async (notes) => {
  // Clear the existing list
  noteList.innerHTML = '';

  // Check if the notes array is empty
  if (notes.length === 0) {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');
    liEl.innerText = 'No saved Notes';
    noteList.appendChild(liEl);
  } else {
    notes.forEach((note) => {
      const liEl = document.createElement('li');
      liEl.classList.add('list-group-item');
      liEl.innerText = note.title;
      liEl.setAttribute('data-note', JSON.stringify(note));
      liEl.addEventListener('click', handleNoteView);

      const deleteBtnEl = document.createElement('i');
      deleteBtnEl.classList.add('fas', 'fa-trash-alt', 'float-right', 'text-danger', 'delete-note');
      deleteBtnEl.addEventListener('click', handleNoteDelete);

      liEl.appendChild(deleteBtnEl);
      noteList.appendChild(liEl);
    });
  }
};

const getAndRenderNotes = () => {
  getNotes()
    .then((notes) => renderNoteList(notes))
    .catch((error) => console.error('Error fetching notes:', error));
};

// Event Listeners
if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
  getAndRenderNotes();
}