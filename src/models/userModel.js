const db = require("../config/db");
const bcrypt = require("bcryptjs");

exports.createUser = async (username, password, role, callback) => {
  try {
    //const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
    db.query(sql, [username, password, role], callback);
  } catch (err) {
    callback(err, null);
  }
};
