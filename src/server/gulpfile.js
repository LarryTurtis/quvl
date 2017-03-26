var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");

gulp.task("default", function() {
    gulp.start('transpile');
    gulp.start('copy');
    gulp.watch('src/**/*', ['transpile', 'copy']);
});

gulp.task('transpile', function() {
    return gulp.src("src/**/*.js")
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat("main.js"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("public"));
});

gulp.task('copy', function() {
    gulp.src("node_modules/tinymce/tinymce.min.js")
        .pipe(gulp.dest("public"));
    gulp.src("node_modules/jquery/dist/jquery.min.js")
        .pipe(gulp.dest("public"));
    gulp.src("node_modules/tinymce/skins/**/*")
        .pipe(gulp.dest("public/skins"));
    gulp.src("node_modules/tinymce/themes/**/*")
        .pipe(gulp.dest("public/themes"));
    gulp.src("src/styles/**/*")
        .pipe(gulp.dest("public/styles"));
    gulp.src("src/bootstrap-tagsinput.js")
        .pipe(gulp.dest("public"));
})