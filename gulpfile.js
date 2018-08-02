var gulp        = require("gulp");
var ts          = require("gulp-typescript");
var tsProject   = ts.createProject("tsconfig.json");
var babel       = require('gulp-babel');
var sourcemaps  = require('gulp-sourcemaps');

gulp.task("default", function () {

    let compiledTs = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject());

    return [
        compiledTs.js
        .pipe(babel({
			presets: ['@babel/env', '@babel/react']
        }))
        .pipe(sourcemaps.write("./maps"))
        .pipe(gulp.dest("dist")),

        compiledTs.dts.pipe(gulp.dest("dist"))
    ];
});