module.exports = function(grunt) {
	grunt.initConfig({
		mocha: {
			test: {
				src: ['test/*.html'],
				options: {
					run: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-mocha');

	grunt.registerTask('test', ['mocha']);
};

