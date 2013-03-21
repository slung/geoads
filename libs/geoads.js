(function( GA )
{
	/**
	 * Ajax class is used to make XHR requests.
	 * 
	 * @class Ajax
	 * @module core
	 * @version 0.1.0
	 * 
	 * @constructor Ajax
	 */
	function Ajax()
	{
		//this.createXhr();
	}
	
	Ajax.prototype = {
			
		/**
		 * Creates a new XHR request
		 * depending on the browser. 
		 * 
		 * @method createXhr
		 * @param options {Object}
		 */
		createXhr: function( options )
		{
			if( options )
				this.options = options;
			
			var ajax = this;
			
			//Don't create XDR object if the url points to the origin
			//IE doesn't like to this
			if( this.isIE() && !this.isSameWithOrigin(this.url) )
			{
				if( this.xhr )
					this.xhr.abort();
				
				this.xhr = new XDomainRequest();
				this.xhr.onload = function(){ ajax.onComplete(); };
			    this.xhr.onerror = function() { ajax.onError(); };
				
			}
			else
			{
				if (!!window.XMLHttpRequest) 
				{
					this.xhr = new window.XMLHttpRequest(); // Most browsers
				}
				else if (!!window.ActiveXObject) 
				{
					this.xhr = new window.ActiveXObject('Microsoft.XMLHTTP'); // Some IE
				}
			}
			
			if( !this.xhr )
				throw new Error("Unable to create XHR object!");
			
			
			var ajax = this;
			
			this.xhr.onreadystatechange = function () 
			{
				 if (this.readyState === 4) 
				 {
					if (this.status >= 400)
						ajax.onError();
					else
						ajax.onComplete();
				  }
			 };
			 
			 this.xhr.onprogress = function()
			 {
				 
			 };
			 
			 this.xhr.ontimeout = function()
			 {
			 	throw new Error("timeout");
			 };
			 
			 return;
		},
		
		abort: function()
		{
			this.xhr.abort();
		},
		
		/**
		 * Helper function for IE check.
		 * 
		 * @method isIE
		 */
		isIE: function()
		{
			if (navigator.appVersion.indexOf("MSIE") != -1)
				return true;
			
			return false;
		},
		
		/**
		 * Helper function to compare the domains of two URLs
		 * 
		 * @method isSameWithOrigin
		 */
		isSameWithOrigin: function ( url )
		{
			var reg = new RegExp("^http(s)?://.*?(/|$)","i");
			
			var newHost = reg.exec(url)[0];
			var originHost = reg.exec( window.location.href)[0];
			
			
			return  ( originHost === newHost );
		},
		
		/**
		 * Send XHR request to server.
		 * 
		 * @param url
		 * @param options
		 */
		send: function( url, options )
		{
			this.options = options;
			this.url = url;
			
			if( !this.xhr )
				this.createXhr();
			
		    this.xhr.open(options.method, url, true);
		    
		    // IE needs timeout set after xhr.open()
		    this.xhr.timeout = 20000;
		    
		    //Use credentials 
		    if(this.xhr.withCredentials !== undefined)
		    	if( options.withCredentials )
		    		this.xhr.withCredentials  = options.withCredentials;
		    
		    // IE XDR doesn't support request headers
		    if(this.xhr.setRequestHeader && options.headers)
		    	for( var i = 0; i < options.headers.length ; i++ )
		    		this.xhr.setRequestHeader(  options.headers[i].name , options.headers[i].value  );
		    
		    //Data payload
		    if(options.data)
		    	this.xhr.send(options.data);
		    else
		    	this.xhr.send(null);
		   
		    
		    function timeoutHandler() {
		        throw new Error('Loading timeout: ' + url);
		    };
		    
		    return this;
		},
		
		onComplete: function()
		{
			if( this.options.on.success )
				this.options.on.success( this.xhr.responseText );
		},
		
		onError: function()
		{
			if( this.options.on.error )
				this.options.on.error(this.xhr.responseText);
		}	
	};
	
	// Create & add an instance of ajax to GeoAds namespace
	GA.ajax = function( url, confg )
	{
		return new Ajax().send(url, confg);
	};
	
})(GA);


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
		},
		
		geocode: function( address, multipleResults, options )
		{
			var options = options || {};
		    
			var geocoder = new google.maps.Geocoder();
		    
		    geocoder.geocode({ address: address }, GA.bind( function( results, status ) {
		    	
		    	if (status == google.maps.GeocoderStatus.OK) {
		    		
		    		if( multipleResults )
		    		{
		    			var addresses = [];
		    			var index = -1;
		    			
		    			for( var i=0; i<results.length;i++)
		    			{
							index++;
							
							addresses.push({
		    					index: index,
		    					lat: results[i].geometry.location.lat(),
		    					lon: results[i].geometry.location.lng(),
		    					address: results[i].formatted_address,
		    					bounds: [ 	results[i].geometry.viewport.getSouthWest().lat(), 
											results[i].geometry.viewport.getSouthWest().lng(),
											results[i].geometry.viewport.getNorthEast().lat(),
											results[i].geometry.viewport.getNorthEast().lng() ]
		    				});
		    				
		    			}
		    			
		    			if( options.success )
			    			options.success.apply( this, [addresses]);
		    		} 
		    		else
		    		{
		    			var lat = results[0].geometry.location.lat();
			    		var lon = results[0].geometry.location.lng();
			    		var formatted_address = results[0].formatted_address;
			    		var bounds = [ 	results[0].geometry.viewport.getSouthWest().lat(), 
										results[0].geometry.viewport.getSouthWest().lng(),
										results[0].geometry.viewport.getNorthEast().lat(),
										results[0].geometry.viewport.getNorthEast().lng() ];
			    		
			    		if( options.success )
			    			options.success.apply( this, [lat, lon, formatted_address, bounds]);
		    		}
		    	}
		    }, this));
		},
		
		reverseGeocode: function (lat, lng, options)
		{
			var options = options || {};
		    
			var geocoder = new google.maps.Geocoder();
		    var latLng = new google.maps.LatLng(lat, lng);
		    
		    geocoder.geocode({latLng: latLng}, GA.bind( function( results, status ) {
		    	
		    	if (status == google.maps.GeocoderStatus.OK) {
		    		
		    		var address = results[0].formatted_address;
		    		var bounds = results[0].geometry.viewport;
		    		
		    		if( options.success )
		    			options.success.apply( this, [address, bounds]);
		    	}
		    }, this));
		},
		
		/**
		 * Geolocates user and the using lat/lon makes a revers geocoding to
		 * get his address name. 
		 */
		geolocateUser: function()
		{
			if(navigator.geolocation)
			{
				navigator.geolocation.getCurrentPosition( 
					GA.bind( function( pos ) 
					{
						this.reverseGeocode(
					  		pos.coords.latitude, 
					  		pos.coords.longitude, 
					  		{
					  			success: GA.bind( function( address, googleBounds ) {
					  				
					  				this.geocodeBounds = [ 	googleBounds.getSouthWest().lat(), 
															googleBounds.getSouthWest().lng(),
															googleBounds.getNorthEast().lat(),
															googleBounds.getNorthEast().lng() ];
															
									this.geocodeCenter = [pos.coords.latitude, pos.coords.longitude];
									
									var msg = {
										lat: pos.coords.latitude,
										lon: pos.coords.longitude,
										address: address,
										bounds: this.geocodeBounds
									};

									this.fire('userGeocoded', msg);
									
					  			}, this )
					  		}
					  	);
					}, this), 
					GA.bind( function( error ) {
						this.fire('userNotGeocoded');
					}, this)
				);
			}
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
			this.renderContainer = cfg.renderContainer;
			this.hideOnStates = cfg.hideOnStates || [];
			this.formatRenderData = cfg.formatRenderData;
			this.dataManager = GA.DataManager.getInstance();
			this.adManager = GA.AdManager.getInstance();
			this.ajax = GA.ajax;
			
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
		maxRadius: 2000,
		
		events: {
			"#next-step":{
				click: "onNextStepClick"
			}
		},
		
		init: function( cfg ) {
			
			// Call super
			this._parent( cfg );
			
			this.dataManager.on('userGeocoded', GA.bind( this.onUserGeocoded, this));
			
			this.markerInfo = cfg.markerInfo || {
				url: "images/orange-pin.png",
				position: { 
					lat: 45.757284,
					lng: 21.228633
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
			}, 17 ); 
			
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
				
			var markerInfo = {};
			
			markerInfo.url = this.markerInfo.url;
			markerInfo.position = {};
			markerInfo.position.lat = msg.lat;
			markerInfo.position.lng = msg.lon;
			
			this.drawMarker( markerInfo );
		},
		
		onNextStepClick: function( evt )
		{
			//Save the configured ad and move to the Info View
			
			var markerPosition  = this.marker.getPosition();
			var adCoverage = this.adCoverage.getRadius();
			
			//Save
			this.adManager.setAdMapSettings( { lat: markerPosition.lat(), lon: markerPosition.lng() }, adCoverage );
			
			//Switch to Info View
			this.sendMessage("changeState", { state: GA.App.States.INFO });
		},
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
			
			this.dataManager.on('userGeocoded', GA.bind( this.onUserGeocoded, this));
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

(function( GA )
{
	var COMPANY_INPUT_SELECTOR = "#company-name";
	var KEYWORDS_INPUT_SELECTOR = "#keywords";
	
	var InfoView = GA.View.extend({
		
		events: {
			"#publish": {
				click: "onPublishClick"
			},
			"#previous-step": {
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
		
		inputValid: function( inputSelector )
		{
			var inputContent = GA.one(inputSelector, this.container).value;
			
			if ( inputContent.length > 0 )
				return true;
			else
				return false;
		},
		
		/*
		 * Events
		 */
		onPreviousStepClick: function( evt )
		{
			this.sendMessage("changeState", { state: GA.App.States.MAP });
		},
		
		onPublishClick: function( evt )
		{
			var companyName = GA.one( COMPANY_INPUT_SELECTOR, this.container ).value;
			var keywords = GA.one( KEYWORDS_INPUT_SELECTOR, this.container ).value;
			
			if ( this.inputValid( COMPANY_INPUT_SELECTOR ) && this.inputValid( KEYWORDS_INPUT_SELECTOR ) )
			{
				this.adManager.setAdInfoSettings( companyName, keywords );
				this.adManager.saveAd();
			}
				
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

