const Doctor = require("../models/doctorModel");
const db = require("../config/db");

exports.viewDoctors = (req, res) => {
  Doctor.getAllDoctors((err, results) => {
    if (err) return res.status(500).send("Error fetching doctors");
    res.render("admin");
  });
};

exports.viewDoctors = exports.deleteDoctor = (req, res) => {
  const id = req.params.id;
  Doctor.deleteDoctorById(id, (err) => {
    if (err) return res.status(500).send("Error deleting doctor");
    res.redirect("/admin/view-doctor");
  });
};

exports.renderEditDoctor = (req, res) => {
  Doctor.getDoctorById(req.params.id, (err, results) => {
    if (err || results.length === 0)
      return res.status(404).send("Doctor not found");
    res.render("editdoctor", { doctor: results[0] });
  });
};

exports.updateDoctor = (req, res) => {
  const data = req.body;
  data.doctor_id = req.params.id;
  Doctor.updateDoctor(data, (err) => {
    if (err) return res.status(500).send("Update failed");
    res.redirect("/admin/view-doctor");
  });
};

exports.doctorDashboard = (req, res) => {
  if (!req.session.user || req.session.user.role !== "doctor") {
    return res.redirect("/getstarted");
  }

  const user = req.session.user || { username: "Doctor" };
  res.render("doctor", { user });
};

exports.showVisitedPatients = (req, res) => {
  const query = `SELECT * FROM patient WHERE status = 'Visited'`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send("Database error");
    res.render("doctor_patient_list", {
      patients: results,
      title: "Visited Patients"
    });
  });
};

exports.showNotVisitedPatients = (req, res) => {
  const query = `SELECT * FROM patient WHERE status = 'Not Visited'`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send("Database error");
    res.render("doctor_patient_list", {
      patients: results,
      title: "Not Visited Patients"
    });
  });
};

exports.viewAssignedPatients = (req, res) => {
  const doctorUsername = req.session.user?.username;

  // Get doctor_id by username (assuming doctor username is unique)
  const getDoctorIdQuery = `
    SELECT d.doctor_id FROM doctor d
    JOIN users u ON d.user_id = u.user_id
    WHERE u.username = ?
  `;

  db.query(getDoctorIdQuery, [doctorUsername], (err, results) => {
    if (err || results.length === 0) {
      console.error("Error fetching doctor ID:", err);
      return res.status(500).send("Doctor not found");
    }

    const doctorId = results[0].doctor_id;

    const patientQuery = `
      SELECT p.*, d.doctor_name, r.room_type, n.nurse_name
      FROM patient p
      LEFT JOIN doctor d ON p.doctor_id = d.doctor_id
      LEFT JOIN room r ON p.room_no = r.room_no
      LEFT JOIN nurse n ON p.nurse_id = n.nurse_id
      WHERE p.doctor_id = ?
    `;

    db.query(patientQuery, [doctorId], (err2, patients) => {
      if (err2) {
        console.error("Error fetching assigned patients:", err2);
        return res.status(500).send("Error loading patients");
      }

      res.render("assignpatients", { patients });
    });
  });
};