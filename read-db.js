// script is useful for checking that values are present in DB

var sqlite3 = require("sqlite3");
var file = "test.db";
var db = new sqlite3.Database(file);

// displays all unique fields in Guest table
db.each("SELECT * FROM Guest", function(err, row) {

    console.log(row.email);
});