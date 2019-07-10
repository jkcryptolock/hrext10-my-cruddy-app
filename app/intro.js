
$( document ).ready(function() {

	var clicks = 0;

	$( window ).on('click', function() {
		console.log(clicks);
	    if (clicks === 1){
	        window.location.replace('login.html');
	        console.log(clicks);
	    }
	    ++clicks;
	});

});





