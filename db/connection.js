const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: 'UCLA@coding1',
      database: 'employee_trackerDB'
    },
    console.log('Connected to the employee_trackerDB database.')
  );

  module.exports = db;