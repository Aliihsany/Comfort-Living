// const mysql = require('mysql');

// const dbConfig = {
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'comfort_living'
// };

// const db = mysql.createConnection(dbConfig);

// db.connect((err) => {
//     if (err) {
//         console.error('Error connecting to database:', err);
//         return;
//     }
//     console.log('Connected to database');

//     const seedQuery = `
//         INSERT INTO \`panden\` (\`id\`, \`aantal\`, \`grootte\`, \`min\`, \`max\`, \`energielabel\`, \`locatie\`, \`type\`) 
//         VALUES 
//         (1, 3, 120, 200000, 300000, 'A', 'Amsterdam', 'Appartement'),
//         (2, 4, 150, 300000, 450000, 'B', 'Rotterdam', 'Huis'),
//         (3, 2, 80, 150000, 200000, 'C', 'Utrecht', 'Studio'),
//         (4, 5, 200, 500000, 700000, 'A', 'Den Haag', 'Villa'),
//         (5, 3, 110, 250000, 350000, 'B', 'Eindhoven', 'Appartement');
//     `;

//     db.query(seedQuery, (err, result) => {
//         if (err) {
//             console.error('Error executing seed query:', err);
//             db.end();
//             return;
//         }
//         console.log('Database seeded successfully');
//         db.end();
//     });
// });
