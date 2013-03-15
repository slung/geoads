(function( GA )
{
	var InfoView = GA.View.extend({
		
		events: {
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
		onPreviousStepClick: function( evt )
		{
			this.sendMessage("changeState", { state: GA.App.States.MAP });
		},
	});
	
	// Publish
	GA.InfoView = InfoView;
	
}(GA));