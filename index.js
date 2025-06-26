const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// SQLite DB setup
const dbPath = path.resolve(__dirname, 'notes.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database ✅');
  }
});

// Create notes table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL
  )
`);

// Create users table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )
`);


// ---------------- ROUTES ---------------- //

// Get all notes
app.get('/notes', (req, res) => {
  db.all('SELECT * FROM notes', (err, rows) => {
    if (err) {
      console.error('Error fetching notes:', err);
      return res.status(500).json({ error: 'Failed to fetch notes' });
    }
    res.json(rows);
  });
});

// Get single note by ID
app.get('/notes/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM notes WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error fetching note:', err);
      return res.status(500).json({ error: 'Failed to fetch note' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(row);
  });
});

// Add new note
app.post('/notes', (req, res) => {
  const { title, content } = req.body;
  db.run(
    'INSERT INTO notes (title, content) VALUES (?, ?)',
    [title, content],
    function (err) {
      if (err) {
        console.error('Error adding note:', err);
        return res.status(500).json({ error: 'Failed to add note' });
      }
      res.json({ id: this.lastID, title, content });
    }
  );
});

// Update note
app.put('/notes/:id', (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  db.run(
    'UPDATE notes SET title = ?, content = ? WHERE id = ?',
    [title, content, id],
    function (err) {
      if (err) {
        console.error('Error updating note:', err);
        return res.status(500).json({ error: 'Failed to update note' });
      }
      res.json({ message: 'Note updated successfully' });
    }
  );
});

// Delete note
app.delete('/notes/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM notes WHERE id = ?', [id], function (err) {
    if (err) {
      console.error('Error deleting note:', err);
      return res.status(500).json({ error: 'Failed to delete note' });
    }
    res.json({ message: 'Note deleted successfully' });
  });
});

// ---------------- USER AUTH ROUTES ---------------- //

// Register new user
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, hashedPassword],
    function (err) {
      if (err) {
        console.error('Error registering user:', err);
        return res.status(500).json({ error: 'Registration failed' });
      }
      res.json({ id: this.lastID, username });
    }
  );
});

// Login user
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ error: 'Login failed' });
    }
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful' });
  });
});

// ---------------- START SERVER ---------------- //
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});