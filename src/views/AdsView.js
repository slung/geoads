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
			
			this.ads = cfg.ads;
			
			//Load user ads
			//this.dataManager.loadUserAds();
		},
		
		register: function()
		{
		},
		
		render: function()
		{
			if ( !this.ads || this.ads.length == 0)
				return;
				
			this.container.innerHTML = this.mustache( this.templates.main, {
				ads: this.ads
			});
			
			return this;
		},
		
		selectAd: function( adSelector )
		{
			//First remove selected class
			GA.removeClass(GA.one(".selected", this.container), "selected");
			
			//Then add selected class to specified element
			GA.addClass(GA.one(adSelector, this.container), "selected");
		},
		
		/*
		 * Events
		 */
		onAdClick: function( evt )
		{
			var ad = evt.currentTarget.id;
			var adSelector = "#" + ad;
			
			this.selectAd( adSelector );
		}
	});
	
	// Publish
	GA.AdsView = AdsView;
	
}(GA));