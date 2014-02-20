;(function() {
	var root = this;

	var matchMethod = /#(.*)\s/
	  , matchEach   = /^[\s]*#each\s@(.+)$/
	  , matchEachE  = /^[\s]*/each$/
	  , matchWith   = /^[\s]*#with\s@(.+)$/
	  , matchWithE  = /^[\s]*/with$/
	  , matchRef    = /^[\S\s]*@(.+)[\s]*$/
	  , matchBlock  = /(?:^[\S\s]+|^)(@|#each\s|#with\s)([^\s]*)(?:(\s+|$)|([\S\s]+\/(each|with)))/

	var BlockParser = function(node) {
		console.log(node);
		this.block = blocks = this.getMethod(node.exp);
		return blocks;
	};

	Types = {
		PLAIN: 0,
		REFERENCE: 1,
		WITH: 2,
		EACH: 3
	};

	/**
 	 * Define instance methods
	 */

	BlockParser.prototype.getMethod = function() {
		// @TODO match method using matchMethod RegExp.

	};

	BlockParser.prototype.getBlock = function(str) {
		// @TODO return parse tree of block (can create new BlockParsers).
		if(str.search(matchEach) === 0) {
			return {
				type: Types.EACH,
				ref: str.match(matchEach)[1]
			};
		} else if(str.search(matchWith) === 0) {
			return {
				type: Types.WITH,
				ref: str.match(matchWith)[1]
			}
		} else if(str.match(matchRef)) {
			return {
				type: Types.REFERENCE,
				ref: str.match(matchRef)[1]
			};
		}


		return {
			type: Types.PLAIN,
			ref: str 
		};
	};

	BlockParser.prototype.isNest = function(str) {
		return str.match(matchBlock);
	};


	/**
	 * Define class methods
	 */

	BlockParser.createTree = function(doc) {
		// @TODO split string into blocks and return new BlockParser instance
		var nodeList = [].reduce.call(doc, function(last, el) {
			return last.concat(BlockParser._getExpressions(el));
		}, []);
		
		return nodeList;
	};

	BlockParser.createDoc = function(str) {
		return new DOMParser().parseFromString(str, 'text/html').body.children;
	};

	BlockParser._getExpressions = function(el) {
		var nodes = [];

		[].forEach.call(el.childNodes, function(n) { 
			var node;

			if(n.nodeType === 3) {
				node = n.nodeValue.split(matchBlock);
			
				nodes.push(new BlockParser({
					exp: node, 
					el: el
				}));
			} else {
				nodes = nodes.concat(BlockParser._getExpressions(n));
			}
		});

		return nodes;
	};

	root.BlockParser = BlockParser;
}).call(this);
