(function( GA )
{
	var EventManager = new Class({
		
		$events: null,
		
		init: function()
		{
			this.$events = {};
		},
		
		/**
		 * Add listeners to the map.
		 * 
		 * @param eventName
		 * @param fn
		 * 
		 */
		on: function( eventName, fn )
		{
			this.$events[eventName] = this.$events[eventName] || [];
			
			// @TODO: search function befor push
			this.$events[eventName].push( fn );
		},
		
		/**
		 * Fire an event
		 * 
		 * @param {String} eventName
		 * @param {Object} params
		 */
		fire: function( eventName, params )
		{
			var functions = this.$events[eventName];
			
			if( functions )
			{
				for(var key in functions)
				{
					var fn = functions[key];
					fn.apply( this, [params]);
				}	
			}
		},
		
		detach: function( eventName, fn )
		{
			var events = this.$events[eventName];
			
			for( var i=0; i< events.length; i++ )
			{
				if( events[i] == fn )
				{
					delete events[i];
					return;
				}
			}
			
			return;  
		}
	});	

	
	// Publish
	GA.EventManager = EventManager;
	
}(GA));

(function( GA)
{
	var MsgManager = GA.EventManager.extend({
		
		init: function()
		{
			this._parent();
		},
		
		onMessage: function( msgName, fn )
		{
			GA.dispatcher.on( msgName, GA.bind( fn, this ) );
		},
		
		sendMessage: function( msgName, data )
		{
			GA.dispatcher.fire( msgName, data );
		}
		
	});	

	
	// Publish
	GA.MsgManager = MsgManager;
	
	// Make one instance
	GA.dispatcher = new MsgManager();
	
}(GA));

(function( GA )
{
	// Singleton instance
	var dataManager = null;
	var MASK_ELEMENT = ".page";
	
	var DataManager = GA.EventManager.extend({
		
		tableName: '',
		filters: [],
		rowCount: 20,
		cluster: null,
		showLoading: false,
		
		// stores loaded tables
		tables: [],
		
		init: function( cfg ) 
		{
			if( dataManager )
				throw new Error('You can only create one instance of DataManager!');
			
			this._parent();
		}
		
	});
	
	DataManager.getInstance = function()
	{
		if( dataManager )
			return dataManager;
		
		dataManager = new DataManager();
		return dataManager;
	};
	
	// Publish
	GA.DataManager = DataManager;
	
}(GA));

(function( GA )
{
	var View = GA.MsgManager.extend({
		
		app: null,
		mustache: null,
		templates: null,

		init: function( cfg ) {
			
			this.mustache  = GA.mustache;
			
			this.templates = cfg.templates;
			this.container = cfg.container;
			this.hideOnStates = cfg.hideOnStates || [];
			this.formatRenderData = cfg.formatRenderData;
			this.dataManager = GA.DataManager.getInstance();
			
			this.events = GA.extend( this.events || {}, cfg.events || {} );
			
			this.parseEvents();
			this.register();
		},
		
		register: function()
		{
		},
		
		render: function()
		{
		},
		
		parseEvents: function()
		{
			var events = this.events || {};
			
			for( var selector in events ) 
				for( var eventType in events[selector] )
				{
					var fn = this[events[selector][eventType]] || events[selector][eventType];
					GA.delegate( this.container, selector, eventType, GA.bind( fn, this));
				}
		},
		
		getDictionary: function()
		{
			return GA.LanguageManager.getInstance().dictionary;
		}
	});
	
	// Publish
	GA.View = View;
	
}(GA));

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
			//this.onMessage("showView", this.onShowView);
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
			
			this.drawMarker();
			
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
			
		}
		
		/*
		 * Messages
		 */
		
		
		
	});
	
	// Publish
	GA.MapView = MapView;
	
}(GA));

(function( GA )
{
	var MenuView = GA.View.extend({
		
		events: {
			".menu-item":{
				click: "onMenuItemClick"
			}
		},
		
		init: function( cfg ) {
			
			// Call super
			this._parent( cfg );
		},
		
		register: function()
		{
		},
		
		render: function()
		{
			this.container.innerHTML = this.mustache( this.templates.main, {});
			
			return this;
		},
		
		/*
		 * Events
		 */
		
		onMenuItemClick: function( evt )
		{
			var menuItem = evt.currentTarget.id;
			
			switch ( menuItem )
			{
				case "home":
				{
					this.sendMessage("changeState", {
						state: GA.App.States.GALLERY
					});
					
					break;
				}
				
				case "map":
				{
					this.sendMessage("changeState", {
						state: GA.App.States.MAP
					});
					
					break;
				}
				
				case "places":
				{
					this.sendMessage("changeState", {
						state: GA.App.States.PLACES
					});
					
					break;
				}
				
				case "tours":
				{
					this.sendMessage("changeState", {
						state: GA.App.States.TOURS
					});
					
					break;
				}
				
				case "contact":
				{
					this.sendMessage("changeState", {
						state: GA.App.States.CONTACT
					});
					
					break;
				}
			}
		}
		
	});
	
	// Publish
	GA.MenuView = MenuView;
	
}(GA));

(function( GA )
{
	var StepsView = GA.View.extend({
		
		events: {
			"#next-step":{
				click: "onNextStepClick"
			},
			"#previous-step":{
				click: "onPreviousStepClick"
			}
		},
		
		init: function( cfg ) {
			
			// Call super
			this._parent( cfg );
		},
		
		register: function()
		{
			this.onMessage("stateChanged", this.onStateChanged);
		},
		
		render: function()
		{
			this.container.innerHTML = this.mustache( this.templates.main, {});
			
			return this;
		},
		
		/*
		 * Events
		 */
		
		onNextStepClick: function( evt )
		{
			this.sendMessage("changeState", { state: GA.App.States.INFO });
		},
		
		onPreviousStepClick: function( evt )
		{
			this.sendMessage("changeState", { state: GA.App.States.MAP });
		},
		
		/*
		 * Messages
		 */
		onStateChanged: function( msg )
		{
			//Hide "Next" button in "INFO" state, hide "Previous" button in "MAP" state
			if ( msg.currentState == GA.App.States.INFO )
			{
				GA.addClass(GA.one( "#next-step", this.container ), "hide");
				GA.removeClass(GA.one( "#previous-step", this.container ), "hide");
			}
			else if ( msg.currentState == GA.App.States.MAP )
			{
				GA.addClass(GA.one( "#previous-step", this.container ), "hide");
				GA.removeClass(GA.one( "#next-step", this.container ), "hide");
			}
		}
	});
	
	// Publish
	GA.StepsView = StepsView;
	
}(GA));

(function( GA )
{
	var InfoView = GA.View.extend({
		
		events: {
			"#next-step":{
				click: "onNextStepClick"
			},
			"#previous-step":{
				click: "onPreviousStepClick"
			}
		},
		
		init: function( cfg ) {
			
			// Call super
			this._parent( cfg );
		},
		
		register: function()
		{
		},
		
		render: function()
		{
			this.container.innerHTML = this.mustache( this.templates.main, {});
			
			return this;
		},
		
		/*
		 * Events
		 */
		
		onNextStepClick: function( evt )
		{
			console.log("next");
		},
		
		onPreviousStepClick: function( evt )
		{
			console.log("previous");
		}
	});
	
	// Publish
	GA.InfoView = InfoView;
	
}(GA));

(function( GA )
{
	var GeoAdsApp = GA.MsgManager.extend({
		
		views: [],
		state: null,
		lastState: null,
		
		init: function( cfg )
		{
			this._parent();
			
			// Store state & add views
			this.state = cfg.state;
			this.language = cfg.language;
			this.addViews( cfg.views || [] );
			this.appReady = cfg.appReady;
			
			// Register message
			this.register();
			
			GA.DataManager.getInstance().app = this;
		},
		
		addView: function( view )
		{
			//IE8 Fix, Array length is incorrect because of trailing comma
			if (!view)
				return;
			
			view.app = this;
			
			if( this.views.indexOf(view) == -1 )
				this.views.push( view );
		},
		
		addViews: function( views )
		{
			for( var i=0; i< views.length; i++ )
				this.addView( views[i] );
		},
		
		removeView: function( view )
		{
		},
		
		register: function()
		{
			this.onMessage( 'changeState', this.onChangeState );
			this.onMessage( 'reverseState', this.onReverseState );
		},
		
		start: function()
		{
			if( this.language )
			{
				GA.LanguageManager.getInstance().loadLanguage(this.language, GA.bind( function() {
					this._start();
				}, this));
			}
			else
			{
				this._start();	
			}
			
		},
		
		_start: function()
		{
			// Render all views
			for( var i=0; i<this.views.length; i++ )
				this.views[i].render();
			
			// Set default state
			this.changeState( this.state || 'home' );
			
			// dispatch
			if( this.appReady )
				this.appReady.call(this, []);
		},
		
		changeState: function( state )
		{
			//if same state => no good
			if (state == this.state && this.lastState != null)
				return;
				
			this.lastState = this.state;
			this.state = state;
			
			// Render all views
			for( var i=0; i<this.views.length; i++ )
			{
				var view = this.views[i];
				
				if( view.hideOnStates.indexOf( this.state ) != -1 )
					this.hideView( view );
				else
					this.showView( view );
			}
			
			this.sendMessage('stateChanged', {currentState: this.state, lastState: this.lastState});
		},
		
		hideView: function( view )
		{
			GA.addClass( view.container, 'hide-view');
			this.sendMessage('hideView', view.container);
		},
		
		showView: function( view )
		{
			GA.removeClass( view.container, 'hide-view');
			this.sendMessage('showView', view.container);
		},
		
		onChangeState: function( msg )
		{
			this.changeState( msg.state );
		},
		
		onReverseState: function( msg )
		{
			this.changeState( this.lastState );
		}
		
	});	

	
	// Publish
	GA.App = GeoAdsApp;
	
	GA.App.States = {};
	GA.App.States.MAP = 'map';
	GA.App.States.INFO = 'info';
	
}(GA));

