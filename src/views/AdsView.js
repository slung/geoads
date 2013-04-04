(function( GA )
{
	var AdsView = GA.View.extend({
		
		events: {
			".ad":{
				click: "onAdClick"
			}
		},
		
		init: function( cfg ) {
			
			// Call super
			this._parent( cfg );
			
			//Add event listener for when user ads are loaded
			this.dataManager.on("adsLoaded", GA.bind( function(data){
				
				this.ads = data;
				this.render();
				
			}, this) );
			
			//Load user ads
			this.dataManager.loadUserAds();
		},
		
		register: function()
		{
			this.onMessage("selectAd", this.onSelectAd);
			this.onMessage("mapReady", this.onMapReady);
		},
		
		render: function()
		{
			if ( !this.ads || this.ads.length == 0)
			{
				
				//Change container size
				jQuery("#" + this.container.id).css("width", "100%");
				
				this.sendMessage("changeState", { state: GA.App.States.NO_ADS });
				
				this.container.innerHTML = this.mustache( this.templates.noAds, {});
				
				return this;
			}
			
			this.sendMessage("changeState", { state: GA.App.States.MAP });
			
			this.container.innerHTML = this.mustache( this.templates.main, {
				ads: this.ads
			});
			
			return this;
		},
		
		selectAd: function( adSelector, adIndex )
		{
			if ( !this.ads || this.ads.length == 0 )
				return;
			
			this.drawAd( adIndex );
			
			//First remove selected class
			GA.removeClass(GA.one(".selected", this.container), "selected");
			
			//Then add selected class to specified element
			GA.addClass(GA.one(adSelector, this.container), "selected");
		},
		
		drawAd: function( adIndex )
		{
			if ( adIndex == undefined )
				return;
			
			var adInfo = {
				lat: this.ads[adIndex].Lat,
				lon: this.ads[adIndex].Lon,
				radius: this.ads[adIndex].Radius
			};
			
			this.sendMessage("drawMarker", adInfo);
		},
		
		/*
		 * Messages
		 */
		
		onSelectAd: function( msg )
		{
			if ( !msg )
				return;
			
			var adSelector = "#ad-" + msg.adIndex
			
			this.selectAd( adSelector, msg.adIndex );
		},
		
		onMapReady: function( msg )
		{
			//Select first ad on map ready
			this.selectAd( "#ad-0", 0 );
		},
		
		/*
		 * Events
		 */
		onAdClick: function( evt )
		{
			var adId = evt.currentTarget.id;
			var adSelector = "#" + adId;
			var adIndex = adId.split('-')[1];
			
			this.selectAd( adSelector, adIndex );
		}
	});
	
	// Publish
	GA.AdsView = AdsView;
	
}(GA));