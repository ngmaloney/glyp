var gulp = require("gulp");
var bowerfiles = require("main-bower-files");
var browsersync = require("browser-sync");
var concat = require("gulp-concat");
var fs = require("fs");
var jade = require("gulp-jade");
var less = require("gulp-less");
var path = require("path");
var s3 = require("gulp-s3");
var uglify = require("gulp-uglify");

var plumber = require("gulp-plumber");
var gutil = require("gulp-util")
var reload = browsersync.reload;

var paths = {
  templates: ["src/views/**/*.jade"],
  javascripts: ["src/javascripts/*"],
  stylesheets: ["src/stylesheets/*"]
}

gulp.task("templates", function() {
  gulp.src("src/views/pages/**/*.jade")
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest("build"));
  gulp.src("src/views/pages/**/*.html")
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
  gulp.src("src/stylesheets/application.less")
    //TODO remove me
    .pipe(plumber(function(error) {
      gutil.log(gutil.colors.red(error.message));
      gutil.beep();
      this.emit('end');
    }))
    .pipe(less({paths: ["src/bower_components"]}))
    .pipe(gulp.dest("build/stylesheets"));
});

gulp.task("video-assets", function() {
  gulp.src("src/bower_components/videojs/dist/video-js/video-js.swf")
    .pipe(gulp.dest("build/assets/swf/"));
});

gulp.task("assets", function() {
  gulp.src("src/assets/**/*")
    .pipe(gulp.dest("build"));
});

gulp.task("fonts", function() {
  gulp.src("src/bower_components/bootstrap/fonts/**/*")
    .pipe(gulp.dest("build/fonts"));
});

gulp.task("server", function() {
  browsersync({
    server: {
      baseDir: "./build"
    }
  });
});

gulp.task("deploy", function() {
  var aws = JSON.parse(fs.readFileSync('./aws.json'));
  var options = {uploadPath: "/"}
  gulp.src('./build/**')
    .pipe(s3(aws, options));
});

gulp.task("watch", function() {
  gulp.watch(paths.templates, ["templates"]);
  gulp.watch(paths.javascripts, ["javascript"]);
  gulp.watch(paths.stylesheets, ["stylesheets"]);
});

gulp.task("build", ["templates", "javascript", "css", "assets", "video-assets", "fonts"]);

gulp.task("default", ["build", "server"], function() {
  gulp.watch(paths.templates, ["templates", reload]);
  gulp.watch(paths.javascripts, ["javascript", reload]);
  gulp.watch(paths.stylesheets, ["css", reload]);
});
