const Medicine = require("../models/medicineModel");

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
