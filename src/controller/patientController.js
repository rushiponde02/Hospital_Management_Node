const db = require("../config/db");

const Patient = require("../models/patientModel");
const medicineModel = require("../models/medicineModel");

exports.renderAddPatientForm = (req, res) => {
  const roomQuery = "SELECT room_no FROM room WHERE room_status = 'Available'";
  const nurseQuery = "SELECT nurse_id, nurse_name FROM nurse";
  const doctorQuery = "SELECT doctor_id, doctor_name FROM doctor";

  db.query(roomQuery, (err, rooms) => {
    if (err) return res.status(500).send("Room query error");

    db.query(nurseQuery, (err2, nurses) => {
      if (err2) return res.status(500).send("Nurse query error");

      db.query(doctorQuery, (err3, doctors) => {
        if (err3) return res.status(500).send("Doctor query error");

        res.render("addpatient", {
          rooms,
          nurses,
          doctors,
        });
      });
    });
  });
};

exports.addPatient = (req, res) => {
  const data = req.body;
  Patient.insertPatient(data, (err) => {
    if (err) {
      console.error("Error saving patient:", err);
      return res.status(500).send("Failed to add patient");
    }
    res.redirect("/reception/view-patient");
  });
};

exports.viewPatients = (req, res) => {
  const query = `
    SELECT p.*, r.room_type, n.nurse_name, d.doctor_name
    FROM patient p
    LEFT JOIN room r ON p.room_no = r.room_no
    LEFT JOIN nurse n ON p.nurse_id = n.nurse_id
    LEFT JOIN doctor d ON p.doctor_id = d.doctor_id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching patients:", err);
      return res.status(500).send("Database error");
    }

    res.render("viewpatient", { patients: results });
  });
};

exports.searchPatient = (req, res) => {
  const name = req.query.name || "";
  const searchTerm = `%${name}%`;

  const query = `
    SELECT p.*, r.room_type, n.nurse_name, d.doctor_name
    FROM patient p
    LEFT JOIN room r ON p.room_no = r.room_no
    LEFT JOIN nurse n ON p.nurse_id = n.nurse_id
    LEFT JOIN doctor d ON p.doctor_id = d.doctor_id
    WHERE p.patient_name LIKE ?
  `;

  db.query(query, [searchTerm], (err, results) => {
    if (err) {
      console.error("Search Error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};

exports.showPatient = (req, res) => {
  const patientID = req.params.patientId;
  console.log(patientID);
  //
  Patient.getPatientDetails(patientID, (err, resultpatient) => {
    //log pateint
    if (err) {
      console.log("Erro in get patient ", err);
      return res.send("Error ", err);
    }

    medicineModel.getAllMedicines((err, resultmedicine) => {
      if (err) {
        return res.send("Err on getall medicine ", err);
      }
      console.log("All data ", resultpatient[0], resultmedicine);

      res.render("prescreptionPatient", {
        patientInfo: resultpatient[0],
        medicine: resultmedicine,
      });
    });
  });
};

exports.prescribeMedicine = (req, res) => {
  const { medicine_name } = req.body;
  const patientId = req.params.patientId;

  const query = `INSERT INTO medicine (medicine_name, price_medicine) VALUES (?, 0)`; // price optional
  db.query(query, [medicine_name], (err, result) => {
    if (err) return res.send("Failed to prescribe medicine");
    res.redirect("/doctor/show-patient/" + patientId);
  });
};

// Mark as checked
exports.markAsChecked = (req, res) => {
  const patientId = req.params.patientId;
  const query = "UPDATE patient SET status='Visited' WHERE patient_id=?";
  db.query(query, [patientId], (err, result) => {
    if (err) return res.send("Failed to update patient status");
    res.redirect("/doctor/show-patient/" + patientId);
  });
};