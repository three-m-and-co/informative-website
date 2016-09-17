// script handles loading formatted ip dummy data to the initialised database

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

    var ip = lineAsArray[0];
    var date = lineAsArray[1];

    var stmt = db.prepare("INSERT INTO PageCount VALUES (?, ?)");
    stmt.run(ip, date);
    stmt.finalize();
});