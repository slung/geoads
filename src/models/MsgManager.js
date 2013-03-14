(function( GA)
{
	var MsgManager = GA.EventManager.extend({
		
		init: function()
		{
			this._parent();
		},
		
		onMessage: function( msgName, fn )
		{
			GA.dispatcher.on( msgName, GA.bind( fn, this ) );
		},
		
		sendMessage: function( msgName, data )
		{
			GA.dispatcher.fire( msgName, data );
		}
		
	});	

	
	// Publish
	GA.MsgManager = MsgManager;
	
	// Make one instance
	GA.dispatcher = new MsgManager();
	
}(GA));