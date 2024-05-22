
const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // Voor wachtwoord hashing
const jwt = require('jsonwebtoken'); // Voor token-generatie

const port = 3001;

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'comfort_living',
    waitForConnections: true,
    connectionLimit: 15,
    queueLimit: 0
};

const db = mysql.createConnection(dbConfig);

const sqlCommands = [
  "SET GLOBAL wait_timeout = 2880000;",
  "SET GLOBAL max_allowed_packet = 671088640;"
];

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
  sqlCommands.forEach((sql) => {
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error executing SQL command:', err);
      }
    });
  });
});

// Endpoint for user registration
app.post('/login', (req, res) => {
  const { telefoonnummer, wachtwoord } = req.body;

  const sql = 'SELECT * FROM users WHERE telefoonnummer = ?';
  db.query(sql, [telefoonnummer], (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error logging in');
      return;
    }

    if (results.length === 0) {
      res.status(401).send('User not found');
      return;
    }

    const user = results[0];

    if (wachtwoord !== user.wachtwoord) {
      res.status(401).send('Incorrect password');
      return;
    }

    const token = jwt.sign({ id: user.id }, 'Comfort-Living', { expiresIn: '3s' });
    res.status(200).json({ token });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
