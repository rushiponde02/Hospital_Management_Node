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

exports.createReception = (
  name,
  contact,
  status,
  userId,
  adminId,
  callback
) => {
  const addrec =
    "INSERT INTO reception (reception_name, reception_contact, status, user_id, admin_id) VALUES (?, ?, ?, ?, ?)";
  db.query(addrec, [name, contact, status, userId, adminId], callback);
};

exports.getAllReceptions = (callback) => {
  const getRec = "SELECT * FROM reception";
  db.query(getRec, callback);
};

exports.getReceptionById = (id, callback) => {
  const recId = "SELECT * FROM reception WHERE reception_id = ?";
  db.query(recId, [id], callback);
};

exports.updateReception = (data, callback) => {
  const { reception_name, reception_contact, status, reception_id } = data;
  const updateRec =
    "UPDATE reception SET reception_name = ?, reception_contact = ?, status = ? WHERE reception_id = ?";
  db.query(
    updateRec,
    [reception_name, reception_contact, status, reception_id],
    callback
  );
};

exports.deleteReceptionById = (id, callback) => {
  const getUser = "SELECT user_id FROM reception WHERE reception_id = ?";
  db.query(getUser, [id], (err, results) => {
    if (err) return callback(err);
    if (results.length === 0)
      return callback(new Error("Receptionist not found"));

    const userId = results[0].user_id;

    const deleteReception = "DELETE FROM reception WHERE reception_id = ?";
    db.query(deleteReception, [id], (err) => {
      if (err) return callback(err);

      const deleteUser = "DELETE FROM users WHERE user_id = ?";
      db.query(deleteUser, [userId], callback);
    });
  });
};

exports.searchReception = (name, callback) => {
  let query = `SELECT * FROM reception WHERE reception_name LIKE ?`;
  const searchTerm = `%${name}%`;

  db.query(query, [searchTerm], (err, results) => {
    if (err) {
      console.error("Error fetching reception search results:", err);
      return callback(err, null);
    }
    // console.log(results);
    return callback(null, results);
  });
};

