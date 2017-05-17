module.exports = function(grunt){
//загрузка плагинов
[
'grunt-mocha-test',
'grunt-link-checker',
'grunt-exec',
].forEach(function(task){
grunt.loadNpmTasks(task);
});
//настройка плагинов
grunt.initConfig({
  mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          ui: 'tdd',
          //captureFile: 'results.txt', // Optionally capture the reporter output to a file
          quiet: false, // Optionally suppress output to standard out (defaults to false)
          clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false)
          //noFail: false // Optionally set to not fail on failed tests (will still fail on other errors)
        },
        src: ['qa/tests-*.js']
      }
    },
// cafemocha: {
//   all: { src: 'qa/tests-*.js', options: { ui: 'tdd' }, }
// },
// jshint: {
// app: ['meadowlark.js', 'public/js/**/*.js','lib/**/*.js'],
// qa: ['Gruntfile.js', 'public/qa/**/*.js', 'qa/**/*.js'],
// },
exec: {
linkchecker:
{ cmd: 'linkchecker http://localhost:3000' }
},
});

grunt.registerTask('default', ['cafemocha','jshint','exec']);
};
