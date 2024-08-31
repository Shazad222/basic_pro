const express = require('express');
const multer = require('multer');
const mysql = require('mysql');
const path = require('path');
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

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

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

// Routes
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

app.get('/images', (req, res) => {
    db.query('SELECT * FROM images', (err, results) => {
        if (err) {
            console.error('Error fetching images:', err);
            return res.status(500).json({ success: false, error: 'Database error.' });
        }
        res.json(results);
    });
});

app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM images WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('Error deleting image:', err);
            return res.status(500).json({ success: false, error: 'Database error.' });
        }
        res.json({ success: true });
    });
});

// Server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
