(function( GA )
{
	// Singleton instance
	var adManager = null;
	var AdManager = new Class({
		
		ad: {},
		geoAdsPlatformUrl: "http://127.0.0.1:1314/",
		
		init: function()
		{
		},
		
		setAdMapSettings: function( adCenter, adRadius )
		{
			this.ad.center = adCenter;
			this.ad.radius = adRadius;
		},
		
		setAdInfoSettings: function( adName, adDescripton )
		{
			if ( !adName || !adDescripton )
				return;
			
			this.ad.name = adName;
			this.ad.description = adDescripton;
		},
		
		getAd: function()
		{
			return this.ad;
		},
		
		//GeoAds Platform communication
		saveAd: function()
		{
			if ( !this.ad || !this.ad.center || !this.ad.radius || !this.ad.name )
				return;
				
			var url = this.geoAdsPlatformUrl + "savead/";
			
			//Ad Name
			url += this.ad.name + "/";
			
			//Ad Center (lat and lon)
			url += this.ad.center.lat + "/" + this.ad.center.lon + "/";
			
			//Ad radius
			url += this.ad.radius;
			
			var cfg = {
		        method: 'GET',
		        on: {
		        	success: GA.bind( function( data ) {
		        		
		        		alert("Great success!");
		        		
		        		// if( success )
		        			// success.apply( this, [ M.JSON.parse(data) ] );
		        		
		        	}, this),
		        	error: function ( error )
		        	{
		        		console.log(error);
		        	}
		        },
		        headers: [ { name:"Content-Type", value:"text/plain"} ]
		    };
		
		    // Send request
		    if ( !GA.ajax )
		        throw new Error("Ajax function is not defined");
			    
		    //GA.ajax(url, cfg);
		    jQuery.ajax({
		    	url: url,
		    	type: 'GET',
		    	success: function(res)
		    	{
		    		alert("Great Success");
		    	}
		    });
		}
	});	

	AdManager.getInstance = function()
	{
		if( adManager )
			return adManager;
		
		adManager = new AdManager();
		return adManager;
	};
	
	// Publish
	GA.AdManager = AdManager;
	
}(GA));