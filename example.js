var p = new Promise(function(resolve, reject) {
    setTimeout(function() {
		resolve([
			{title: "reading"}, 
			{title: "music"},
			{title: "coding"}
		]);
    }, 1000);
});

var FIXTURE = {
    title: "List", 
    interests: p,
    profile: {
        name: "zack",
        age: 23
    }
};

$('#component').append($('#test').text().build(FIXTURE));
