(function( GA )
{
	// Singleton instance
	var adManager = null;
	var AdManager = new Class({
		
		ad: {},
		geoAdsPlatformUrl: "http://127.0.0.1:1314/",
		
		init: function()
		{
			this.ajax = GA.AjaxManager.getInstance();
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
			if ( !this.ad || !this.ad.center || !this.ad.radius || !this.ad.name || !this.ad.description)
				return;
				
			this.ajax.saveAd( this.ad.name, this.ad.description, this.ad.radius, this.ad.center.lat, this.ad.center.lon, function(){
				alert("Save ad Success!");
			}, function(){
				alert("Save ad Fail!")
			} );
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