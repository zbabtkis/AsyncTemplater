;(function() {
	var root = this;

	var WebSocketAdapter = function(dataEvent, socket) {
		root.Adapter.call(this);
		// @TODO should take WS and data event and respond with {response: data, promise: new Promise} 
	};

	WebSocketAdapter.prototype = new root.Adapter();

	root.WebSocketAdapter = WebSocketAdapter;
}).call(this);
