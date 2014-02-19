;(function() {
	var root = this;
	
	var BlockScope = function(ParentScope) {
		var Scope = function(defaults) {
			for(var i in defaults) {
				this[i] = defaults[i];
			}
		};

		Scope.prototype = ParentScope

		return {
			create: fucntion(defaults) {
				return new Scope(defaults);
			}
		};
	};

	root.BlockScope = BlockScope;
}).call(this);

