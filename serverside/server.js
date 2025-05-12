import express from 'express';
const app = express();
const port = 3000;

import { Database } from './database.js';

const database = new Database();

//http://localhost:3000/

app.get('/books', (req, res) => {
  database.getBooks()
    .then(results => res.json(results))
    .catch(error => res.status(500).json({ error: error.message }));
});

app.get('/recents', (req, res) => {
  database.getRecents()
    .then(results => res.json(results))
    .catch(error => res.status(500).json({ error: error.message }));
});

app.get('/books/:id', (req, res) => {
  const id = req.params.id;

  console.log(`Fetching book with ID: ${id}`);

  database.markAsRecent(id)
    .then(() => res.status(200).json({ message: 'Book marked as recent' }))
    .catch(error => res.status(500).json({ error: error.message }));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

