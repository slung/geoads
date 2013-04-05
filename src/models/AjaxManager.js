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
	var ajaxManager = null;
	var AjaxManager = new Class({
		
		geoAdsPlatformUrl: "http://localhost:1314/",
		
		login: function( email, password, success, error )
		{
			var url = this.geoAdsPlatformUrl + "login";
			var data = "email=" + email + "&" + "password=" + password;
			
			jQuery.ajax({
		    	url: url,
		    	type: 'POST',
		    	data: data,
		    	success: GA.bind(function( data ){
		    		if ( data.GreatSuccess == false )
		    			error.apply( this, [] );
		    		else
		    		{
		    			success.apply( this, [data] );
		    		}
		            	
		    	}, this)
		    });
		},
		
		register: function( email, password, success, error )
		{
			var url = this.geoAdsPlatformUrl + "register";
			var data = "email=" + email + "&" + "password=" + password;
			
			jQuery.ajax({
		    	url: url,
		    	type: 'POST',
		    	data: data,
		    	success: GA.bind(function( data ){
		    		if ( data.GreatSuccess == false )
		    			error.apply( this, [] );
		    		else
		    		{
		    			success.apply( this, [data] );
		    		}
		            	
		    	}, this)
		    });
		},
		

		getAds: function( success, error )
		{
			var url = this.geoAdsPlatformUrl + "ads";
			
			jQuery.ajax({
		    	url: url,
		    	type: 'POST',
		    	success: GA.bind(function( data ){
		    		if ( data.GreatSuccess == false )
		    			error.apply( this, [] );
		    		else
		    		{
		    			success.apply( this, [GA.JSON.parse(data)] );
		    		}
		            	
		    	}, this)
		    });
		},

		saveAd: function( name, description, radius, lat, lon, success, error )
		{
			if ( !name || !description || !radius || !lat || !lon && error)
			{
				error.apply( this, [] );
				return;
			}
			
			name = name.replace(/&/g, "amp;");
			description = description.replace(/&/g, "amp;");
			
			var url = this.geoAdsPlatformUrl + "ads/create";
			var data = "name=" + name + "&" +
					   "description=" + description + "&" +
					   "radius=" + radius + "&" +
					   "lat=" + lat + "&" +
					   "lon=" + lon;
			
			jQuery.ajax({
		    	url: url,
		    	type: 'POST',
		    	data: data,
		    	success: GA.bind(function( data ){
		    		
		    		if ( !data || !data.GreatSuccess && error)
		    			error.apply( this, [] );
		    		else if( success )
		            	success.apply( this, [] );
		    	}, this),
		    	error: GA.bind(function( data ){
		    		if( error )
		            	error.apply( this, [] );
		    	}, this)
		    });
		},
		
		loadUserAds: function()
		{
			var url = this.geoAdsPlatformUrl + "register";
			var data = "email=" + email + "&" + "password=" + password;
			
			jQuery.ajax({
		    	url: url,
		    	type: 'POST',
		    	data: data,
		    	success: GA.bind(function( data ){
		    		if ( data.GreatSuccess == false )
		    			error.apply( this, [] );
		    		else
		    		{
		    			success.apply( this, [data] );
		    		}
		            	
		    	}, this)
		    });
		},
		
		deleteAd: function( id )
		{
			if ( id == undefined )
				return;
			
			var url = this.geoAdsPlatformUrl + "ads/delete";
			var data = "id=" + id;
			
			jQuery.ajax({
		    	url: url,
		    	type: 'POST',
		    	data: data
		    });
		},
	});
	
	AjaxManager.getInstance = function()
	{
		if( ajaxManager )
			return ajaxManager;
		
		ajaxManager = new AjaxManager();
		return ajaxManager;
	};
	
	// Create & add an instance of ajax to GeoAds namespace
	GA.AjaxManager = AjaxManager;
	
})(GA);

