const db = require("../config/db");

exports.addMedicine = (data, callback) => {
  const { medicine_name, price_medicine } = data;
  const query = `INSERT INTO medicine ( medicine_name, price_medicine) VALUES (?, ?)`;
  db.query(query, [ medicine_name, price_medicine], callback);
};

exports.getAllMedicines = (callback) => {
  const query = "SELECT * from medicine";
  db.query(query, callback);
};

