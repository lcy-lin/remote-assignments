const express = require('express');
const router = express.Router();
const mysql2 = require('mysql2/promise');
const moment = require('moment');
require('dotenv').config();

const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const nameRegex = /^[a-zA-Z0-9]+$/;
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
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

function isHeaderValid(contentTypeHeader, requestDateHeader) {
  if (contentTypeHeader !== 'application/json' || !requestDateHeader || !isValidDate(requestDateHeader)) {
    return false;
  }
  return true;
}

router.get('/users', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query('SELECT * FROM user');
    connection.release();
    res.render('signup');
  } catch (err) {
    handleDatabaseError(err, res, 'Error fetching users');
  }
});

// Middleware for checking if the user is connected to the database
router.use(async (req, res, next) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    next();
  } catch (err) {
    console.error('Database connection is not established.');
    res.status(500).json({ error: 'Database connection failed' });
  }
});

router.get('/users/:id', async (req, res) => {
  const userId = req.params.id;
  const contentTypeHeader = req.get('Content-Type');
  const requestDateHeader = req.get('Request-date');

  if (!isHeaderValid(contentTypeHeader, requestDateHeader)) {
    return res.status(400).json({ error: 'Client Error Response' });
  }

  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query('SELECT * FROM user WHERE id = ?', [userId]);
    connection.release();

    if (results.length === 0) {
      return res.status(404).json({ error: 'User Not Existing' });
    }

    const userData = results[0];
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
  } catch (err) {
    handleDatabaseError(err, res, 'Error fetching user by ID');
  }
});

router.post('/users', async (req, res) => {
  const contentTypeHeader = req.get('Content-Type');
  const requestDateHeader = req.get('Request-Date');

  if (!isHeaderValid(contentTypeHeader, requestDateHeader)) {
    return res.status(400).json({ error: 'Client Error Response' });
  }

  const { useremail, username, userpassword } = req.body;

  if (!emailRegex.test(useremail) || !nameRegex.test(username) || !passwordRegex.test(userpassword)) {
    return res.status(400).json({ error: 'Client Error Response' });
  }
  if(!useremail || !username || !userpassword) {
    return res.status(400).json({ error: 'Client Error Response' });
  }
  try {
    const connection = await pool.getConnection();
    const [checkEmailResults] = await connection.query('SELECT * FROM user WHERE email = ?', [useremail]);

    if (checkEmailResults.length > 0) {
      connection.release();
      return res.status(409).json({ error: 'Email Already Exists' });
    }

    const formattedDate = moment(requestDateHeader, 'ddd, DD MMM YYYY HH:mm:ss [GMT]').format('YYYY-MM-DD HH:mm:ss');
    const [insertResults] = await connection.query(
      'INSERT INTO user (email, name, password, created_at) VALUES (?, ?, ?, ?)',
      [useremail, username, userpassword, formattedDate]
    );

    connection.release();
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
  } catch (err) {
    handleDatabaseError(err, res, 'Error inserting user');
  }
});

module.exports = router;
