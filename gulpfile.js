var gulp = require("gulp");
var bowerfiles = require("main-bower-files");
var browsersync = require("browser-sync");
var concat = require("gulp-concat");
var jade = require("gulp-jade");
var uglify = require("gulp-uglify");

var paths = {
  templates: ["src/*.jade", "src/templates/*.jade"],
  javascripts: ["src/javascripts/*"],
  stylesheets: ["src/stylesheets/*"]
}

gulp.task("templates", function() {
  gulp.src("src/*.jade")
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest("build"));
});

gulp.task("javascript", function() {
  //Bower JS
  gulp.src(bowerfiles({
    filter: /\.js$/i
  }))
  .pipe(concat("libs.js"))
  .pipe(uglify())
  .pipe(gulp.dest("build/javascripts"));

  //Application JS
  gulp.src("src/javascripts/*.js")
    .pipe(concat("application.js"))
    .pipe(uglify())
    .pipe(gulp.dest("build/javascripts"));
});

gulp.task("css", function() {
  //Bower CSS
  gulp.src(bowerfiles({
    filter: /\.css$/i
  }))
  .pipe(concat("libs.css"))
  .pipe(gulp.dest("build/stylesheets"));

  //Application css
  gulp.src("src/stylesheets/*.css")
    .pipe(concat("application.css"))
    .pipe(gulp.dest("build/stylesheets"));
});

gulp.task("server", function() {
  browsersync({
    server: {
      baseDir: "./build"
    }
  });
});

gulp.task("watch", function() {
  gulp.watch(paths.templates, ["templates"]);
  gulp.watch(paths.javascripts, ["javascripts"]);
  gulp.watch(paths.stylesheets, ["stylesheets"]);
});

gulp.task("default", ["watch", "templates", "javascript", "css", "server"]);
