const db = require("../config/db");

exports.addMedicine = (medicine_name, price_medicine, callback) => {
  const query = `INSERT INTO medicine ( medicine_name, price_medicine) VALUES ( ?,?)`;
  db.query(query, [medicine_name, price_medicine], callback);
};

exports.getAllMedicines = (callback) => {
  const query = "SELECT * from medicine";
  db.query(query, callback);
};
