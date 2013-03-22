(function( GA )
{
	var AccountView = GA.View.extend({
		
		events: {
			"#submit":{
				click: "onLoginSubmitClick"
			},
			"#lost":{
				click: "onLostPasswordClick"
			},
			"#close":{
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
		
		render: function()
		{
			this.container.innerHTML = this.mustache( this.templates.main, {});
			
			return this;
		},
		
		/*
		 * Events
		 */
		
		onCloseAccountClick: function( evt )
		{
			this.sendMessage("reverseState");
		},
		
		onLoginSubmitClick: function( evt )
		{
			
		},
		
		onLostPasswordClick: function( evt )
		{
			
		}
		
	});
	
	// Publish
	GA.AccountView = AccountView;
	
}(GA));