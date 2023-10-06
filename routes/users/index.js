const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const mysql2 = require('mysql2/promise');
const moment = require('moment');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
const nameRegex = /^[a-zA-Z0-9]+$/;
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
const passwordRegex = /^(?=(?:[^A-Z]*[A-Z]){1})(?=(?:[^a-z]*[a-z]){1})(?=(?:\D*\d){1})(?=.*[~`!@#$%^&*()_+={[}\]|:;"'<,>.?/|\\-]).*$/;

const handleDatabaseError = (err, res, message) => {
  console.error(`Database error: ${message}`, err.message);
  res.status(500).json({ error: 'Database error' });
};

function isValidDate(dateString) {
  if (moment(dateString, 'ddd, DD MMM YYYY HH:mm:ss [GMT]', true).isValid()) {
    return true;
  }
  return false;
}

router.get('/users', (req, res) => {
  const sqlQuery = 'SELECT * FROM user';
  connection.query(sqlQuery, (err, results) => {
    if (err) {
      handleDatabaseError(err, res, 'Error fetching users');
      return;
    }
    res.render('signup');
  });
});

// Middleware for checking if the user is connected to the database
router.use((req, res, next) => {
  if (connection.state === 'disconnected') {
    console.error('Database connection is not established.');
    res.status(500).json({ error: 'Database connection failed' });
    return;
  }
  next();
});

// GET users route to render a page with user data
router.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  const contentTypeHeader = req.get('Content-Type');
  const requestDateHeader = req.get('Request-date');
  if (contentTypeHeader !== 'application/json') {
    return res.status(400).json({ error: 'Client Error Response' });
  }
  if (!requestDateHeader || !isValidDate(requestDateHeader)) {
    return res.status(400).json({ error: 'Client Error Response' });
  }
  const sqlCheckUser = 'SELECT * FROM user WHERE id = ?';
  connection.query(sqlCheckUser, [userId], (err, results) => {
    if (err) {
      handleDatabaseError(err, res, 'Error fetching user by ID');
      return;
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'User Not Existing' });
    }
    let userData = results[0];
    const response = {
      data: {
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
        },
        'request-date': requestDateHeader,
      },
    };
    res.status(200).json(response);
  });
});

router.post('/users', (req, res) => {
  const contentTypeHeader = req.get('Content-Type');
  const requestDateHeader = req.get('Request-Date');
  if (contentTypeHeader !== 'application/json') {
    return res.status(400).json({ error: 'Client Error Response' });
  }
  if (!requestDateHeader || !isValidDate(requestDateHeader)) {
    return res.status(400).json({ error: 'Client Error Response'});
  }
  const { useremail, username, userpassword } = req.body;

  if (!emailRegex.test(useremail) || !nameRegex.test(username) || !passwordRegex.test(userpassword)) {
    return res.status(400).json({ error: 'Client Error Response'});
  }

  const sqlCheckEmail = 'SELECT * FROM user WHERE email = ?';
  connection.query(sqlCheckEmail, [useremail], (err, results) => {
    if (err) {
      handleDatabaseError(err, res, 'Error checking email');
      return;
    }

    if (results.length > 0) {
      return res.status(409).json({ error: 'Email Already Exists' });
    }
    const formattedDate = moment(requestDateHeader, 'ddd, DD MMM YYYY HH:mm:ss [GMT]').format('YYYY-MM-DD HH:mm:ss');
    const sqlInsertUser = 'INSERT INTO user (email, name, password, created_at) VALUES (?, ?, ?, ?)';
    connection.query(sqlInsertUser, [useremail, username, userpassword, formattedDate], (err, insertResults) => {
      if (err) {
        handleDatabaseError(err, res, 'Error inserting user');
        return;
      }
      const response = {
        data: {
          user: {
            id: insertResults.insertId,
            name: username,
            email: useremail,
          },
          'request-date': requestDateHeader,
        },
      };
      res.status(200).json(response);

    });
  });
})

module.exports = router;