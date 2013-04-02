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
			this.ajax = GA.AjaxManager.getInstance();
			
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