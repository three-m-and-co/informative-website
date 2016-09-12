// File references: https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters

var path = require('path');
var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();

var app = express();
var port = process.env.port || 8080;

var file = 'test.db';
var exists = fs.existsSync(file);
var db = new sqlite3.Database(file);

app.use(bodyParser.json()); // support json-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(path.join(__dirname, "public/info"))); // directs user straight to info directory

/**
 * Function returns date in correct format for database (YYYY-MM-DD)
 */
function getCurrentDate() {

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();

    if (dd < 10) {

        dd = '0' + dd;
    }

    if (mm < 10) {

        mm = '0' + mm;
    }

    today = yyyy + '-' + mm + '-' + dd;

    return today;
}

// initialises database
// function ensures queries are run serially
db.serialize(function() {

    // if the database does not yet exist, it's created
    if (!exists) {

        // run query to instantiate database schema
        db.run("CREATE TABLE Guest (email TEXT PRIMARY KEY, first_name TEXT NOT NULL, last_name TEXT NOT NULL, dept TEXT, job TEXT, phone TEXT, update_requested INTEGER, date TEXT)");

        db.run("CREATE TABLE PageCount (ip TEXT PRIMARY KEY, date TEXT)");
    }
});

// POST http://localhost:8080/db/add-guest
// following handles any AJAX POST requests to /db/add-guest
app.post('/db/add-guest', function(req, res) {

    var email = req.body.emailval;
    var firstName = req.body.firstnameval;
    var lastName = req.body.lastnameval;
    var department = req.body.departmentval;
    var jobTitle = req.body.jobtitleval;
    var updateRequested = req.body.interestval;
    var phone = req.body.phoneval;
    var date = getCurrentDate();

    var stmt = db.prepare("INSERT INTO Guest VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    stmt.run(email, firstName, lastName, department, jobTitle, phone, updateRequested, date);
    stmt.finalize();

    // TEMP: currently spits out inputted values to ensure it's working
    db.each("SELECT * FROM Guest", function(err, row) {

        console.log(row.email);
        console.log(row.first_name);
        console.log(row.last_name);
        console.log(row.dept);
        console.log(row.job);
        console.log(row.phone);
        console.log(row.update_requested);
        console.log(row.date);
    });

    res.send("Data entered");
});

app.enable('trust proxy');

// POST http://localhost:8080/db/log-ip
// following handles any AJAX POST requests to /db/log-ip
app.get('/db/log-ip', function(req, res) {

    var ip = req.ip;
    var date = getCurrentDate();

    var stmt = db.prepare("INSERT INTO PageCount VALUES (?, ?)");
    stmt.run(ip, date);
    stmt.finalize();

    // TEMP: currently spits out inputted values to ensure it's working
    db.each("SELECT * FROM PageCount", function(err, row) {

        console.log(row.ip);
        console.log(row.date);
    });

    // TEMP: we will not send this in future
    res.send("IP logged");
});

// start the server
app.listen(port);
console.log("Server started at localhost:" + port);