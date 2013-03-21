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