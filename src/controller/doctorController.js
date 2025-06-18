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
