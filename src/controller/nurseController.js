const Nurse = require("../models/nurseModel");
const nurseModel = require("../models/nurseModel");


exports.addNurse = (req, res) => {
  const { nurse_name, nurse_contact, nurse_shift } = req.body;

  Nurse.createNurse(nurse_name, nurse_contact, nurse_shift, (err, result) => {
    if (err) {
      console.error("Error adding nurse:", err);
      return res.status(500).send("Database error while adding nurse.");
    }

    res.redirect('/reception/dashboard');
  });
};


exports.viewNurses = async (req, res) => {
  try {
    const nurses = await Nurse.getAllNurses();
    res.render('viewNurses', { nurses }); 
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

exports.searchNurse = (req, res) => {
  const name = req.query.name || "";

  nurseModel.searchNurseByName(name, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};