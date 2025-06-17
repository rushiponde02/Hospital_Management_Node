const db = require("../config/db");

const Patient = require("../models/patientModel");

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
    res.redirect("/reception/view-patients");
  });
};
