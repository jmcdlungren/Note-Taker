// Brings in necessary applications and files
const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('./db/db.json');
const { v4: uuidv4 } = require('uuid');

// Sets the port to deploy via Heroku
const PORT = process.env.PORT || 3001;

// Sets up the app to be used below
const app = express();

// Middleware for parsing application/json
app.use(express.json());

// Middleware for urlecoded data
app.use(express.urlencoded({ extended: true }));

// Add a static middleware for serving assets in the public folder
app.use(express.static('public'));

// Sets the "home" page of the webpage to display the index.html file
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// Sets the "notes" page of the webpage to display the notes.html file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))

    // Logs the request to the terminal
    console.info(`${req.method} request received to get notes`);
});

// Displays values from the database (db.json referenced above in the db variable) on the "notes" page
app.get('/api/notes', (req, res) => {
    const savedNotes = db
    res.json(savedNotes)
})

// This function allows user to save a note to the database
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);

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

// This function allows user to delete the note from the database
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
});

// Allows for the application to deploy to the port, and consoles a message once deployed"
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);