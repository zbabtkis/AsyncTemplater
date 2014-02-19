var TypeHandler = function() {
	var handles = {};

	return {
		get: function(type, ctx) {
			var args = [].slice.call(arguments, 2);
			return handles[type].apply(ctx, args);
		},

		handle: function(type, callback) {
			handles[type] = callback;
		}
	};
}();

var PromiseRegistry = function() {
	var handles = {};

	return {
		register: function(key, promise) {
			handles[key] = promise;
		},
		get: function(key) {
			return handles[key];
		}
	};
}();

String.prototype.build = function(obj, NS) {
    var html = this;
    
    var refs = /(@[^\s<]+)/g
      , it   = /#each\s.+\n(.*?)\n(\s+\/|\/)each/gm
      , wi   = /#with\s.+\n(.*?)\n(\s+\/|\/)with/gm
      , MARKER = ";MARK_FOR_CHANGE;";
    
    function _getBlock(wrap, item) {
        var lookup = new RegExp("#" + wrap + " (.+)\n");
        var ctx = lookup.exec(item)[1]
          , segment = item.split(/\n/g).slice(1, -1).join('/n');
                
        return {
            context: ctx,
            block: segment
        };
    }

    function doWith(item) {
        var block = _getBlock('with', item);
        
        return block.block.build(obj[block.context], block.context, doWith);
    }
           
    function doFor(item) {
        var block = _getBlock('each', item)
          , ctx   = obj[block.context]
		  , type  = Object.prototype.toString.call(ctx)
          , str = "";

		return TypeHandler.get(type, ctx, block, doFor, item);
    }

	TypeHandler.handle('[object Array]', function(block, method, item) {
		var str = "";

		this.forEach(function(vals, i) {
			str+= block.block.build(vals, [block.context,i].join('.'));
		});

		return str;
	});

	TypeHandler.handle('[object Promise]', function(block, method, item) {
		var PROM_KEY = [NS,block.context].join('.')
		  , _this    = this;

		// Return new promise that will resolve with string value. 
		PromiseRegistry.register(PROM_KEY, new Promise(function(resolve, reject) {
			_this.then(function(data) {

				// Retry parsing.
				obj[block.context] = data;
				resolve(method(item));
			});		
		}));

		return MARKER + PROM_KEY;
	});
		
    
    function doVars(item) {
        var key = item.slice(1)
          , val = obj[key];

		return val || "";
    }

    html = html.replace(it, doFor);
    html = html.replace(wi, doWith);
    html = html.replace(refs, doVars);
    
    if(!NS) {

		// Parse entire HTML string to form traversable document tree.
		var fragment = new DOMParser().parseFromString(html, 'text/html');

		// Check all elements in tree for parsable data
        [].forEach.call(fragment.body.children, function check(el) {
			var holder = el.parentNode.parentNode;

			// If current element is not a text node it should be searched.
            if(el.nodeType !== 3 && el.childNodes && el.childNodes.length) {
				[].forEach.call(el.childNodes, check);
            } else if(el.nodeValue && el.nodeValue.match(MARKER)) {
				el.parentNode.remove();

				// Get bound valye key from element text and remove placeholder. 
                el.parentNode.dataset.bind = el.nodeValue.replace(MARKER, "").trim();

				// Traverse data object for bound value and respond to promise.
                PromiseRegistry.get(el.parentNode.dataset.bind)
                    .then(function(data) {
						var sub = new DOMParser().parseFromString(data, 'text/html');
						[].forEach.call(sub.body.childNodes, function(node) {
							holder.appendChild(node);
						});
					});
            }
        });

    }

    return NS ? html : fragment.body;
};

var p = new Promise(function(resolve, reject) {
    setTimeout(function() {
		resolve([
			{title: "hello"}, 
			{title: "goodbye"}
		]);
    }, 1000);
});

var FIXTURE = {
    title: "List", 
    items: p,
    profile: {
        name: "zack",
        age: 23
    }
};

$('#component').append($('#test').text().build(FIXTURE));
