// const express = require("express");
// const router = express.Router();
// const authController = require("../controller/authController");
// const doctorController = require("../controller/doctorController");
// const receptionController = require("../controller/receptionController");
// const conn = require("../config/db");

// router.get("/", (req, res) => {
//   res.render("front");
// });

// router.get("/getstarted", (req, res) => {
//   res.render("form", { error: null });
// });

// router.post("/adminlogin", (req, res) => {
//   const { username, password, role } = req.body;
//   const query = `SELECT * FROM users WHERE username = ? AND password = ? AND role = ?`;
//   conn.query(query, [username, password, role], (err, results) => {
//     if (err) return res.status(500).send("Database error");
//     if (results.length === 0) {
//       return res.render("form", { error: "Invalid Credentials" });
//     }

//     const user = results[0];
//     req.session.user = { username: user.username, role: user.role };

//     if (user.role === "admin") return res.redirect("/admin/dashboard");
//     if (user.role === "doctor") return res.redirect("/doctor/dashboard");
//     if (user.role === "reception") return res.redirect("/reception/dashboard");
//     return res.redirect("/getstarted");
//   });
// });

// router.get("/admin/dashboard",authController.AdminDashBoradPage);

// router.get("/logout", (req, res) => {
//   req.session.destroy();
//   res.redirect("/getstarted");
// });

// router.get("/admin/add-doctor", authController.renderAddDoctor);
// router.post("/admin/add-doctor", authController.addDoctor);
// router.get("/admin/view-doctor", authController.viewDoctors);

// // router.get("/admin/view-doctor", doctorController.viewDoctors);
// router.get("/admin/delete-doctor/:id", doctorController.deleteDoctor);
// router.get("/admin/edit-doctor/:id", doctorController.renderEditDoctor);
// router.post("/admin/edit-doctor/:id", doctorController.updateDoctor);

// router.get("/admin/add-reception", receptionController.showAddReceptionForm);
// router.post("/admin/add-reception", receptionController.addReception);

// router.get("/admin/view-reception", receptionController.viewReceptions);//====================================

// module.exports = router;

const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const doctorController = require("../controller/doctorController");
const receptionController = require("../controller/receptionController");
const conn = require("../config/db");
const nurseController = require("../controller/nurseController");
const roomController=require("../controller/roomController");
const patientController=require("../controller/patientController")
const medicineController = require("../controller/medicineController");

router.get("/", (req, res) => {
  res.render("front");
});

router.get("/getstarted", (req, res) => {
  res.render("form", { error: null });
});

router.post("/adminlogin", (req, res) => {
  const { username, password, role } = req.body;
  console.log(username, password, role);

  const query =
    "SELECT * FROM users WHERE username = ? AND password = ? AND role = ?";
  conn.query(query, [username, password, role], (err, results) => {
    if (err) {
      return res.status(500).send("Database error");
    }
    if (results.length === 0) {
      console.log("Length is zero", results);

      return res.redirect("/form");
    }
    console.log("Length is zero", results);

    const user = results[0];
    req.session.user = { username: user.username, role: user.role };

    if (user.role === "admin") return res.redirect("/admin/dashboard");
    if (user.role === "doctor") return res.redirect("/doctor/dashboard");
    if (user.role === "reception") return res.redirect("/reception/dashboard");
    return res.redirect("/getstarted");
  });
});

// router.get("/form",(req,res)=>{
//   res.render("form")
// })

// router.get("/admin",(req,res)=>{
//   res.render("admin")
// })
router.get("/admin/dashboard", authController.AdminDashBoradPage);

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/getstarted");
  });
});

// Doctor Routes
router.get("/admin/add-doctor", authController.renderAddDoctor);
router.post("/admin/add-doctor", authController.addDoctor);
router.get("/admin/view-doctor", authController.viewDoctors);
router.get("/admin/delete-doctor/:id", doctorController.deleteDoctor);
router.get("/admin/edit-doctor/:id", doctorController.renderEditDoctor);
router.post("/admin/edit-doctor/:id", doctorController.updateDoctor);

// Reception Routes
router.get("/admin/add-reception", receptionController.showAddReceptionForm);
router.post("/admin/add-reception", receptionController.addReception);
router.get("/admin/view-reception", receptionController.viewReceptions);
router.get(
  "/admin/edit-reception/:id",
  receptionController.renderEditReception
);
router.post("/admin/edit-reception/:id", receptionController.updateReception);
router.get("/admin/delete-reception/:id", receptionController.deleteReception);

router.get('/reception/view-nurse', nurseController.viewNurses);
router.get('/reception/delete-nurse/:id', nurseController.deleteNurse);
router.get('/reception/edit-nurse/:id', nurseController.editNurseForm);
router.post('/reception/update-nurse/:id', nurseController.updateNurse);


router.get("/search-doctor", (req, res) => {
  const name = req.query.name || "";
  const query = `SELECT * FROM doctor WHERE doctor_name LIKE ?`;
  const searchTerm = `%${name}%`;

  conn.query(query, [searchTerm], (err, results) => {
    if (err) {
      console.error("Search error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

router.get("/search-reception", authController.searchRec);

router.get("/doctor/dashboard", doctorController.doctorDashboard);
router.get("/reception/dashboard", receptionController.receptionDashboard);
router.get("/reception/add-nurse", (req, res) => {
  res.render("addnurse"); // Create this EJS file
});

// Handle form submission
router.post("/reception/add-nurse", nurseController.addNurse);

router.get('/reception/view-nurse', nurseController.viewNurses);
router.get("/search-nurse", nurseController.searchNurse);
//Rooms Routes

router.get("/reception/add-room",roomController.renderAddRoom);
router.post("/reception/add-room",roomController.addRoom);
router.get("/reception/view-rooms", roomController.viewRoom);
router.get("/reception/edit-room/:room_no", roomController.renderEditRoom);
router.post("/reception/edit-room/:room_no", roomController.updateRoom);
router.get("/reception/delete-room/:room_no", roomController.deleteRoom);
router.get("/search-room", roomController.searchRoom);

//patient Routes
router.get("/reception/add-patient", patientController.renderAddPatientForm);
router.post("/reception/add-patient", patientController.addPatient);
router.get("/reception/view-patient", patientController.viewPatients);
router.get("/search-patient", patientController.searchPatient);

//medicine Routes
router.get("/doctor/add-medicine", medicineController.renderAddMedicineForm);
router.post("/doctor/add-medicine", medicineController.addMedicine);
router.get("/doctor/view-medicine", medicineController.viewMedicines);
router.get("/doctor/patient-visited", doctorController.showVisitedPatients);
router.get("/doctor/patient-not-visited", doctorController.showNotVisitedPatients);
router.get("/doctor/assign-patient", doctorController.viewAssignedPatients);

router.get('/doctor/add-medicine/:patientId', doctorController.renderAddMedicineForm);

router.post('/doctor/add-medicine/:patientId', medicineController.addMedicine);


module.exports = router;





