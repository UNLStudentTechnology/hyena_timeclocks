module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        updateConfigs: ['pkg'],
        commit: false,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json', 'bower.json'],
        createTag: false,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'upstream',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace: false
      }
    },
    vulcanize: {
      default: {
        options: {
          strip: true
        },
        files: {
          /* Target : Source */
          'dist/unl-components.html': 'components.html'
        },
      },
    }
  });

  grunt.loadNpmTasks('grunt-vulcanize');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bump');

  grunt.registerTask('default', ['vulcanize']);
};