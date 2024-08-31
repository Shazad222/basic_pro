// const express = require('express');
// const mysql = require('mysql');
// const bodyParser = require('body-parser');
// const multer = require('multer');
// const path = require('path');
// const app = express();

// // MySQL Connection
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'Swabi$222',
//     database: 'basic_web'
// });

// db.connect(err => {
//     if (err) throw err;
//     console.log('MySQL Connected...');
// });

// // Middleware
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from public folder

// // File upload setup
// const upload = multer({ dest: 'uploads/' });

// // Routes
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'login.html'));
// });

// app.post('/signup', upload.single('profilePic'), (req, res) => {
//     const { name, password, gender } = req.body;
//     const profilePic = req.file ? req.file.filename : '';

//     // Check if passwords match
//     if (password !== req.body.confirmPassword) {
//         return res.status(400).send('Passwords do not match.');
//     }

//     const sql = 'INSERT INTO users (name, password, gender, profilePic) VALUES (?, ?, ?, ?)';
//     db.query(sql, [name, password, gender, profilePic], (err, result) => {
//         if (err) throw err;
//         res.send('User registered successfully!');
//     });
// });

// app.post('/login', (req, res) => {
//     const { name, password } = req.body;
//     const sql = 'SELECT * FROM users WHERE name = ? AND password = ?';
//     db.query(sql, [name, password], (err, results) => {
//         if (err) throw err;
//         if (results.length > 0) {
//             res.send({ success: true, user: results[0] });
//         } else {
//             res.send({ success: false, message: 'Invalid credentials' });
//         }
//     });
// });

// app.get('/logout', (req, res) => {
//     res.redirect('/login.html');
// });

// const PORT = 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const app = express();

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Swabi$222',
    database: 'basic_web'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the public folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from the uploads folder

// File upload setup
const upload = multer({ dest: 'uploads/' });

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/signup', upload.single('profilePic'), (req, res) => {
    const { name, password, gender } = req.body;
    const profilePic = req.file ? req.file.filename : '';

    // Check if passwords match
    if (password !== req.body.confirmPassword) {
        return res.status(400).send('Passwords do not match.');
    }

    const sql = 'INSERT INTO users (name, password, gender, profilePic) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, password, gender, profilePic], (err, result) => {
        if (err) throw err;
        res.send('User registered successfully!');
    });
});

app.post('/login', (req, res) => {
    const { name, password } = req.body;
    const sql = 'SELECT * FROM users WHERE name = ? AND password = ?';
    db.query(sql, [name, password], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.send({ success: true, user: results[0] });
        } else {
            res.send({ success: false, message: 'Invalid credentials' });
        }
    });
});

app.get('/logout', (req, res) => {
    res.redirect('/login.html');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
