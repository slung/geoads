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