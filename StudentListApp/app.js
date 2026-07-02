const express = require('express');
const mysql = require('mysql2');
const app = express();

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'RP738964$',   
  database: 'c237_studentlistapp'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Set up view engine
app.set('view engine', 'ejs');
// enable static files
app.use(express.static('public'));
// enable form processing
app.use(express.urlencoded({
  extended: false
}));

// Define routes

// Display all students
app.get('/', (req, res) => {
  const sql = 'SELECT * FROM student';
  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Database query error:', error.message);
      return res.send('Error Retrieving students');
    }
    res.render('index', { students: results });
  });
});

// Display one student by id
app.get('/student/:id', (req, res) => {
  const studentId = req.params.id;
  const sql = 'SELECT * FROM student WHERE studentId = ?';
  connection.query(sql, [studentId], (error, results) => {
    if (error) {
      console.error('Database query error:', error.message);
      return res.send('Error Retrieving student by ID');
    }
    if (results.length > 0) {
      res.render('student', { student: results[0] });
    } else {
      res.send('Student not found');
    }
  });
});

// Display the add student form
app.get('/addStudent', (req, res) => {
  res.render('addStudent');
});

// Handle add student form submission
app.post('/addStudent', (req, res) => {
  const { name, dob, contact, image } = req.body;
  const sql = 'INSERT INTO student (name, dob, contact, image) VALUES (?, ?, ?, ?)';
  connection.query(sql, [name, dob, contact, image], (error, results) => {
    if (error) {
      console.error('Error adding student:', error);
      res.send('Error adding student');
    } else {
      res.redirect('/');
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
