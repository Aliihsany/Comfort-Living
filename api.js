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

const upload = multer({
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB
  },
});

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

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
    process.exit(1); // Exit the process if unable to connect to the database
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
    const decoded = jwt.verify(token.split(' ')[1], 'Comfort-Living');
    req.user = decoded;

    const sql = 'SELECT is_verified, blocked FROM users WHERE id = ?';
    db.query(sql, [decoded.id], (err, results) => {
      if (err) {
        return res.status(500).send('Error checking verification status');
      }
      if (results.length > 0) {
        req.user.isBlocked = results[0].blocked;
        return next();
      } else {
        return res.status(403).send('Email not verified');
      }
    });
  } catch (err) {
    return res.status(401).send('Invalid Token');
  }
};

app.get('/check-verification', verifyToken, (req, res) => {
  const sql = 'SELECT is_verified, blocked FROM users WHERE id = ?';
  db.query(sql, [req.user.id], (err, results) => {
    if (err) {
      return res.status(500).send('Error checking verification status');
    }
    if (results.length > 0) {
      res.status(200).json({ isVerified: results[0].is_verified, isBlocked: results[0].blocked });
    } else {
      res.status(404).send('User not found');
    }
  });
});

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

app.get('/check-verification', verifyToken, (req, res) => {
  const sql = 'SELECT is_verified, blocked FROM users WHERE id = ?';
  db.query(sql, [req.user.id], (err, results) => {
    if (err) {
      return res.status(500).send('Error checking verification status');
    }
    if (results.length > 0) {
      res.status(200).json({ isVerified: results[0].is_verified, isBlocked: results[0].blocked });
    } else {
      res.status(404).send('User not found');
    }
  });
});


app.get('/protected', verifyToken, (req, res) => {
  res.status(200).send('This is a protected route');
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

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error('Error sending email:', error);
    }
    console.log('Verification email sent:', info.response);
  });
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
    password,
    user_id
  } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).send('Invalid email format');
  }

  const pdf = req.files['pdf'][0].buffer;
  const bewijsfoto = req.files['bewijsfoto'][0].buffer;

  const checkEmailQuery = 'SELECT * FROM gegevens, users WHERE users.email = ?';
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
      const query = `INSERT INTO users (voornaam, achternaam, geslacht, geboortedatum, woonadres, telefoonnummer, jaarinkomen, pdf, bewijsfoto, voorkeur, straal, email, password, verification_token, is_verified, rol) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      db.query(query, [voornaam, achternaam, geslacht, geboortedatum, woonadres, telefoonnummer, jaarinkomen, pdf, bewijsfoto, voorkeur, straal, email, hashedPassword, verificationToken, false, 'default_role'], (err, result) => {
        if (err) {
          console.error('Error inserting user:', err);
          res.status(500).send('Error registering user');
        } else {
          // Insert into gegevens table
          const gegevensQuery = `INSERT INTO gegevens (voornaam, achternaam, geslacht, geboortedatum, woonadres, telefoonnummer, jaarinkomen, pdf, bewijsfoto, voorkeur, straal, email, password, verification_token, is_verified, rol, user_id) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, true)`;
          db.query(gegevensQuery, [voornaam, achternaam, geslacht, geboortedatum, woonadres, telefoonnummer, jaarinkomen, pdf, bewijsfoto, voorkeur, straal, email, hashedPassword, verificationToken, false, 'default_role', user_id], (err, result) => {
            if (err) {
              console.error('Error inserting gegevens:', err);
              res.status(500).send('Error registering user');
            } else {
              sendVerificationEmail(email, verificationToken);
              res.status(200).send('User registered successfully. Please verify your email.');
            }
          });
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

app.post('/panden', (req, res) => {
  const { naam, kamerindeling, huurkosten, servicekosten, energielabel, locatie, type, straal, beschrijving, afbeelding_1, afbeelding_2, afbeelding_3 } = req.body;

  const sql = 'INSERT INTO panden (naam, kamerindeling, huurkosten, servicekosten, energielabel, locatie, type, straal, beschrijving, afbeelding_1, afbeelding_2, afbeelding_3) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [naam, kamerindeling, huurkosten, servicekosten, energielabel, locatie, type, straal, beschrijving, afbeelding_1, afbeelding_2, afbeelding_3];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).json({ message: 'Error adding residence' });
      return;
    }
    res.status(200).json({ message: 'Residence added successfully' });
  });
});

app.get('/panden/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM panden WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching residence');
      return;
    }
    if (result.length === 0) {
      res.status(404).send('Residence not found');
      return;
    }
    res.json(result[0]);
  });
});

app.put('/block-user', (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).send('User ID is required');
  }

  const query = 'UPDATE users SET blocked = 1 WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error blocking user:', err);
      return res.status(500).send('Error blocking user');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('User not found');
    }

    res.status(200).send('User blocked successfully');
  });
});


app.get('/panden', (req, res) => {
  const { naam } = req.query;
  let sql = 'SELECT * FROM panden';
  const values = [];

  if (naam) {
    sql += ' WHERE naam LIKE ?';
    values.push(`%${naam}%`);
  }

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error fetching residences:', err);
      res.status(500).json({ message: 'Error fetching residences' });
      return;
    }
    res.status(200).json(results);
  });
});

app.get('/users/me', verifyToken, (req, res) => {
  const userId = req.user.id;
  const sql = 'SELECT voornaam, achternaam, geboortedatum, woonadres, telefoonnummer, jaarinkomen, voorkeur, straal, email FROM users WHERE id = ?';

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Error fetching user:', err);
      res.status(500).send('Server error');
      return;
    }

    if (result.length === 0) {
      res.status(404).send('User not found');
      return;
    }

    res.json(result[0]);
  });
});

app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'DELETE FROM users WHERE id = ?';

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ error: 'Error deleting user' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  });
});

app.delete('/panden/:id', (req, res) => {
  const residenceId = req.params.id;
  const query = 'DELETE FROM panden WHERE id = ?';

  db.query(query, [residenceId], (err, result) => {
    if (err) {
      console.error('Error deleting residence:', err);
      return res.status(500).json({ error: 'Error deleting residence' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Residence not found' });
    }

    res.status(200).json({ message: 'Residence deleted successfully' });
  });
});

// PUT endpoint for updating residence details
app.put('/panden/:id', (req, res) => {
  const residenceId = req.params.id;
  const { naam, kamerindeling, huurkosten, servicekosten, energielabel, locatie, type, straal, beschrijving, afbeelding_1, afbeelding_2, afbeelding_3 } = req.body;

  // Query to update residence details in the database
  const query = 'UPDATE panden SET naam = ?, kamerindeling = ?, huurkosten = ?, servicekosten = ?, energielabel = ?, locatie = ?, type = ?, straal = ?, beschrijving = ?, afbeelding_1 = ?, afbeelding_2 = ?, afbeelding_3 = ? WHERE id = ?';
  const values = [naam, kamerindeling, huurkosten, servicekosten, energielabel, locatie, type, straal, beschrijving, afbeelding_1, afbeelding_2, afbeelding_3, residenceId];

  // Execute the query to update residence details
  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating residence details:', err);
      res.status(500).json({ error: 'Error updating residence details' });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Residence not found' });
      return;
    }

    res.status(200).json({ message: 'Residence details updated successfully' });
  });
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});