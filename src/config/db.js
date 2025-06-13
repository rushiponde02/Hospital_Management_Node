  const mysql = require("mysql2");

  const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "mysql"
  });

  conn.connect((err) => {
    if (err) {
      console.error("Database connection failed: " + err.message);
      return;
    }
    console.log("Database connected successfully!");
  });

  module.exports = conn;
