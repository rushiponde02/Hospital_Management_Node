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

