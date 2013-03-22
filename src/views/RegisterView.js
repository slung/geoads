(function( GA )
{
	var RegisterView = GA.View.extend({
		
		events: {
			"#registerBtn":{
				click: "onRegisterSubmitClick"
			},
			"#closeBtn":{
				click: "onCloseAccountClick"
			}
		},
		
		init: function( cfg ) {
			
			// Call super
			this._parent( cfg );
		},
		
		register: function()
		{
		},
		
		render: function( template )
		{
			this.container.innerHTML = this.mustache( this.templates.main, {});
			
			return this;
		},
		
		/*
		 * Messages
		 */
		
		
		/*
		 * Events
		 */
		
		onCloseAccountClick: function( evt )
		{
			this.sendMessage("changeState", { state: GA.App.States.HOME });
		},
		
		onRegisterSubmitClick: function( evt )
		{
			
		}
		
	});
	
	// Publish
	GA.RegisterView = RegisterView;
	
}(GA));