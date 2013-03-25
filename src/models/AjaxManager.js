(function( GA )
{
	/**
	 * Ajax class is used to make XHR requests.
	 * 
	 * @class Ajax
	 * @module core
	 * @version 0.1.0
	 * 
	 * @constructor Ajax
	 */
	var Ajax = new Class({
		
		geoAdsPlatformUrl = "http://127.0.0.1:1314/",
		
		login: function( email, password, success, error )
		{
			var url = this.geoAdsPlatformUrl + "login";
			var data = email + "&" + password;
			
			jQuery.ajax({
		    	url: url,
		    	type: 'POST',
		    	data: data,
		    	success: GA.bind(function( data )
		    	{
		    		if( success )
		            	success.apply( this, [GA.JSON.parse(data)] );
		    	}, this),
		    	error: GA.bind(function( data )
		    	{
		    		if( error )
		            	error.apply( this, [] );
		    	}, this);
		    });
		},
	});
	// Create & add an instance of ajax to GeoAds namespace
	GA.Ajax = Ajax;
	
})(GA);

