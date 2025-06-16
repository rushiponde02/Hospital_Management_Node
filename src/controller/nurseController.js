const Nurse = require("../models/nurseModel");

// ✅ Add Nurse Controller
exports.addNurse = (req, res) => {
  const { nurse_name, nurse_contact, nurse_shift } = req.body;

  Nurse.createNurse(nurse_name, nurse_contact, nurse_shift, (err, result) => {
    if (err) {
      console.error("Error adding nurse:", err);
      return res.status(500).send("Database error while adding nurse.");
    }
    // ✅ Redirect to Reception Dashboard
    res.redirect('/reception/dashboard'); // NOTE: slash at the beginning is important
  });
};

// ✅ View Nurse Controller
exports.viewNurses = async (req, res) => {
  try {
    const nurses = await Nurse.getAllNurses(); // Using same Nurse model
    res.render('viewNurses', { nurses }); // Make sure viewNurses.ejs exists in /views
  } catch (error) {
    console.error("Error fetching nurses:", error);
    res.status(500).send("Error retrieving nurse data.");
  }
};



// Delete Nurse
exports.deleteNurse = (req, res) => {
  const id = req.params.id;
  Nurse.deleteNurse(id, (err, result) => {
    if (err) {
      console.error("Delete error:", err);
      return res.status(500).send("Error deleting nurse.");
    }
    res.redirect('/reception/view-nurse');
  });
};

// Render Edit Nurse Form
exports.editNurseForm = (req, res) => {
  const id = req.params.id;
  Nurse.getNurseById(id, (err, results) => {
    if (err) return res.status(500).send("Error retrieving nurse.");
    res.render("editNurse", { nurse: results[0] });
  });
};

// Handle Edit Nurse Submission
exports.updateNurse = (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  Nurse.updateNurse(id, updatedData, (err, result) => {
    if (err) {
      console.error("Update error:", err);
      return res.status(500).send("Error updating nurse.");
    }
    res.redirect('/reception/view-nurse');
  });
};
