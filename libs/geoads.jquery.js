var GA = GA || {};

GA.Settings = {
	
};

GA.useEvents = function( className )
{
	GA.mix( M.EventDispatcher, className  );
};



/**
 * Bind function context.
 * 
 * @method bind
 * @param fn
 * @param c
 */
GA.bind = function(fn, c) 
{
    return function() {
        return fn.apply(c || fn, arguments);
    };
};

/**
 * Extend a class
 * 
 * @param subClass
 * @param superClass
 */
GA.mix = function(source, dest) {

	var tmp = dest.prototype;
	
	dest.prototype = new source();
	dest.prototype.constructor = dest;
	
	for( var key in tmp )
		dest.prototype[key] = tmp[key];
};

GA.one = function( selector, parent )
{
	var result = jQuery( selector );

	if( parent )	
		result = jQuery( parent ).find( selector );
		
	return result[0];
};

GA.all = function( selector, parent )
{
	var result = jQuery( selector );

	if( parent )	
		result = jQuery( parent ).find( selector );
		
	return result;
};

GA.append = function( element, content )
{
	return jQuery( element ).append( content );
};

GA.mask = function( element, text )
{
	return jQuery( element ).mask(text);
};

GA.unmask = function( element )
{
	return jQuery( element ).unmask();
};

GA.getSelected = function( element )
{
	return jQuery(element).find(":selected")[0]
}

GA.isMasked = function( element )
{
	return jQuery( element ).isMasked();
};

GA.wrap = function( element, content )
{
	return jQuery( element ).wrap( content );
};

GA.trimString = function( string, count )
{
	return string.substring(0, count) + "...";
};

// Merge Arrays
GA.merge = function( first, second )
{
	return jQuery.merge( first, second );
};

// Merge objects
GA.extend = function( first, second )
{
	return jQuery.extend( first, second );
};

GA.ie = function()
{
	var result = 0;
	
	if( jQuery.browser.msie == true )
		result = jQuery.browser.version.slice(0, 1);
	
	return result;
};

GA.delegate = function( parent, selector, eventType, handler )
{
	return jQuery(parent).delegate( selector, eventType, handler );
};

GA.on = function( selector, eventType, handler )
{
	return jQuery(selector).on( eventType, handler );
};

GA.css = function( container, property, value )
{
	return  jQuery(container).css( property, value );
};

GA.addClass = function( element, className )
{
	jQuery(element).addClass(className);
};
		
GA.removeClass = function( element, className)
{
	jQuery(element).removeClass(className);
};

GA.hasClass = function( element, className )
{
	return jQuery(element).hasClass(className);
};

GA.decodeHTML = function( encodedString )
{
	return jQuery("<div/>").html(encodedString).text();
};

GA.queryStringParameter = function( name ) {

    var match = RegExp('[?&]' + name + '=([^&]*)')
                    .exec(window.location.search);

    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
};

/*
 * Share Store locator related data via Facebook, Twitter and Email
 * 
 * shareTarget: POINT or ITINERARY
 */
GA.share = function( shareTarget, shareEngine, options ){
	
	options = options || {};
	var url = "";
	
	var language = "";
	
	if (GA.Settings.language)
		language = "&LANGUAGE=" + GA.Settings.language;
	
	switch ( shareTarget.toLowerCase() )
	{
		case 'point':
		{
			options.sharedField = options.sharedField || "id";
			options.sharedValue = options.sharedValue || options.point.pointId;
			
			url = GA.Settings.shareUrl + 
				  "mapurl.html?key=" + GA.Settings.key +
				  language + 
				  "&customer=" + GA.Settings.customer +
				  "&tableName=" + GA.Settings.tableName;
				  
			url = encodeURIComponent( url + "&" + options.sharedField + "=" + options.sharedValue );
			
			break;
		}
		
		case 'itinerary':
		{
			var itineraryParameters = "&startAddress=" + options.itinerary.startAddress +
									  "&endAddress=" + options.itinerary.endAddress +
									  "&endAddressString=" + options.itinerary.endAddressString +
									  "&travelMode=" + options.itinerary.travelMode;
									  
			url = GA.Settings.shareUrl + 
				  "itineraryurl.html?key=" + GA.Settings.key +
				  language + 
				  "&customer=" + GA.Settings.customer;
				  
			url = encodeURIComponent( url + itineraryParameters );
			
			break;
		}
	}
	

	
	switch (shareEngine.toLowerCase())
	{
		case 'facebook':
		{
			url = decodeURIComponent( url );
			url = encodeURI( url );  
			
			this.dataManager = GA.DataManager.getInstance();
			
			this.dataManager.shortenUrl( url, function( data ){
				
				var windowWidth = "660";
				var windowHeight = "280";
			    var centerWidth = (window.screen.width - windowWidth) / 2;
	    		var centerHeight = (window.screen.height - windowHeight) / 2;
				
				window.open(
					"http://www.facebook.com/sharer/sharer.php?u=" + data.id + "&t=test",
					null,
					"resizable=0,width=" + windowWidth + 
					",height=" + windowHeight +
					",left=" + centerWidth + 
					",top=" + centerHeight
				);
			} );
			
			break;
		}
		
		case 'twitter':
		{
			url = decodeURIComponent( url );
			url = encodeURI( url );  
			
			this.dataManager = GA.DataManager.getInstance();
			
			this.dataManager.shortenUrl( url, function( data ){
				
				var windowWidth = "660";
				var windowHeight = "280";
			    var centerWidth = (window.screen.width - windowWidth) / 2;
	    		var centerHeight = (window.screen.height - windowHeight) / 2;
				
				window.open(
					'https://twitter.com/share?url=' + data.id, 
					null, 
					"resizable=yes,width=" + windowWidth + 
					",height=" + windowHeight +
					",left=" + centerWidth + 
					",top=" + centerHeight
				);
			} );
			
			break;
		}
		
		case 'mail':
		{
			options.mail = options.mail || {};
			
			var windowWidth = options.mail.windowWidth || "355";
			var windowHeight = options.mail.windowHeight || "320";
		    var centerWidth = (window.screen.width - windowWidth) / 2;
    		var centerHeight = (window.screen.height - windowHeight) / 2;
			
			var language = "";
			
			if (GA.Settings.language)
				language = "&LANGUAGE=" + GA.Settings.language;
			
			var emailUrl = 	'email.html?target=' + shareTarget + 
							language +
							'&url=' + url +
							'&name=' + options.mail.name + 
							'&address=' + options.mail.address +
							'&zip=' + options.mail.zip + 
							'&city=' + options.mail.city
			
			window.open(emailUrl, 
						null, 
						"resizable=0,width=" + windowWidth + 
						",height=" + windowHeight +
						",left=" + centerWidth + 
						",top=" + centerHeight
			);
			
			break;
		}
	}
};

GA.scrollTop = function( container, parent, elementToScrollTo, offset )
{
	jQuery(parent).scrollTop(0);
	
	jQuery(parent).animate(
		{ 
			scrollTop: jQuery(elementToScrollTo).offset().top - jQuery(container).offset().top - offset
		 }, 
		 { 
		 	duration: 300 
		 } );
};

GA.toggle = function ( selector, duration, easing, callback )
{
	jQuery(selector).toggle( duration, easing, callback );
};

GA.fadeToggle = function ( selector, duration, callback )
{
	jQuery(selector).fadeToggle( duration, callback );
};

GA.height = function ( selector, height )
{
	jQuery(selector).height( height );
};

GA.width = function ( selector, width )
{
	jQuery(selector).width( width );
};

GA.isString = function(input)
{
    return typeof(input)=='string';
};

GA.stringToBoolean = function(string){
	if (GA.isString(string))
	{
        switch(string.toLowerCase()){
                case "true": case "yes": case "1": return true;
                case "false": case "no": case "0": case null: return false;
                default: return Boolean(string);
        }
     }
     
     return string;
};

GA.NumberFormat = function( nStr, thousandSeparator, decimals, decimalSeparator )
{
	if( !decimals)
		nStr = Math.ceil(Number(nStr));
	else
		nStr = Number(nStr).toFixed( decimals );
	
	if (!thousandSeparator)
		thousandSeparator = " ";
		
	if (!decimalSeparator)
		decimalSeparator = "";
		
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? decimalSeparator + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + thousandSeparator + '$2');
	}
	
	return x1 + x2;
}

GA.openFancyBox = function( urls )
{
	//do not open fancy box if nothing to open
	if ( urls.length > 0 )
		$.fancybox.open(urls);
}

if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}

