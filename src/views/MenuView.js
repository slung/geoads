(function( GA )
{
	var MenuView = GA.View.extend({
		
		events: {
			".menu-item":{
				click: "onMenuItemClick"
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
		
		onMenuItemClick: function( evt )
		{
			var menuItem = evt.currentTarget.id;
			
			switch ( menuItem )
			{
				case "home":
				{
					this.sendMessage("changeState", {
						state: GA.App.States.HOME
					});
					
					break;
				}
				
				case "map":
				{
					this.sendMessage("changeState", {
						state: GA.App.States.MAP
					});
					
					break;
				}
				
				case "login":
				{
					this.sendMessage("changeState", {
						state: GA.App.States.ACCOUNT
					});
					
					break;
				}
				
				case "tours":
				{
					this.sendMessage("changeState", {
						state: GA.App.States.TOURS
					});
					
					break;
				}
				
				case "contact":
				{
					this.sendMessage("changeState", {
						state: GA.App.States.CONTACT
					});
					
					break;
				}
			}
		}
		
	});
	
	// Publish
	GA.MenuView = MenuView;
	
}(GA));