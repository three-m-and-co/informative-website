// script handles loading formatted dummy data to the initialised database

var dataFile = "data/formatted-dummy-data.csv";
var lineReader = require("readline").createInterface({
    input: require("fs").createReadStream(dataFile)
});
var sqlite3 = require("sqlite3");

var file = "test.db";
var db = new sqlite3.Database(file);

// iterates through each line of the file and inserts found values into db
lineReader.on("line", function(line) {

    var lineAsArray = line.split(",");

    var email = lineAsArray[2];
    var firstName = lineAsArray[0];
    var lastName = lineAsArray[1];
    var department = lineAsArray[3];
    var job = lineAsArray[4];
    var phone = lineAsArray[5];
    var newsletter = lineAsArray[6];
    var date = lineAsArray[7];

    var stmt = db.prepare("INSERT INTO Guest VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    stmt.run(email, firstName, lastName, department, job, phone, newsletter,
        date);
    stmt.finalize();
});