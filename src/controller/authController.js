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
  res.render("adddoctor");
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
