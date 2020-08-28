var gulp = require('gulp')
  , nodemon = require('gulp-nodemon')
  , jshint = require('gulp-jshint')

  gulp.task('lint', function() {
    return gulp.src(['./**/*.js'])
      .pipe(eslint())
      .pipe(eslint.format())
``      .pipe(eslint.failAfterError());
  });

  gulp.task('default', function() {
    const nodemonConfig = {
      // exec: 'node-inspector & node --debug',
      script: './app.js',
      ext: 'js',
      tasks: ['lint']
    };
    nodemon(nodemonConfig)
      .on('restart', function() {
        console.log('restarted!');
      });
  });
