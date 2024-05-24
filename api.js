require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const multer = require('multer');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const path = require('path');

const port = 3001;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
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
        const token = jwt.sign({ id: user.id }, 'Comfort-Living', { expiresIn: '1h' });
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

app.get('/protected', verifyToken, (req, res) => {
  res.status(200).send('This is a protected route');
  console.log(req.verifyToken);
  console.log(verifyToken);
});

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendVerificationEmail = (email, token) => {
  const verificationLink = `http://localhost:${port}/verify-email?token=${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification',
    html: `
      <div style="text-align: center; font-family: Arial, sans-serif; color: #333;">
        <img src="cid:unique@logo.png" alt="logo" width="150" height="150" style="margin-bottom: 20px;" />
        <p style="font-size: 18px; margin-bottom: 20px;">Click the link below to verify your email:</p>
        <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; font-size: 18px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px; margin-bottom: 20px;">Verify Email</a>
        <p style="font-size: 14px; color: #666;">The link is valid for 15 minutes.</p>
      </div>
    `,
    attachments: [{
      filename: 'logo.png',
      path: path.join(__dirname, 'comfort-living/src/assets/logo.png'),
      cid: 'unique@logo.png' 
    }]
  };

  app.post('/resend-verification', (req, res) => {
    const { email } = req.body;
  
    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmailQuery, [email], async (err, results) => {
      if (err) {
        console.error('Error checking email:', err);
        return res.status(500).send('Error checking email');
      }
  
      if (results.length === 0) {
        console.log('Email not found');
        return res.status(404).send('Email not found');
      }
  
      const user = results[0];
  
      if (user.is_verified) {
        console.log('Email is already verified');
        return res.status(400).send('Email is already verified');
      }
  
      try {
        const verificationToken = jwt.sign({ email }, 'verification-secret', { expiresIn: '15m' });
        const updateQuery = 'UPDATE users SET verification_token = ? WHERE email = ?';
  
        db.query(updateQuery, [verificationToken, email], (err, result) => {
          if (err) {
            console.error('Error updating verification token:', err);
            res.status(500).send('Error sending verification email');
          } else {
            sendVerificationEmail(email, verificationToken);
            res.status(200).send('Verification email sent');
          }
        });
      } catch (err) {
        console.error('Error generating verification token:', err);
        res.status(500).send('Error sending verification email');
      }
    });
  });


  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error('Error sending email:', error);
    }
    console.log('Verification email sent:', info.response);
  });
};

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
    email,
    password
  } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).send('Invalid email format');
  }

  const pdf = req.files['pdf'][0].buffer;
  const bewijsfoto = req.files['bewijsfoto'][0].buffer;

  const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkEmailQuery, [email], async (err, results) => {
    if (err) {
      console.error('Error checking email:', err);
      return res.status(500).send('Error checking email');
    }

    if (results.length > 0) {
      return res.status(400).send('Email already in use');
    }

    try {
      const hashedPassword = await argon2.hash(password);
      const verificationToken = jwt.sign({ email }, 'verification-secret', { expiresIn: '15m' });
      const query = `INSERT INTO users (voornaam, achternaam, geslacht, geboortedatum, woonadres, telefoonnummer, jaarinkomen, pdf, bewijsfoto, voorkeur, straal, email, password, verification_token, is_verified) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      db.query(query, [voornaam, achternaam, geslacht, geboortedatum, woonadres, telefoonnummer, jaarinkomen, pdf, bewijsfoto, voorkeur, straal, email, hashedPassword, verificationToken, false], (err, result) => {
        if (err) {
          console.error('Error inserting user:', err);
          res.status(500).send('Error registering user');
        } else {
          sendVerificationEmail(email, verificationToken);
          res.status(200).send('User registered successfully. Please verify your email.');
        }
      });
    } catch (err) {
      console.error('Error hashing password:', err);
      res.status(500).send('Error registering user');
    }
  });
});

app.get('/verify-email', (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, 'verification-secret');
    const query = 'UPDATE users SET is_verified = 1 WHERE email = ? AND verification_token = ?';

    db.query(query, [decoded.email, token], (err, result) => {
      if (err) {
        console.error('Error verifying email:', err);
        res.status(500).send('Error verifying email');
      } else if (result.affectedRows === 0) {
        res.status(400).send('Invalid token');
      } else {
        res.status(200).send('Email verified successfully');
      }
    });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.status(400).send('Token has expired. Please request a new verification email.');
    } else {
      console.error('Error verifying token:', err);
      res.status(400).send('Invalid or expired token');
    }
  }
});

app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM users';
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