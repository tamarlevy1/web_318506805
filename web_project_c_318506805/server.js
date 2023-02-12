//import modules
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const routes = require("./routes");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//tells the server '/views' or '/static' are static files, not api
app.use(express.static(__dirname + '/views'));
app.use("/views", express.static(__dirname + "/views"));
app.use("/static", express.static(__dirname + "/static"));

app.use(routes);

// set port, listen for requests
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

//run the database
const db = require('./db/db');
db.init();