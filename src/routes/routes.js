const express = require('express');
const router = express.Router();
const authController = require("../controller/authController");
const conn = require('../config/db');

router.get('/', (req, res) => {
    res.render('front');
});

router.get('/getstarted', (req, res) => {
    res.render('form', { error: null });
});

router.post('/adminlogin', (req, res) => {
    const { username, password, role } = req.body;
    const query = `SELECT * FROM users WHERE username = ? AND password = ? AND role = ?`;
    conn.query(query, [username, password, role], (err, results) => {
        if (err) 
            return res.status(500).send('Database error');
        if (results.length === 0) {
            return res.render('form', { error: 'Invalid Credentials' });
        }

        const user = results[0];
        req.session.user = { username: user.username, role: user.role };

        if (user.role === 'admin') 
            return res.redirect('/admin/dashboard');
        if (user.role === 'doctor') 
            return res.redirect('/doctor/dashboard');
        if (user.role === 'reception') 
            return res.redirect('/reception/dashboard');
        return res.redirect('/getstarted');
    });
});

router.get('/admin/dashboard', (req, res) => {
    if (req.session.user?.role !== 'admin') 
        return res.redirect('/getstarted');
    res.render('admin', { page: 'welcome', user: req.session.user });
});

router.get('/admin/add-doctor', (req, res) => {
    if (req.session.user?.role !== 'admin') 
        return res.redirect('/getstarted');
    res.render('admin', { page: 'add-doctor', user: req.session.user });
});

// router.post('/admin/add-doctor', (req, res) => {
//     const { name, email, contact, role, specialization, experience, status } = req.body;
//     const sql = `INSERT INTO doctors (doctor_name, doctor_specialization, doctor_contact, doctor_experience, status, user_id, admin_id)
//                  VALUES (?, ?, ?, ?, ?, ?, ?)`;
//     const userId = 1; // placeholder
//     const adminId = 1; // placeholder

//     conn.query(sql, [name, specialization, contact, experience, status, userId, adminId], (err) => {
//         if (err) 
//             return res.status(500).send("Database insert error");
//         res.redirect('/admin/dashboard');
//     });
// });

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/getstarted');
});

router.get("/admin/add-doctor",authController.renderAddDoctor);
router.post("/admin/add-doctor",authController.addDoctor);

module.exports = router;