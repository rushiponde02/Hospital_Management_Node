// const express = require("express");
// const bodyparser = require("body-parser");
// const session = require("express-session");
// const app = express();

// // Database
// require('./config/db');

// // Middleware
// app.use(bodyparser.urlencoded({ extended: true }));
// app.use(bodyparser.json());

// app.use(session({
//     secret: '11111111fdf',
//     resave: false,
//     saveUninitialized: false
// }));

// // Set view engine and public folder
// app.set('view engine', 'ejs');
// app.use(express.static("public"));

// // ✅ Mount router
// const router = require("./routes/routes");
// app.use("/", router); // <== This is important!

// module.exports = app;
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();
require('./config/db');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: 'hospital_secret',
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.use(express.static("public"));

const router = require("./routes/routes");
app.use("/", router);
module.exports = app;

