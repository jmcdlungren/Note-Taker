const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('./db/db.json');
const { v4: uuidv4 } = require('uuid');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))

    // Logs the request to the terminal
    console.info(`${req.method} request received to get notes`);
});

app.get('/api/notes', (req, res) => {
    const savedNotes = db
    res.json(savedNotes)
})

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a review`);

    const { title, text } = req.body;
    const savedNotes = db;


    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuidv4()
        };

        savedNotes.push(newNote)
        fs.writeFileSync('./db/db.json', JSON.stringify(savedNotes))
        res.json(savedNotes)

    }
});

app.delete('/api/notes/:id', (req, res) => {
    const savedNotes = db;

    const id = req.params.id

    for (i = 0; i < savedNotes.length; i++) {
        if (id === savedNotes[i].id) {
            savedNotes.splice(i, 1)
        }
    }
    console.log(savedNotes)

    fs.writeFileSync('./db/db.json', JSON.stringify(savedNotes))
    res.json(savedNotes)
})

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);