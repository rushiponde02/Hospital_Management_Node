const Medicine = require("../models/medicineModel");
const db = require("../config/db");

exports.renderAddMedicineForm = (req, res) => {
  db.query("SELECT patient_id, patient_name FROM patient", (err, patients) => {
    if (err) return res.status(500).send("Failed to load patients");
    res.render("addmedicine", { patients });
  });
};

exports.addMedicine = (req, res) => {
  const data = req.body.medicine_name;
  const price = req.body.price_medicine;
  console.log(data, price);

  Medicine.addMedicine(data, price, (err) => {
    if (err) {
      console.error("Error saving medicine:", err);
      return res.status(500).send("Error saving medicine");
    }
    
    res.redirect("/reception/dashboard");
  });
};

exports.viewMedicines = (req, res) => {
  Medicine.getAllMedicines((err, results) => {
    if (err) return res.status(500).send("Failed to fetch medicine data");
    res.render("viewmedicine", { medicines: results });
  });
};

exports.renderAddMedicineForm = (req, res) => {
  
  res.render("addmedicine");
};

exports.renderEditForm = (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM medicine WHERE medical_id = ?", [id], (err, results) => {
    if (err) return res.status(500).send("Error loading medicine");
    res.render("editmedicine", { medicine: results[0] });
  });
};

exports.updateMedicine = (req, res) => {
  const { medicine_name, price_medicine } = req.body;
  const id = req.params.id;
  db.query("UPDATE medicine SET medicine_name = ?, price_medicine = ? WHERE medical_id = ?", 
    [medicine_name, price_medicine, id], 
    (err) => {
      if (err) return res.status(500).send("Error updating medicine");
      res.redirect("/medicine/view");
    }
  );
};

exports.deleteMedicine = (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM medicine WHERE medical_id = ?", [id], (err) => {
    if (err) return res.status(500).send("Error deleting medicine");
    res.redirect("/medicine/view");
  });
};

exports.searchMedicine = (req, res) => {
  const search = `%${req.query.q}%`;
  db.query("SELECT * FROM medicine WHERE medicine_name LIKE ?", [search], (err, results) => {
    if (err) return res.status(500).send("Search failed");
    res.render("viewmedicine", { medicines: results });
  });
};
