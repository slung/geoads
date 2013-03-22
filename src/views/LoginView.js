(function( GA )
{
	var LoginView = GA.View.extend({
		
		events: {
			"#loginBtn":{
				click: "onLoginSubmitClick"
			},
			"#lostBtn":{
				click: "onLostPasswordClick"
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
		
		onLoginSubmitClick: function( evt )
		{
			
		},
		
		onLostPasswordClick: function( evt )
		{
			
		}
		
	});
	
	// Publish
	GA.LoginView = LoginView;
	
}(GA));