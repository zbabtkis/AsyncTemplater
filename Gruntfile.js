module.exports = function(grunt) {
	grunt.initConfig({
		mocha: {
			test: {
				src: ['test/*.html'],
				options: {
					run: true
				}
			}
		},

		watch: {
			all: {
				files: ['lib/*', 'test/spec/*'],
				tasks: ['mocha']
			}
		}
	});

	grunt.loadNpmTasks('grunt-mocha');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('test', ['mocha']);
};

