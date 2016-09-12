$(document).ready(function() {

    // the user has expressed interest in the product by clicking button
    $("#interestButton").click(function() {

        $.get('db/log-ip').done(function(response) {

            console.log(response);

        }).fail(function(err) {

            console.log(err);
        });
    });
});