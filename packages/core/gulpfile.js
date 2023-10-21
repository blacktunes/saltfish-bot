const gulp = require('gulp')

gulp.task('copy', () => {
  return gulp.src(['src/**/*.!(ts)']).pipe(gulp.dest('dist'))
})
