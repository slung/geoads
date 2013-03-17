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