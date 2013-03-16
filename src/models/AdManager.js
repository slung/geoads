(function( GA )
{
	// Singleton instance
	var adManager = null;
	var AdManager = new Class({
		
		ad: {},
		
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
			if ( !adCenter || !adRadius || !adName || !addDescription )
				return;
			
			this.ad.name = adName;
			this.ad.description = adDescripton;
		},
		
		getAd: function()
		{
			return this.ad;
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