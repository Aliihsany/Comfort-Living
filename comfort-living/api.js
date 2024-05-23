const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const port = 3000;

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'kinderopvang',
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





app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
  