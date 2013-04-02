GA.bind = function(fn, c) 
{
    return function() {
        return fn.apply(c || fn, arguments);
    };
};

GA.JSON = {};
GA.JSON.parse = function( data )
{
	var result = null;
	
	try
	{
		result = eval("x = " + data);
	}
	catch(err) 
	{
	}
	
	return result;
};

GA.validateEmailInput = function( email )
{
	if ( email == "" )
		return false;
		
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	
	return re.test(email);
}
		
GA.validatePasswordInput = function( password )
{
	if ( password == "" )
		return false;
	
	return true;
};