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
	GA.StepsView = StepsView;
	
}(GA));