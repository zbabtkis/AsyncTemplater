;(function() {
	var root = this;
	
	var BlockScope = function(defaults) {
		var Scope = function() {
			for(var i in defaults) {
				this[i] = defaults[i];
			}
		};

		Scope.prototype.inherit = function(ParentScope) {
			Scope.prototype = ParentScope;

			return new Scope();
		};

		return new Scope();
	};

	root.BlockScope = BlockScope;
}).call(this);

