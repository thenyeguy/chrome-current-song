var del = require("del");
var gulp = require("gulp");
var fs = require("fs");
var manifest = require("./manifest");
var sourcemaps = require("gulp-sourcemaps");
var ts = require("gulp-typescript");

var globOptions = {
    base: "src/",
    tsToJs: true,
};

var tsProject = ts.createProject({
    noEmitOnError: true,
    noResolve: true,
    target: "ES6",
});

gulp.task("manifest", function() {
    return gulp.src("manifest.json")
        .pipe(manifest.background([
            "src/third_party/jquery-3.1.0.slim.js",
            "src/third_party/md5.js",
            "src/core/**.ts",
            "src/background/main.ts",
        ], globOptions))
        .pipe(manifest.content("src/adapters/adapters.json", [
            "src/third_party/jquery-3.1.0.slim.js",
            "src/adapters/adapter.ts",
            "src/adapters/listener.ts",
            "src/core/types.ts",
            "src/core/utils.ts",
        ], globOptions))
        .pipe(manifest.options("options/options.html"))
        .pipe(manifest.popup("popup/popup.html"))
        .pipe(gulp.dest("target/"));
});

gulp.task("options", function() {
    return gulp.src(["src/options/*.html", "src/options/*.css"],
            globOptions)
        .pipe(gulp.dest("target/"));
});

gulp.task("popup", function() {
    return gulp.src(["src/popup/*.html", "src/popup/*.css"],
            globOptions)
        .pipe(gulp.dest("target/"));
});

gulp.task("third_party", function() {
    return gulp.src("src/third_party/**", globOptions)
        .pipe(gulp.dest("target/"));
});

gulp.task("scripts", function() {
    return gulp.src("src/**/*.ts", globOptions)
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("target/"));
});

gulp.task("static", function() {
    return gulp.src("src/static/**", globOptions)
        .pipe(gulp.dest("target/"));
});

gulp.task("build", ["manifest", "options", "popup", "scripts", "static", "third_party"]);

gulp.task("clean", function() {
    del.sync("target/");
});

gulp.task("default", ["build"]);

gulp.task("watch", ["build"], function() {
    gulp.watch([
        "manifest.js",
        "manifest.json",
        "gulpfile.js",
        "src/**",
    ], ["manifest"]);
    gulp.watch("src/options/**", ["options"]);
    gulp.watch("src/popup/**", ["popup"]);
    gulp.watch("src/**/*.ts", ["scripts"]);
    gulp.watch("src/third_party/**", ["third_party"]);
});
