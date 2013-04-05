(function( GA )
{
	var AdsView = GA.View.extend({
		
		events: {
			".ad":{
				click: "onAdClick"
			},
			"#buttons .delete":{
				click: "onDeleteAdClick"
			}
		},
		
		init: function( cfg ) {
			
			// Call super
			this._parent( cfg );
			
			this.onReady = cfg.onReady;
			
			if ( this.onReady )
				GA.bind( this.onReady, this );
			
			//Add event listener for when user ads are loaded
			this.dataManager.on("adsLoaded", GA.bind( function(data){
				
				this.ads = data;
				this.render();
				
			}, this) );
			
			//Load user ads
			this.dataManager.loadUserAds();
			
			//this.ads = cfg.ads;
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
			
			//Change container size
				jQuery("#" + this.container.id).css("width", 370);
			
			this.sendMessage("changeState", { state: GA.App.States.MAP });
			
			this.container.innerHTML = this.mustache( this.templates.main, {
				ads: this.ads
			});
			
			if (this.onReady)
				this.onReady();
			
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
		
		deleteAd: function( adObject )
		{
			if ( !adObject )
				return;
			
			var adSelector = "#ad-" + adObject.index;
			
			//Visually remove Ad
			jQuery(adSelector).fadeOut('slow', GA.bind(function(){
				
				this.adManager.deleteAd(adObject.InternalId);
				
				//Remove from Ads array
				this.ads.splice( adObject.index, 1 );
				
				//Synchronize internal Index fro Ads
				if ( this.ads.length > 0 )
					for ( var i = 0; i < this.ads.length; i++ )
						this.ads[i].index = i;
				
				//Re-render view
				this.render();
				
				if ( this.ads.length > 0 )
				{
					var nextAdIndex = this.ads[0].index;
					this.selectAd("#ad-" + nextAdIndex, 0);
				}
				
			}, this));
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
		},
		
		onDeleteAdClick: function( evt )
		{
			var adId = evt.currentTarget.id;
			var adIndex = adId.split('-')[1];
			
			var adObject = this.ads[adIndex];
			
			this.deleteAd( adObject );
		}
	});
	
	// Publish
	GA.AdsView = AdsView;
	
}(GA));