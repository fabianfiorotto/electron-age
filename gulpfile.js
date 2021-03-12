const gulp = require('gulp');
const sass = require('gulp-sass');

gulp.task('styles-home', () => {
    return gulp.src('app/styles.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./app/'));
});


gulp.task('styles', () => {
    return gulp.src('app/ui/styles.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./app/local_game'));
});

gulp.task('default', gulp.series(['styles', 'styles-home']));
