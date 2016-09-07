$(document).ready(function(){

    //on the fly field validation
	$('#firstname').blur(function(){
        if($(this).val() == ''){
            $(this).addClass('error');
            $(this).prev().addClass('error');
            $(this).keypress(function(){
                $(this).removeClass('error');
                $(this).prev().removeClass('error');
            });
	}});

	$('#lastname').blur(function(){
        if($(this).val() == ''){
            $(this).addClass('error');
            $(this).prev().addClass('error');
            $(this).keypress(function(){
                $(this).removeClass('error');
                $(this).prev().removeClass('error');
            });
	}});

	$('#email').blur(function(){
		if($(this).val() == ''){
			$(this).addClass('error');
            $(this).prev().addClass('error');
			$(this).keypress(function(){
				$(this).removeClass('error');
                $(this).prev().removeClass('error');
			});
	}});
    //usually, I'd let JS test, if the email is actually ending with 'dsiti.qld.gov.au', but for demo-purposes, this would be counter-productive I guess

    //on submit, call the send function
	$('form#registration').submit(validationsend);
	
});



//send function (checks, if required fields are filled out)
function validationsend(){
		var firstnameval = $('#firstname').val();
		var lastnameval = $('#lastname').val();
		var emailval = $('#email').val();
		var departmentval = $('#department').val();
		var jobtitleval = $('#jobtitle').val();
		var phoneval = $('#phone').val();

		if(firstnameval != '' && lastnameval != '' && emailval != ''){
			//Matthew, do your database magic here ;)
			console.log(firstnameval);
			console.log(lastnameval);
			console.log(emailval);
			console.log(departmentval);
			console.log(jobtitleval);
			console.log(phoneval);
		}
		event.preventDefault();
}
