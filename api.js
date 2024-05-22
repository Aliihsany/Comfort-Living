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
    const decoded = jwt.verify(token, 'Comfort-Living');
    req.user = decoded;
  } catch (err) {
    return res.status(401).send('Invalid Token');
  }
  return next();
};

// Endpoint for user login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
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

      try {
          if (await argon2.verify(user.password, password)) {
              const token = jwt.sign({ id: user.id }, 'Comfort-Living', { expiresIn: '3s' });
              res.status(200).json({ token });
          } else {
              res.status(401).send('Incorrect password');
          }
      } catch (err) {
          console.error('Error verifying password:', err);
          res.status(500).send('Error logging in');
      }
  });
});


// Protected route example
app.get('/protected', verifyToken, (req, res) => {
  res.status(200).send('This is a protected route');
});



app.post('/register', upload.fields([{ name: 'pdf' }, { name: 'bewijsfoto' }]), async (req, res) => {
    const {
        voornaam,
        achternaam,
        geslacht,
        geboortedatum,
        woonadres,
        telefoonnummer,
        jaarinkomen,
        voorkeur,
        straal,
        rol,
        email,
        password
    } = req.body;

    const pdf = req.files['pdf'][0].buffer;
    const bewijsfoto = req.files['bewijsfoto'][0].buffer;

    try {
        const hashedPassword = await argon2.hash(password);
        const query = `INSERT INTO users (voornaam, achternaam, geslacht, geboortedatum, woonadres, telefoonnummer, jaarinkomen, pdf, bewijsfoto, voorkeur, straal, rol, email, password) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(query, [voornaam, achternaam, geslacht, geboortedatum, woonadres, telefoonnummer, jaarinkomen, pdf, bewijsfoto, voorkeur, straal, rol, email, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error inserting user:', err);
                res.status(500).send('Error registering user');
            } else {
                res.status(200).send('User registered successfully');
            }
        });
    } catch (err) {
        console.error('Error hashing password tests:', err);
        res.status(500).send('Error registering user');
    }
});
//testballer
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

  