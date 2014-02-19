;(function() {
	var root = this;

	var PromiseManager = function() {
		this.promises = [];
 		// @TODO Should listen for promise changes, manager data injection on Block. 
	}();

	root.PromiseManager = PromiseManager;
}).call(this);

