var gulp        = require("gulp");
var ts          = require("gulp-typescript");
var tsProject   = ts.createProject("tsconfig.json");
var babel       = require('gulp-babel');
var sourcemaps  = require('gulp-sourcemaps');

gulp.task("default", function () {
    return tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject()).js
        .pipe(babel({
			presets: ['@babel/env', '@babel/react']
        }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("dist"));
});