;(function() {
	var root = this;

	var matchMethod = /#(.*)\s/
	  , matchBlock  = /#(.+)\s[\S\s]+\/(.+)/mg;

	var BlockParser = function(block) {
		this._string = block;
		this._children = {};

		this.block  = this.getBlock();
	};	

	/**
 	 * Define instance methods
	 */

	BlockParser.prototype.getMethod = function() {
		// @TODO match method using matchMethod RegExp.
	};

	BlockParser.prototype.getBlock = function() {
		// @TODO return parse tree of block (can create new BlockParsers).
	};

	BlockParser.prototype.isNested = function(str) {
		return str.match(matchBlock);
	};


	/**
	 * Define class methods
	 */

	BlockParser.parseBlocksFromString = function(str) {
		// @TODO split string into blocks and return new BlockParser instance
	};

	root.BlockParser = BlockParser;
}).call(this);
