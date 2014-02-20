describe("BlockScope", function() {
	it("Should return object from defaults", function() {
		var scope = new BlockScope({name: "Tony Montana"});

		expect(scope.name).to.equal("Tony Montana");
	});

	it("Should inherit properties from parent", function() {
		var parentScope = new BlockScope({family: "Montana"})
		  , childScope  = new BlockScope({name: "Tony"}).inherit(parentScope);

		expect(childScope.name + ' ' + childScope.family).to.equal("Tony Montana");
	});

	it("Should override parent prototype values", function() {
		var parentScope = new BlockScope({name: "Antonio"})
		  , childScope  = new BlockScope({name: "Tony"}).inherit(parentScope);

		expect(childScope.name).to.equal("Tony");
		expect(childScope.__proto__.name).to.equal("Antonio");
	});
});

describe("PromiseManager", function() {
	it("Should not be instantiatable", function() {
		expect(function() { return new PromiseManager(); }).to.throw(TypeError);
	});

	it("Should take plain value types asynchronously", function() {
		var finalData;
		
		PromiseManager.accept(123).with(function(data) { finalData =data;}); 

		expect(finalData).to.equal(123);
	});

	it("Should take promises asynchronously", function(done) {
		var moviePromise = new Promise(function(resolve, reject) {
			setTimeout(function() {
				resolve({title: "Scarface", year: 1983});
			});
		});

		PromiseManager.accept(moviePromise).with(function(movie) { 
			expect(movie.title).to.equal("Scarface");
			done();
		});
	});

	it("should take functions", function(done) {
		PromiseManager.accept(function(callback) {
			callback("Year: 2014");
		}).with(function(data) {
			expect(data).to.equal("Year: 2014");
			done();
		});
	});
		
});

describe("BlockParser", function() {
	describe("#getBlock()", function() {
		it("Should find reference with @", function() {
			var ref = BlockParser.prototype.getBlock(" @hello ");

			expect(ref.type).to.equal(1);
			expect(ref.ref).to.equal("hello");
		});

		it("Should find for block with @", function() {
			var block = BlockParser.prototype.getBlock("#each @hello\n\t@world\n/each");

			expect(block.type).to.equal(3);
			expect(block.ref).to.equal('hello');
		});

		it("Should find with block with @", function() {
			var block = BlockParser.prototype.getBlock("#with @world\n\t@hello\n/with");

			expect(block.type).to.equal(2);
			expect(block.ref).to.equal("world");
		});

		it("Should find strings even if they are deep in string", function() {
			var block = BlockParser.prototype.getBlock("Wow this is a @size world");

			expect(block.type).to.equal(1);
			expect(block.ref).to.equal("size");
		});

		it("Should return plain node if no expression found", function() {
			var block = BlockParser.prototype.getBlock("within a world");

			expect(block.type).to.equal(0);
			expect(block.ref).to.equal("within a world");
		});
	});

	it("Should parse markup tree into nodes", function() {
		var nodes = BlockParser.parseBlocksFromString("<div><h1>@hello</h1><ul><li>Item1</li><li>Item2</li></ul></div>");

		expect(nodes[0][0].nodeType).toEqual('h1');
		expect(nodes[0][1][0].nodeType).toEqual('li');
	});

	describe("::getExpressions()", function() {
		it("Should find block expressions", function() {
			var doc = BlockParser.createDoc("<h1>@hello</h1>");
			var nodes = BlockParser.createTree(doc);

			expect(nodes.length).to.equal(1);
		});

		it("Should see all adjacent expressions as one block", function() {
			var doc =  BlockParser.createDoc("<h1>@hello @goodbye</h1>");
			var nodes = BlockParser.createTree(doc);

			expect(nodes.length).to.equal(1);
		});

		it("Should concat all expression blocks into node list", function() {
			var doc = BlockParser.createDoc("<h1>@hello <a href='#'>world</a> @goodbye</h1>");
			var nodes = BlockParser.createTree(doc);

			expect(nodes.length).to.equal(3);
		});
	});

});
