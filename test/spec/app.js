describe("BlockScope", function() {
	console.log(window);
	it("Should return object from defaults", function() {
		var scope = new BlockScope({name: "Tony Montana"});

		expect(scope.name).to.be("Tony Montana");
	});
});
