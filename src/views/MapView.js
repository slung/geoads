(function( GA )
{
	var MapView = GA.View.extend({
		
		map: null,
		
		events: {
			
		},
		
		init: function( cfg ) {
			
			// Call super
			this._parent( cfg );
			
			this.markerInfo = cfg.markerInfo || {
				url: "images/orange-pin.png",
				position: { 
					lat: 45.757284,
					lng: 21.228633
				}
			};
			
			this.radius = cfg.radius || 1000;
			this.zoom = cfg.zoom || 15;
		},
		
		register: function()
		{
			this.onMessage("showView", this.onShowView);
		},
		
		render: function()
		{
			var mapOptions = 
			{
				zoom: this.zoom,
				center: new google.maps.LatLng(this.markerInfo.position.lat, this.markerInfo.position.lng),
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				mapTypeControl: true,
			    mapTypeControlOptions: {
			        style: google.maps.MapTypeControlStyle.DEFAULT,
			        position: google.maps.ControlPosition.TOP_RIGHT
			    },
			    panControl: true,
			    zoomControl: true,
			    zoomControlOptions: {
			        style: google.maps.ZoomControlStyle.SMALL
			    },
			}
			
			this.map = new google.maps.Map( this.container, mapOptions );
			
			return this;
		},
		
		/*
		 * Draws the draggable location marker
		 */
		drawMarker: function()
		{
			if ( !this.markerInfo )
				return;
				
			this.marker = new google.maps.Marker({
				map: this.map,
				animation: google.maps.Animation.DROP,
				draggable: true,
				icon: this.markerInfo.url,
				position: new google.maps.LatLng( this.markerInfo.position.lat, this.markerInfo.position.lng )
			});
			
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
			
			//Render			
			this.adCoverage.setMap(this.map);
		},
		
		/*
		 * Draws a region on Google Map
		 * The region param represents an array og LatLng objects defining the polygon
		 */
		drawRegion: function( region )
		{
			var regionCenter = new google.maps.LatLng(46.16, 24.13);
			var regionRadius = 150000;
			
			this.transylvaniaRegion = new google.maps.Circle({
				center: regionCenter,
				radius: regionRadius,
				strokeColor: "#81B23C",
			    strokeOpacity: 0.8,
			    strokeWeight: 2,
			    fillColor: "#81B23C",
			    fillOpacity: 0.2	
			});
			
			this.transylvaniaRegion.setMap(this.map);
			
			google.maps.event.addListener(this.transylvaniaRegion, 'mouseover', GA.bind(function(){
				this.transylvaniaRegion.strokeWeight = 5;
				this.transylvaniaRegion.setMap(this.map);
			}, this));
			
			google.maps.event.addListener(this.transylvaniaRegion, 'mouseout', GA.bind(function(){
				this.transylvaniaRegion.strokeWeight = 2;
				this.transylvaniaRegion.setMap(this.map);
			}, this));
			
		},
		
		/*
		 * Messages
		 */
		
		onShowView: function( msg )
		{
			if ( msg.id != this.container.id)
				return;
				
			// google.maps.event.trigger(this.map, "resize");
			
			this.drawMarker();
		}
		
	});
	
	// Publish
	GA.MapView = MapView;
	
}(GA));