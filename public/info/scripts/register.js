$(document).ready(function() {

    //on the fly field validation
    $('#firstname').blur(function() {
        if ($(this).val() === '') {
            $(this).addClass('error');
            $(this).prev().addClass('error');
            $(this).keypress(function() {
                $(this).removeClass('error');
                $(this).prev().removeClass('error');
            });
        }
    });

    $('#lastname').blur(function() {
        if ($(this).val() === '') {
            $(this).addClass('error');
            $(this).prev().addClass('error');
            $(this).keypress(function() {
                $(this).removeClass('error');
                $(this).prev().removeClass('error');
            });
        }
    });

    $('#email').blur(function() {
        if ($(this).val() === '') {
            $(this).addClass('error');
            $(this).prev().addClass('error');
            $(this).keypress(function() {
                $(this).removeClass('error');
                $(this).prev().removeClass('error');
            });
        }
    });
    //usually, I'd let JS test, if the email is actually ending with 'dsiti.qld.gov.au', but for demo-purposes, this would be counter-productive I guess

    //on submit, call the send function
    $('form#registration').submit(validationsend);

});

//send function (checks, if required fields are filled out)
function validationsend() {
    var firstnameval = $('#firstname').val();
    var lastnameval = $('#lastname').val();
    var emailval = $('#email').val();
    var departmentval = $('#department').val();
    var jobtitleval = $('#jobtitle').val();
    var interestval = $('#newsletter').is(":checked") ? 1 : 0;
    var phoneval = $('#phone').val();

    if (firstnameval !== '' && lastnameval !== '' && emailval !== '') {

        // encapsulate variables into data object for AJAX POST
        var data = {
            emailval: emailval,
            firstnameval: firstnameval,
            lastnameval: lastnameval,
            departmentval: departmentval,
            jobtitleval: jobtitleval,
            interestval: interestval,
            phoneval: phoneval
        };

        // performs an AJAX POST to submit guest data to db
        $.post("db/add-guest", data).done(function(response) {

            // response can be used to notify the user of success
            console.log(response);
        });
    }

    event.preventDefault();
}