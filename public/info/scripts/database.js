var file = "../../../test.db";
var fs = require("fs");
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);
var exists = fs.existsSync(file);

/**
 * Function takes as input a string email, a string name and string message to
 * input into the database. If a message is added by a user who does not yet
 * exist, user email and name is added first.
 */
function addMessage(email, name, message) {

    // if the user does not yet exist, they are inserted
    if (!emailExists(email)) {

        // insert email and name into User
        var addUserStmt = db.prepare("INSERT INTO User VALUES (?, ?)");

        addUserStmt.run(email, name);
        addUserStmt.finalize();
    }

    // insert a prepared statement into Comment using given email and message
    var addMessageStmt = db.prepare("INSERT INTO Comment VALUES (?, ?, ?)");

    // TODO: work out how to create datetime for sqlite3 database
    var datetime;

    addMessageStmt.run(message, email, datetime);
    addMessageStmt.finalize();
}

/**
 * Function returns a 2-dimensional array where the outer arrays are each tuple
 * returned from the database, and the inner arrays contain the name and
 * message for each tuple in that order.
 */
function getComments() {

    var results = [];
    db.each("SELECT User.name, Comment.message FROM User, Comment WHERE Comment.email = User.email", function(err, row) {

        // creates a tuple for each row
        var tuple = [];
        tuple.push(row.name);
        tuple.push(row.message);

        // adds the row to the 2-dimensional results array
        results.push(tuple);
    });

    return results;
}

/**
 * Function takes as input an email as string and returns whether given email
 * already exists within the database.
 */
function emailExists(email) {

    db.all("SELECT email FROM User WHERE email = " + email, function(err, rows) {

        // if rows is empty, the email can not be found
        if (rows.length === 0) {

            return false;

        } else {

            // assumes we receive precisely one tuple
            return rows[0].email === email;
        }
    });
}

$(document).ready(function() {

    // function ensures queries are run serially
    db.serialize(function() {

        // if the database does not yet exist, it's created
        if (!exists) {

            // run query to instantiate database schema
            db.run("CREATE TABLE User (email TEXT PRIMARY KEY, name TEXT)");
            db.run("CREATE TABLE Comment (message TEXT, email TEXT, time TEXT, PRIMARY KEY (message, email), FOREIGN KEY (email) REFERENCES User.email) ON DELETE CASCADE ON UPDATE CASCADE");
        }
    });
});