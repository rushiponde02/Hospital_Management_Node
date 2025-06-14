// const db = require("../config/db");

// exports.createReception = (name, contact, status, userId, adminId, callback) => {
//   const addrec = `INSERT INTO reception (reception_name, reception_contact, status, user_id, admin_id)
//                VALUES (?, ?, ?, ?, ?)`;
//   db.query(addrec, [name, contact, status, userId, adminId], callback);
// };

// //=====================================================
// exports.getAllReceptions = (callback) => {
//   const sql = "SELECT * FROM reception";
//   db.query(sql, callback);
// };


const db = require("../config/db");

exports.createReception = (name, contact, status, userId, adminId, callback) => {
  const addrec = "INSERT INTO reception (reception_name, reception_contact, status, user_id, admin_id) VALUES (?, ?, ?, ?, ?)";
  db.query(addrec, [name, contact, status, userId, adminId], callback);
};

exports.getAllReceptions = (callback) => {
  const sql = "SELECT * FROM reception";
  db.query(sql, callback);
};

exports.getReceptionById = (id, callback) => {
  const sql = "SELECT * FROM reception WHERE reception_id = ?";
  db.query(sql, [id], callback);
};

exports.updateReception = (data, callback) => {
  const { reception_name, reception_contact, status, reception_id } = data;
  const sql = "UPDATE reception SET reception_name = ?, reception_contact = ?, status = ? WHERE reception_id = ?";
  db.query(sql, [reception_name, reception_contact, status, reception_id], callback);
};

exports.deleteReceptionById = (id, callback) => {
 
  const getUserSql = "SELECT user_id FROM reception WHERE reception_id = ?";
  db.query(getUserSql, [id], (err, results) => {
    if (err) return callback(err);
    if (results.length === 0) return callback(new Error("Receptionist not found"));

    const userId = results[0].user_id;

    const deleteReceptionSql = "DELETE FROM reception WHERE reception_id = ?";
    db.query(deleteReceptionSql, [id], (err) => {
      if (err) return callback(err);

      const deleteUserSql = "DELETE FROM users WHERE user_id = ?";
      db.query(deleteUserSql, [userId], callback);
    });
  });
};