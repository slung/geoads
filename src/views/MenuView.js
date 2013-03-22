(function( GA )
{
	var HOME_MENU_ITEM_SELECTOR = "#home-item";
	var LOGIN_MENU_ITEM_SELECTOR = "#login-item";
	var REGISTER_MENU_ITEM_SELECTOR = "#register-item";
	var PUBLISH_MENU_ITEM_SELECTOR = "#publish-item";
	var ABOUT_MENU_ITEM_SELECTOR = "#about-item";
	
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
			this.onMessage("stateChanged", this.onStateChanged);
		},
		
		render: function()
		{
			this.container.innerHTML = this.mustache( this.templates.main, {});
			
			return this;
		},
		
		/*
		 * Messages
		 */
		
		onStateChanged: function( msg )
		{
			//Make Sign in, Sign up, Publish and About menu items visible if in HOME state, else hide
			if ( msg.currentState == GA.App.States.HOME )
			{
				GA.removeClass(GA.one(LOGIN_MENU_ITEM_SELECTOR, this.container), "hide");
				GA.removeClass(GA.one(REGISTER_MENU_ITEM_SELECTOR, this.container), "hide");
				GA.removeClass(GA.one(PUBLISH_MENU_ITEM_SELECTOR, this.container), "hide");
				GA.removeClass(GA.one(ABOUT_MENU_ITEM_SELECTOR, this.container), "hide");
			}
			else
			{
				GA.addClass(GA.one(LOGIN_MENU_ITEM_SELECTOR, this.container), "hide");
				GA.addClass(GA.one(REGISTER_MENU_ITEM_SELECTOR, this.container), "hide");
				GA.addClass(GA.one(PUBLISH_MENU_ITEM_SELECTOR, this.container), "hide");
				GA.addClass(GA.one(ABOUT_MENU_ITEM_SELECTOR, this.container), "hide");
			}
		},
		
		/*
		 * Events
		 */
		
		onMenuItemClick: function( evt )
		{
			var menuItem = evt.currentTarget.id;
			
			switch ( menuItem )
			{
				case "home-item":
				{
					this.sendMessage("changeState", {
						state: GA.App.States.HOME
					});
					
					break;
				}
				
				case "publish-item":
				{
					this.sendMessage("changeState", {
						state: GA.App.States.MAP
					});
					
					this.sendMessage("resizeMap");
					
					break;
				}
				
				case "login-item":
				{
					this.sendMessage("changeState", {
						state: GA.App.States.LOGIN
					});
					
					break;
				}
				
				case "register-item":
				{
					this.sendMessage("changeState", {
						state: GA.App.States.REGISTER
					});
					
					break;
				}
			}
		}
		
	});
	
	// Publish
	GA.MenuView = MenuView;
	
}(GA));