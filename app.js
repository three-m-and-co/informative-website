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
    var date = req.body.dateval;

    var stmt = db.prepare("INSERT INTO Guest VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    stmt.run(email, firstName, lastName, department, jobTitle, phone, updateRequested, date);
    stmt.finalize();

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

// start the server
app.listen(port);
console.log("Server started at localhost:" + port);