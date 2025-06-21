// const userModel = require("../models/userModel");
// const receptionModel = require("../models/receptionModel");
// const Reception = require("../models/receptionModel");
// exports.showAddReceptionForm = (req, res) => {
//   res.render("addreceptionist");
// };

// exports.addReception = (req, res) => {
//   const { reception_name, reception_contact, status, username, password } = req.body;

//   userModel.createUser(username, password, "reception", (err, userResult) => {
//     if (err) {
//       console.error("User creation error:", err);
//       return res.send("Error saving user");
//     }

//     const userId = userResult.insertId;
//     const adminId = 1;

//     receptionModel.createReception(reception_name, reception_contact, status, userId, adminId, (err, receptionResult) => {
//       if (err) {
//         console.error("Reception creation error:", err);
//         return res.send("Error saving reception");
//       }

//       res.redirect("/admin/view-receptions");
//     });
//   });
// };

// //===================================================
// exports.viewReceptions = (req, res) => {
//   Reception.getAllReceptions((err, results) => {
//     if (err) return res.status(500).send("Error fetching receptionists");
//     res.render("admin", { page: "view-reception", receptions: results });
//   });
// };

const userModel = require("../models/userModel");
const receptionModel = require("../models/receptionModel");
const Reception = require("../models/receptionModel");
const db=require("../config/db")
exports.showAddReceptionForm = (req, res) => {
  res.render("addreceptionist");
};

exports.addReception = (req, res) => {
  const { reception_name, reception_contact, status, username, password } =
    req.body;

  userModel.createUser(username, password, "reception", (err, userResult) => {
    if (err) {
      console.error("User creation error:", err);
      return res.status(500).send("Error saving user");
    }

    const userId = userResult.insertId;
    const adminId = 1; // Assuming a fixed admin_id for now, adjust as per your auth logic

    receptionModel.createReception(
      reception_name,
      reception_contact,
      status,
      userId,
      adminId,
      (err, receptionResult) => {
        if (err) {
          console.error("Reception creation error:", err);
          return res.status(500).send("Error saving reception");
        }
        res.redirect("/admin/view-reception"); // Redirect to view all receptionists
      }
    );
  });
};

exports.viewReceptions = (req, res) => {
  Reception.getAllReceptions((err, results) => {
    if (err) {
      console.error("Error fetching receptionists:", err);
      return res.status(500).send("Error fetching receptionists");
    }
    // Render the viewreceptionist.ejs with the fetched data
    res.render("viewreceptionist", { receptions: results });
  });
};

exports.renderEditReception = (req, res) => {
  const receptionId = req.params.id;
  Reception.getReceptionById(receptionId, (err, results) => {
    if (err) {
      console.error("Error fetching receptionist for edit:", err);
      return res.status(500).send("Error fetching receptionist for edit");
    }
    if (results.length === 0) {
      return res.status(404).send("Receptionist not found");
    }
    res.render("editreceptionist", { reception: results[0] });
  });
};

exports.updateReception = (req, res) => {
  const receptionId = req.params.id;
  const { reception_name, reception_contact, status } = req.body;

  const data = {
    reception_id: receptionId,
    reception_name,
    reception_contact,
    status,
  };

  Reception.updateReception(data, (err) => {
    if (err) {
      console.error("Error updating receptionist:", err);
      return res.status(500).send("Update failed");
    }
    res.redirect("/admin/view-reception"); // Redirect to view all receptionists
  });
};

exports.deleteReception = (req, res) => {
  const receptionId = req.params.id;
  Reception.deleteReceptionById(receptionId, (err) => {
    if (err) {
      console.error("Error deleting receptionist:", err);
      return res.status(500).send("Error deleting receptionist");
    }
    res.redirect("/admin/view-reception"); // Redirect to view all receptionists
  });
};

exports.receptionDashboard = (req, res) => {
  console.log("receptionDashboard");

  if (!req.session.user || req.session.user.role !== "reception") {
    return res.redirect("/getstarted");
  }

  res.render("reception", { user: req.session.user });
};

// List patients with possible existing bill
exports.viewPatients = (req, res) => {
  const sql = `
    SELECT 
      p.*, 
      d.doctor_name, 
      d.doctor_specialization,
      r.room_type,
      r.charges_per_day AS room_charge,
      b.bill_id
    FROM patient p
    JOIN doctor d ON p.doctor_id = d.doctor_id
    JOIN room r ON p.room_no = r.room_no
    LEFT JOIN bill b ON b.patient_id = p.patient_id
    ORDER BY p.patient_id;
  `;
  db.query(sql, (err, patients) => {
    if (err) return res.send('Error loading patients');
    res.render('viewpatients', { patients });
  });
};


// Save bill
exports.saveBill = (req, res) => {
  const { patient_id, doctor_charges, medicine_charges, medicine_quantity } = req.body;

  const doctor = parseFloat(doctor_charges);
  const medicine = parseFloat(medicine_charges);
  const quantity = parseInt(medicine_quantity);
  const billing_date = new Date();

  if (
    isNaN(doctor) || isNaN(medicine) || isNaN(quantity) || !patient_id
  ) {
    return res.status(400).send("Invalid input data. Make sure all fields are filled correctly.");
  }

  // 🏥 Fetch room_charges from DB based on patient's room_no
  const roomSql = `
    SELECT r.charges_per_day AS room_charges
    FROM patient p
    JOIN room r ON p.room_no = r.room_no
    WHERE p.patient_id = ?
  `;

  db.query(roomSql, [patient_id], (err, roomResult) => {
    if (err || roomResult.length === 0) {
      console.error("Error fetching room charges:", err);
      return res.status(500).send("Could not get room charges");
    }

    const room = parseFloat(roomResult[0].room_charges);
    const total = room + doctor + medicine;

    const sql = `
      INSERT INTO bill (patient_id, room_charges, doctor_charges, medicine_charges, total_amount, billing_date, medicine_quantity)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [patient_id, room, doctor, medicine, total, billing_date, quantity], (err) => {
      if (err) {
        console.error("Error inserting bill:", err);
        return res.status(500).send("Error saving bill");
      }

      // ✅ Redirect to view page for that patient
      res.redirect(`/reception/view-bill/${patient_id}`);
    });
  });
};





// View full bill
exports.viewBill = (req, res) => {
  const patientId = req.params.patientId;
  const sql = `
    SELECT b.*, p.patient_name, p.patient_age, p.patient_gender, p.patient_contact,
           p.patient_issue, p.admitted_date, p.discharge_date,
           d.doctor_name, d.doctor_specialization
    FROM bill b
    JOIN patient p ON p.patient_id = b.patient_id
    JOIN doctor d ON d.doctor_id = p.doctor_id
    WHERE b.patient_id = ?
  `;
  db.query(sql, [patientId], (err, result) => {
    if (err || !result.length)
      return res.status(404).send('Bill not found');
    res.render('viewBill', { bill: result[0] });
  });
};
