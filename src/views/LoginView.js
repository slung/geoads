(function( GA )
{
	var EMAIL_INPUT_SELECTOR = "#login-email";
	var PASSWORD_INPUT_SELECTOR = "#login-pass";
	var INPUT_ERROR_CLASS = "input-error";
	var LOGIN_ERROR_MSG = "";
	
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
		
		getEmail: function()
		{
			return GA.one( EMAIL_INPUT_SELECTOR, this.container ).value;
		},
		
		getPassword: function()
		{
			return GA.one( PASSWORD_INPUT_SELECTOR, this.container ).value;
		},
		
		validateEmailInput: function()
		{
			var email = this.getEmail();
			
			if ( email == "" )
				return false;
				
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			
			return re.test(email);
		},
		
		validatePasswordInput: function()
		{
			var password = this.getPassword();
			
			if ( password == "" )
				return false;
			
			return true;
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
			var emailValid = false;
			var passwordValid = false;
			
			if ( !this.validateEmailInput() )
			{
				GA.addClass( GA.one( EMAIL_INPUT_SELECTOR, this.container ), INPUT_ERROR_CLASS );
				emailValid = false;				
			}
			else
			{
				GA.removeClass( GA.one( EMAIL_INPUT_SELECTOR, this.container ), INPUT_ERROR_CLASS );
				emailValid = true;
			}
				
			if ( !this.validatePasswordInput() )
			{
				GA.addClass( GA.one( PASSWORD_INPUT_SELECTOR, this.container ), INPUT_ERROR_CLASS );
				passwordValid = false;				
			}
			else
			{
				GA.removeClass( GA.one( PASSWORD_INPUT_SELECTOR, this.container ), INPUT_ERROR_CLASS );
				passwordValid = true;
			}
			
			if ( !emailValid || !passwordValid )
				return;
				
			//Call login system
			GA.Ajax.login( this.getEmail(), this.getPassword(), function(){
				//On success, hide Sign in and Sign up labels on Menu
			}, function(){
				//On error, activate error msg
			} );
		},
		
		onLostPasswordClick: function( evt )
		{
			
		}
		
	});
	
	// Publish
	GA.LoginView = LoginView;
	
}(GA));