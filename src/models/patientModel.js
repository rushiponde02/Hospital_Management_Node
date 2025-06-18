const db = require("../config/db");

exports.insertPatient = (data, callback) => {
  const {
    patient_name,
    patient_age,
    patient_gender,
    patient_contact,
    patient_issue,
    admitted_date,
    room_no,
    nurse_id,
    doctor_id,
    status,
  } = data;

  const sql = `
    INSERT INTO patient (
      patient_name, patient_age, patient_gender, patient_contact,
      patient_issue, admitted_date,
      room_no, nurse_id, doctor_id, status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [
      patient_name,
      patient_age,
      patient_gender,
      patient_contact,
      patient_issue,
      admitted_date,
      room_no,
      nurse_id,
      doctor_id,
      status,
    ],
    callback
  );
};

exports.getPatientDetails = (patientId, callback) => {
  let getPatientQuery = "select * from patient where patient_id = ?"; //join 
  db.query(getPatientQuery, [patientId], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, result);
  });
};
