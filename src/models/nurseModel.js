const db = require("../config/db");
exports.createNurse = (name, contact, shift, callback) => {
  const sql = "INSERT INTO Nurse (nurse_name, nurse_contact, nurse_shift) VALUES (?, ?, ?)";
  db.query(sql, [name, contact, shift], callback);
};

// exports.getAllNurses = (callback) => {
//   const sql = "SELECT * FROM Nurse";
//   db.query(sql, callback);
// };

exports.getAllNurses = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM Nurse', (err, results) => {
      if (err) 
        reject(err);
      else 
      resolve(results);
    });
  });
};



// nurseModel.js




exports.deleteNurse = (nurseId, callback) => {
  db.query("DELETE FROM Nurse WHERE nurse_id = ?", [nurseId], callback);
};

exports.getNurseById = (nurseId, callback) => {
  db.query("SELECT * FROM Nurse WHERE nurse_id = ?", [nurseId], callback);
};

exports.updateNurse = (id, data, callback) => {
  const { nurse_name, nurse_contact, nurse_shift } = data;
  db.query(
    "UPDATE Nurse SET nurse_name = ?, nurse_contact = ?, nurse_shift = ? WHERE nurse_id = ?",
    [nurse_name, nurse_contact, nurse_shift, id],
    callback
  );
};
