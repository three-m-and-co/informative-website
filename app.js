// File references: https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters,
// https://www.npmjs.com/package/uqsso

var path = require('path');
var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();

var execPhp = require('exec-php');

/*
var uqsso = require('uqsso');
var cookieParser = require('cookie-parser');
var sso = uqsso();
sso.public('^/$');
*/
var app = express();
var port = process.env.port || 8080;
/*
app.use(cookieParser());
app.use(sso);
*/
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

    var stmt = db.prepare("INSERT OR IGNORE INTO Guest VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    stmt.run(email, firstName, lastName, department, jobTitle, phone, updateRequested, date);
    stmt.finalize();

    res.send("Data entered");
});

// GET http://localhost:8080/db/get-guests
// following handles any AJAX GET requests to /db/get-guests
app.get('/db/get-guests', function(req, res) {

    var returnArray = [];
    db.each("SELECT email, update_requested, date FROM Guest", function(err, row) {

        var rowArray = [];
        rowArray.push(row.email);
        rowArray.push(row.update_requested);
        rowArray.push(row.date);

        returnArray.push(rowArray);
    });

    res.send(returnArray);
});

app.enable('trust proxy');

// POST http://localhost:8080/db/log-ip
// following handles any AJAX POST requests to /db/log-ip
app.get('/db/log-ip', function(req, res) {

    var ip = req.ip;
    var date = getCurrentDate();

    var stmt = db.prepare("INSERT OR IGNORE INTO PageCount VALUES (?, ?)");
    stmt.run(ip, date);
    stmt.finalize();
});

// GET http://localhost:8080/db/get-ips
// following handles any AJAX GET requests to /db/get-ips
app.get('/db/get-ips', function(req, res) {

    var returnArray = [];
    db.each("SELECT * FROM PageCount", function(err, row) {

        var rowArray = [];
        rowArray.push(row.ip);
        rowArray.push(row.date);

        returnArray.push(rowArray);
    });
});

// GET http://localhost:8080/adminlogin
// following handles any AJAX GET requests to /adminlogin
/*
    Note: '/usr/bin/php' will be different for you on your machine (it's the
    path to where php is installed on your machine [so you'll have to install
    it if it's not already installed])
*/
app.get('/adminlogin', function(req, res) {

    var astring = "php didn't work - check server since it probably crashed";

    execPhp('./php/uqsignon.php', '/usr/bin/php', function(error, php, output) {

        // should now have access to functions within 'test.php'
        php.runtest(function(error, result, output, printed) {

            // you should see 'This is a test' when you run 'node app.js' in a
            // command prompt
            console.log(result);
            astring = result;
        });
    });
    res.send(astring);
});


/*
// GET http://localhost:8080/auth
// following handles any requests to /auth
app.get('/auth', function(req, res, next) {

    console.log("Directed to auth page");
    return res.send(JSON.stringify(req.user));
});
*/
// start the server
app.listen(port);
console.log("Server started at localhost:" + port);