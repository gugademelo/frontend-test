module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			dist: {
				files: {
					'public/stylesheets/css/style.css' : 'public/stylesheets/sass/style.scss'
				}
			}
		},
		minified : {
		  files: {
		    src: [
		    'public/javascripts/*.js'
		    ],
		    dest: 'public/javascripts/minified/'
		  },
		  options : {
		    sourcemap: true,
		    allinone: false
		  }
		},
		watch: {
			css: {
				files: 'public/stylesheets/sass/*.scss',
				tasks: ['sass']
			},
			js: {
				files: 'public/javascripts/*.js',
				tasks: ['minified']
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['minified', 'sass']);
}