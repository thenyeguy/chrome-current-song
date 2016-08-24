var del = require("del");
var gulp = require("gulp");
var manifest = require("./manifest");
var sourcemaps = require("gulp-sourcemaps");
var ts = require("gulp-typescript");

var globOptions = {
    base: "src/",
    tsToJs: true,
};

var tsProject = ts.createProject({
    noEmitOnError: true,
    noExternalResolve: true,
    target: "ES5",
});

gulp.task("manifest", function() {
    return gulp.src("manifest.json")
        .pipe(manifest.background([
            "src/third_party/jquery-3.1.0.slim.js",
            "src/core/**.ts",
            "src/background/main.ts"
        ], globOptions))
        .pipe(manifest.content("src/adapters/adapters.json", [
            "src/third_party/jquery-3.1.0.slim.js",
            "src/adapters/adapter.ts",
            "src/adapters/listener.ts",
            "src/core/types.ts"
        ], globOptions))
        .pipe(manifest.popup("popup/popup.html"))
        .pipe(gulp.dest("target/"));
});

gulp.task("popup", function() {
    return gulp.src(["src/popup/*.html", "src/popup/*.css"], globOptions)
        .pipe(gulp.dest("target/"));
});

gulp.task("third_party", function() {
    return gulp.src("src/third_party/**", globOptions)
        .pipe(gulp.dest("target/"));
});

gulp.task("scripts", function() {
    return gulp.src("src/**/*.ts", globOptions)
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))
        .pipe(gulp.dest("target/"));
});

gulp.task("clean", function() {
    return del("target/");
});

gulp.task("build", ["manifest", "popup", "scripts", "third_party"]);

gulp.task("default", ["build"]);

gulp.task("watch", ["build"], function() {
    gulp.watch([
        "manifest.json",
        "gulpfile.js",
        "src/adapters/adapters.json"
    ], ["manifest"]);
    gulp.watch("src/popup/**", ["popup"]);
    gulp.watch("src/**/*.ts", ["scripts"]);
    gulp.watch("src/third_party/**", ["third_party"]);
});
