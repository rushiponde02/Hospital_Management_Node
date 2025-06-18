const db = require("../config/db");

exports.addMedicine = (medicine_name, price_medicine, patient_id, callback) => {
  const query = `INSERT INTO medicine ( medicine_name, price_medicine,patient_id) VALUES (?, ?,?)`;
  db.query(query, [medicine_name, price_medicine, patient_id], callback);
};

exports.getAllMedicines = (callback) => {
  const query = "SELECT * from medicine";
  db.query(query, callback);
};
