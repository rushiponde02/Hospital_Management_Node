let app = require("./src/app.js");
const express = require('express');

const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

let PORT = 4000;

app.listen(PORT, () => {
    console.log("Server Started " + PORT);
});

