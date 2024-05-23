// api.js
const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const multer = require('multer');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const port = 3001;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

app.post('/filter-panden', (req, res) => {
    const { aantal, grootte, min, max, energielabel, locatie, type } = req.body;

    let query = 'SELECT * FROM panden WHERE 1=1';
    const queryParams = [];

    if (aantal) {
        query += ' AND aantal = ?';
        queryParams.push(aantal);
    }

    if (grootte) {
        query += ' AND grootte >= ?';
        queryParams.push(grootte);
    }

    if (min) {
        query += ' AND min >= ?';
        queryParams.push(min);
    }

    if (max) {
        query += ' AND max <= ?';
        queryParams.push(max);
    }

    if (energielabel) {
        query += ' AND energielabel = ?';
        queryParams.push(energielabel);
    }

    if (locatie) {
        query += ' AND locatie LIKE ?';
        queryParams.push(`%${locatie}%`);
    }

    if (type) {
        query += ' AND type = ?';
        queryParams.push(type);
    }

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Error fetching data');
            return;
        }

        res.status(200).json(results);
    });
});

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

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send('A token is required for authentication');
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), 'Comfort-Living');
        req.user = decoded;

        const currentTimestamp = Math.floor(Date.now() / 1000); // huidige tijd in seconden
        if (decoded.exp < currentTimestamp) {
            return res.status(401).send('Token has expired');
        }
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }
    return next();
};

// Endpoint voor gebruikerslogin en andere endpoints...
app.get('/panden', (req, res) => {
  const sql = 'SELECT * FROM panden';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
