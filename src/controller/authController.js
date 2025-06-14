// const db= require("../config/db")
// exports.renderAddDoctor=(req,res)=>{
//     res.render("addDoctor");
// }

// exports.renderAddDoctor=((req,res)=>{
//     const{doctor_name,doctor_specialization,doctor_contact,doctor_experience,status,username,password}=req.body
//     const insertUser=`insert into users(username,password,role) values (?,?,'doctor')`;
//     db.query(insertUser,[username,password] ,(err,userResult)=>{
//         if(err)
//         {
//             console.error("error"+err);
//             return res.status(500).send("error saving users"+err.message);
//         }
//         const userId=userResult.insertId;

//         const insertDoctor = `insert into doctor (doctor_name,doctor_specialization,doctor_contact,doctor_experience,status,user_id) values (?,?,?,?,?,?)`;
//         db.query(insertDoctor,[doctor_name,doctor_specialization,doctor_contact,doctor_experience,status,userId],(err,docResult)=>{
//             if(err)
//             {
//                 console.error("error"+err);
//                 return res.status(500).send("error saving users"+err.message);
//             }
//             res.send("Doctor Added Succesfully");
//         })
//     })
// })

const db = require("../config/db");

exports.renderAddDoctor = (req, res) => {
  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    res.render("adddoctor", { layout: false });
  } else {
    res.render("adddoctor");
  }
};

exports.addDoctor = (req, res) => {
  console.log("Add Doctor Controller");

  const {
    doctor_name,
    doctor_specialization,
    doctor_contact,
    doctor_experience,
    status,
    username,
    password,
  } = req.body;

  const insertUser = `INSERT INTO users (username, password, role) VALUES (?, ?, 'doctor')`;

  db.query(insertUser, [username, password], (err, userResult) => {
    if (err) {
      console.error("Error saving user:", err);
      return res.status(500).send("Error saving user");
    }

    const userId = userResult.insertId;

    const insertDoctor = `
            INSERT INTO doctor (
                doctor_name,
                doctor_specialization,
                doctor_contact,
                doctor_experience,
                status,
                user_id,
                admin_id
            ) VALUES (?, ?, ?, ?, ?, ?,1)`;

    db.query(
      insertDoctor,
      [
        doctor_name,
        doctor_specialization,
        doctor_contact,
        doctor_experience,
        status,
        userId,
      ],
      (err2) => {
        if (err2) {
          console.error("Error saving doctor:", err2);
          return res.status(500).send("Error saving doctor");
        }
        res.redirect("/admin/dashboard");
      }
    );
  });
};

exports.viewDoctors = (req, res) => {
  const query = `
        SELECT d.doctor_id, d.doctor_name, d.doctor_specialization, d.doctor_contact,
               d.doctor_experience, d.status, u.username
        FROM doctor d
        JOIN users u ON d.user_id = u.user_id`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching doctors:", err);
      return res.status(500).send("Database error");
    }

    res.render("viewdoctor", {
      doctors: results,
    });
  });
};

// exports.AdminDashBoradPage = (req, res) => {
//   console.log("Admin addding doctor ");

//   if (req.session.user?.role !== "admin") return res.redirect("/getstarted");
//   res.render("admin");
// };

exports.AdminDashBoradPage = (req, res) => {
  console.log("Admin addding doctor ");

  if (req.session.user?.role !== "admin") 
    return res.redirect("/getstarted");
  res.render("admin");
};

//redirect("/urlName");   ----> router 

//render("pageName"); --> controller ---------- > model    (controler  <------  model)

//serachBar - url 
