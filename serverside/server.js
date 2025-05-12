import express from 'express';
const app = express();
const port = 3000;

import { Database } from './database.js';

const database = new Database();

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

