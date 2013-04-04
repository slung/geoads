(function( GA )
{
	//Selectors
	var EMAIL_INPUT_SELECTOR = "#login-email";
	var PASSWORD_INPUT_SELECTOR = "#login-pass";
	
	//Classes
	var INPUT_ERROR_CLASS = "input-error";
	
	//Messages
	var INVALID_EMAIL_ERROR_MSG = "The e-mail is not valid!";
	var INVALID_PASSWORD_ERROR_MSG = "The password is not valid!";
	var INVALID_LOGIN_ERROR_MSG = "Sorry, your email or password are not valid!"
	
	var LoginView = GA.View.extend({
		
		events: {
			"#loginBtn":{
				click: "onLoginSubmitClick"
			},
			"#lostBtn":{
				click: "onLostPasswordClick"
			},
			".login-icon":{
				click: "onHomeClick"
			},
			"#registerBtn":{
				click: "onRegisterClick"
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
			this.container.innerHTML = this.mustache( this.templates.main, {
				errorMessage: this.errorMessage
			});
			
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
		
		/*
		 * Messages
		 */
		
		
		/*
		 * Events
		 */
		
		onLoginSubmitClick: function( evt )
		{
			if ( !GA.validateEmailInput( this.getEmail() ) )
			{
				this.errorMessage = INVALID_EMAIL_ERROR_MSG;
				
				this.render();
				
				GA.addClass( GA.one( EMAIL_INPUT_SELECTOR, this.container ), INPUT_ERROR_CLASS );
				return;			
			}
			else
			{
				GA.removeClass( GA.one( EMAIL_INPUT_SELECTOR, this.container ), INPUT_ERROR_CLASS );
			}
				
			if ( !GA.validatePasswordInput( this.getPassword() ) )
			{
				this.errorMessage = INVALID_PASSWORD_ERROR_MSG;
				
				this.render();
				
				GA.addClass( GA.one( PASSWORD_INPUT_SELECTOR, this.container ), INPUT_ERROR_CLASS );
				return;
			}
			else
			{
				GA.removeClass( GA.one( PASSWORD_INPUT_SELECTOR, this.container ), INPUT_ERROR_CLASS );
			}
			
			//Call login system
			this.ajax.login( this.getEmail(), this.getPassword(), GA.bind(function()
			{
				window.location.href = "home";
			}, this), GA.bind(function(){
				this.errorMessage = INVALID_LOGIN_ERROR_MSG;
				this.render();
				
				GA.addClass( GA.one( EMAIL_INPUT_SELECTOR, this.container ), INPUT_ERROR_CLASS );
				GA.addClass( GA.one( PASSWORD_INPUT_SELECTOR, this.container ), INPUT_ERROR_CLASS );
			}, this) );
		},
		
		onHomeClick: function( evt )
		{
			//Redirect to Home page and change state
			window.location.href = "ads";
			this.sendMessage("changeState", { state: GA.App.States.HOME });
		},
		
		onRegisterClick: function( evt )
		{
			//Redirect to Register page and change state
			window.location.href = "register";
			this.sendMessage("changeState", { state: GA.App.States.REGISTER });
		}
		
	});
	
	// Publish
	GA.LoginView = LoginView;
	
}(GA));