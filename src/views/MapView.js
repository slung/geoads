(function( GA )
{
	var PUBLISH_ZOOM = 17;
	var MapView = GA.View.extend({
		
		map: null,
		maxRadius: 2000,
		zoom: PUBLISH_ZOOM,
		
		events: {
			"#next-step":{
				click: "onNextStepClick"
			}
		},
		
		init: function( cfg ) {
			
			// Call super
			this._parent( cfg );
			
			this.dataManager.on('userGeocoded', GA.bind( this.onUserGeocoded, this));
			this.dataManager.on('userNotGeocoded', GA.bind( this.onUserNotGeocoded, this));
			
			this.markerInfo = cfg.markerInfo || {
				url: "images/orange-pin.png",
				position: { 
					lat: 15,
					lng: 0
				}
			};
			
			this.radius = cfg.radius || 100;
			
			if ( this.radius > this.maxRadius )
				this.radius = this.maxRadius;
			
			this.startZoom = cfg.startZoom || 3;
		},
		
		register: function()
		{
			this.onMessage("drawMarker", this.onDrawMarker);
			this.onMessage("resizeMap", this.onResizeMap);
		},
		
		render: function()
		{
			var mapOptions = 
			{
				zoom: this.startZoom,
				center: new google.maps.LatLng(this.markerInfo.position.lat, this.markerInfo.position.lng),
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				mapTypeControl: true,
			    mapTypeControlOptions: {
			        style: google.maps.MapTypeControlStyle.DEFAULT,
			        position: google.maps.ControlPosition.TOP_RIGHT
			    },
			    panControl: false,
			    zoomControl: false,
			    streetViewControl: false,
			    zoomControlOptions: {
			        style: google.maps.ZoomControlStyle.SMALL
			    },
			}
			
			this.map = new google.maps.Map( this.renderContainer, mapOptions );
			
			return this;
		},
		
		centerAndZoom: function( center, zoom )
		{
			if ( !center || !center.lat || !center.lon || !zoom)
				return;
				
			var center = new google.maps.LatLng( center.lat, center.lon );
			
			this.map.setCenter( center );
			this.map.setZoom( zoom );
		},
		
		/*
		 * Draws the draggable location marker
		 */
		drawMarker: function( markerInfo )
		{
			this.markerInfo = markerInfo || this.markerInfo; 
			
			if ( !this.markerInfo )
				return;
			
			if ( !this.marker )
			{
				this.createMarker( this.markerInfo );
			}
			else
			{
				this.marker.setPosition( new google.maps.LatLng( this.markerInfo.position.lat, this.markerInfo.position.lng ) );
			}
			
			//Center and zoom map
			this.centerAndZoom( {
				lat: this.markerInfo.position.lat,
				lon: this.markerInfo.position.lng
			}, this.zoom ); 
			
			this.drawCoverage();
			
			//Add the coverage object to the map object
			this.marker.adCoverage = this.adCoverage;
			
			//Bind coverage to marker
			this.adCoverage.bindTo( 'map', this.marker );
			
			//Bind marker to coverage
			this.adCoverage.bindTo( 'center', this.marker, 'position' );
			
			google.maps.event.addListener(this.marker, "dragend", GA.bind(function(){
				this.drawCoverage();
			}, this));
		},
		
		createMarker: function( markerInfo )
		{
			this.marker = new google.maps.Marker({
				map: this.map,
				animation: google.maps.Animation.DROP,
				draggable: true,
				icon: markerInfo.url,
				position: new google.maps.LatLng( markerInfo.position.lat, markerInfo.position.lng )
			});
		},
		
		drawCoverage: function()
		{
			var center = this.marker.getPosition();
			
			if ( !this.adCoverage )
			{
				this.adCoverage = new google.maps.Circle({
					editable: true,
					center: center,
					radius: this.radius,
					strokeColor: "#008CE4",
				    strokeOpacity: 0.5,
				    strokeWeight: 1,
				    fillColor: "#00A4E4",
				    fillOpacity: 0.3	
				});
			}
			else
			{
				this.adCoverage.setCenter( center );
			}
			
			google.maps.event.addListener(this.adCoverage, "radius_changed", GA.bind(function( evt ){
				
				if ( this.adCoverage.radius > this.maxRadius )
				{
					this.adCoverage.setRadius( this.maxRadius );
					
					//@ToDO: Should show a message to the user when maxRadius is reached!!!
				}
				
			}, this));
			
			//Render			
			this.adCoverage.setMap(this.map);
			google.maps.event.trigger(this.map, "resize");
		},

		
		/*
		 * Messages
		 */
		onDrawMarker: function( msg )
		{
			if ( !msg || !msg.lat || !msg.lon )
				return;
			
			this.zoom = PUBLISH_ZOOM;
			
			var markerInfo = {};
			
			markerInfo.url = this.markerInfo.url;
			markerInfo.position = {};
			markerInfo.position.lat = msg.lat;
			markerInfo.position.lng = msg.lon;
			
			this.drawMarker( markerInfo );
		},
		
		onUserGeocoded: function( msg )
		{
			if ( !msg || !msg.lat || !msg.lon )
				return;
			
			this.zoom = PUBLISH_ZOOM;
			
			var markerInfo = {};
			
			markerInfo.url = this.markerInfo.url;
			markerInfo.position = {};
			markerInfo.position.lat = msg.lat;
			markerInfo.position.lng = msg.lon;
			
			this.drawMarker( markerInfo );
		},
		
		/*
		 * If user was not geocoded set the map to default position
		 */
		onUserNotGeocoded: function( msg )
		{
			this.zoom = 3;
		},
		
		onResizeMap: function( msg )
		{
			google.maps.event.trigger(this.map, "resize");
			
			//Center and zoom map
			this.centerAndZoom( {
				lat: this.markerInfo.position.lat,
				lon: this.markerInfo.position.lng
			}, this.zoom );
		},
		
		/*
		 * Events
		 */
		
		onNextStepClick: function( evt )
		{
			//Save the configured ad and move to the Info View
			
			var markerPosition  = this.marker.getPosition();
			var adCoverage = Math.round(this.adCoverage.getRadius());
			
			//Save
			this.adManager.setAdMapSettings( { lat: markerPosition.lat(), lon: markerPosition.lng() }, adCoverage );
			
			//Switch to Info View
			this.sendMessage("changeState", { state: GA.App.States.INFO });
		},

	});
	
	// Publish
	GA.MapView = MapView;
	
}(GA));