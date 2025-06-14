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
const Reception = require("../models/receptionModel"); // Already defined, just ensure consistency

exports.showAddReceptionForm = (req, res) => {
  res.render("addreceptionist");
};

exports.addReception = (req, res) => {
  const { reception_name, reception_contact, status, username, password } = req.body;

  userModel.createUser(username, password, "reception", (err, userResult) => {
    if (err) {
      console.error("User creation error:", err);
      return res.status(500).send("Error saving user");
    }

    const userId = userResult.insertId;
    const adminId = 1; // Assuming a fixed admin_id for now, adjust as per your auth logic

    receptionModel.createReception(reception_name, reception_contact, status, userId, adminId, (err, receptionResult) => {
      if (err) {
        console.error("Reception creation error:", err);
        return res.status(500).send("Error saving reception");
      }
      res.redirect("/admin/view-reception"); // Redirect to view all receptionists
    });
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
    status
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