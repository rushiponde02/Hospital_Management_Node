const db = require("../config/db");

exports.getAllDoctors = (callback) => {
  db.query("SELECT * FROM doctor", callback);
};

exports.deleteDoctorById = (id, callback) => {
  db.query("DELETE FROM doctor WHERE doctor_id = ?", [id], (err, result) => {
    if (err) {
      console.log("Error in deleteing Doctor ", err);
      return callback(err, null);
    } else {
      return callback(null, err);
    }
  });
};

exports.getDoctorById = (id, callback) => {
  db.query("SELECT * FROM doctor WHERE doctor_id = ?", [id], callback);
};

exports.updateDoctor = (data, callback) => {
  const {
    doctor_name,
    doctor_specialization,
    doctor_contact,
    doctor_experience,
    status,
    doctor_id,
  } = data;
  db.query(
    "UPDATE doctor SET doctor_name=?, doctor_specialization=?, doctor_contact=?, doctor_experience=?, status=? WHERE doctor_id=?",
    [
      doctor_name,
      doctor_specialization,
      doctor_contact,
      doctor_experience,
      status,
      doctor_id,
    ],
    callback
  );
};

