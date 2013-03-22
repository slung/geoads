(function( GA )
{
	var INPUT_SELECTOR = "#search-input";
	
	var SearchView = GA.View.extend({
		
		events: {
			"#search-btn": {
				click: "onSearch"
			},
			
			"#search-input": {
				keyup: "onKeyUp"
			},
		},
		
		init: function( cfg ) {
			
			// Call super
			this._parent( cfg );
			
			this.dataManager.on( 'userGeocoded', GA.bind( this.onUserGeocoded, this) );
		},
		
		register: function()
		{
			//this.onMessage("stateChanged", this.onStateChanged);
		},
		
		render: function()
		{
			this.container.innerHTML = this.mustache( this.templates.main, {});
			
			return this;
		},
		
		search: function( value, multipleResults )
		{
			this.searchInputText = value || this.getInputValue();
			
			if (!this.searchInputText)
				return;
			
			this.dataManager.geocode( this.searchInputText, true, {
				success: GA.bind( function( addresses ) {
					
					if ( addresses.length == 0 )
						return;
					
					var addressName = addresses[0].address;
					var addressLat = addresses[0].lat;
					var addressLon = addresses[0].lon;
					
					this.setInputValue( addressName );
					
					this.sendMessage( "drawMarker", {
						lat: addressLat,
						lon: addressLon
					});
					
					// if( (addresses.length > 1 && !this.useFirstAddress) || this.dynamicSearch)
						// this.renderAddresses( addresses );
					// else
						// this.searchAroundAddress( addresses[0] );
						
				}, this)
			} )
		},
		
		setInputValue: function( value )
		{
			GA.one( INPUT_SELECTOR, this.container ).value = value;
		},
		
		getInputValue: function()
		{
				return GA.one( INPUT_SELECTOR, this.container ).value;
		},
		
		/*
		 * Events
		 */
		onSearch: function( evt )
		{
			this.search();
		},
		
		onKeyUp: function( evt )
		{
			if( evt.keyCode == 13)
				this.search();
		},
		
		/*
		 * Messages
		 */
		
		onUserGeocoded: function( msg )
		{
			if ( !msg || !msg.address )
				return;
				
			this.setInputValue( msg.address );
		}
		
	});
	
	// Publish
	GA.SearchView = SearchView;
	
}(GA));