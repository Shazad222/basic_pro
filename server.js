const express = require('express');
const multer = require('multer');
const mysql = require('mysql');
const path = require('path');
const fs = require('fs');
const app = express();

// Database connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Swabi$222',
    database: 'webfile_upload'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database.');
});

// Serve static files from the "public" directory
app.use(express.static('public'));

// Serve uploaded files from the "uploads" directory
app.use('/uploads', express.static('uploads'));

// File upload setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Route to handle file uploads
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.json({ success: false, error: 'No file uploaded.' });
    }
    const filename = req.file.filename;
    db.query('INSERT INTO images (filename) VALUES (?)', [filename], (err) => {
        if (err) {
            console.error('Database insertion error:', err);
            return res.json({ success: false, error: 'Database error.' });
        }
        res.json({ success: true });
    });
});

// Route to fetch all images
app.get('/images', (req, res) => {
    db.query('SELECT * FROM images', (err, results) => {
        if (err) {
            console.error('Error fetching images:', err);
            return res.status(500).json({ success: false, error: 'Database error.' });
        }
        res.json(results);
    });
});

// Route to delete an image
app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;

    // Fetch the image filename from the database
    db.query('SELECT filename FROM images WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error fetching image:', err);
            return res.status(500).json({ success: false, error: 'Database error.' });
        }

        const filename = results[0].filename;

        // Delete the image record from the database
        db.query('DELETE FROM images WHERE id = ?', [id], (err) => {
            if (err) {
                console.error('Error deleting image:', err);
                return res.status(500).json({ success: false, error: 'Database error.' });
            }

            // Delete the file from the uploads directory
            const filePath = path.join(__dirname, 'uploads', filename);
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting file:', err);
            });

            res.json({ success: true });
        });
    });
});

// Route to edit an image (replace the old image with a new one)
app.post('/edit/:id', upload.single('image'), (req, res) => {
    const id = req.params.id;

    if (!req.file) {
        return res.json({ success: false, error: 'No file uploaded.' });
    }

    const newFilename = req.file.filename;

    // Fetch the old image filename from the database
    db.query('SELECT filename FROM images WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error fetching image:', err);
            return res.status(500).json({ success: false, error: 'Database error.' });
        }

        const oldFilename = results[0].filename;

        // Replace the old image with the new one in the database
        db.query('UPDATE images SET filename = ? WHERE id = ?', [newFilename, id], (err) => {
            if (err) {
                console.error('Error updating image:', err);
                return res.status(500).json({ success: false, error: 'Database error.' });
            }

            // Delete the old image file from the uploads directory
            const oldFilePath = path.join(__dirname, 'uploads', oldFilename);
            fs.unlink(oldFilePath, (err) => {
                if (err) console.error('Error deleting old file:', err);
            });

            res.json({ success: true });
        });
    });
});

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
