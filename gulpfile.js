//plug-in
var gulp = require('gulp');

var pug = require('gulp-pug');
 
gulp.task('pug', () => {
  return gulp.src(['./*.pug', '!./_*.pug'])
  .pipe(pug({
    pretty: true
  }))
  .pipe(gulp.dest('./html/'));
});

gulp.task('default',['pug'])