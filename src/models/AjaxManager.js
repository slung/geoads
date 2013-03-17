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

