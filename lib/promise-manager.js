;(function() {
	var root = this;

	var PromiseTypes = {
		// Holds object type handlers.
		_types: {},

		// Gets handler for setting data based on object type.
		getTypeHandler: function(object) {
			var oType = Object.prototype.toString.call(object);

			if(this._types[oType]) {
				return this._types[oType].call({}, object);
			}
		},

		_getUpperCaseType: function(type) {
			return type.charAt(0).toUpperCase() + type.substring(1);
		},

		// Sets handler for setting data for object type.
		addTypeHandler: function(type, handler) {
			var oType = '[object ' + this._getUpperCaseType(type) + ']';
			this._types[oType] = handler;
		},
		
		basicHandler: function(o) {
			return function(callback) {
				callback(o);
			};
		}
	};

	PromiseTypes.addTypeHandler('promise', function(o) {
		return function(callback) {
			o.then(callback);	
		};
	});
	PromiseTypes.addTypeHandler('function', function(o) {
		return function(callback) {
			return o(callback);
		};
	});

	PromiseTypes.addTypeHandler('number', PromiseTypes.basicHandler);
	PromiseTypes.addTypeHandler('string', PromiseTypes.basicHandler);
	PromiseTypes.addTypeHandler('object', PromiseTypes.basicHandler);

	var PromiseManager = function() {
		this.promises = [];
 		// @TODO Should listen for promise changes, manager data injection on Block. 
		return {
			accept: function(value) {
				var method = PromiseTypes.getTypeHandler(value)

				return {
					with: function(callback) {
						method(callback);
					}
				}
			}
		};
	}();

	root.PromiseManager = PromiseManager;
}).call(this);

