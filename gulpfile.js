const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();

// Define folders to copy
const foldersToCopy = ["js", "css", "assets"];

// Function to create copy tasks dynamically
function createCopyTasks(done) {
  const tasks = foldersToCopy.map((folder) => {
    return function (cb) {
      return gulp
        .src(`src/${folder}/**/*`)
        .pipe(gulp.dest(`dist/${folder}`))
        .pipe(browserSync.stream());
    };
  });

  // Register all tasks
  tasks.forEach((task, index) => {
    gulp.task(`copy-${foldersToCopy[index]}`, gulp.series(task));
  });

  done();
}

// Function to compile Sass (Sass syntax)
gulp.task("sass", function () {
  return gulp
    .src("src/style/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream());
});

// Move HTML files to dist & reload browser
gulp.task("html", function () {
  return gulp
    .src("src/*.html")
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream());
});

// Watch Sass, JS, CSS, assets & HTML files and serve with BrowserSync
gulp.task(
  "serve",
  gulp.series("sass", createCopyTasks, "html", function () {
    browserSync.init({
      server: "./dist",
    });

    gulp.watch("src/style/*.scss", gulp.series("sass"));
    gulp
      .watch("src/*.html", gulp.series("html"))
      .on("change", browserSync.reload);

    // Watch folders to copy
    foldersToCopy.forEach((folder) => {
      gulp.watch(`src/${folder}/**/*`, gulp.series(`copy-${folder}`));
    });
  })
);

// Default task
gulp.task("default", gulp.series("serve"));
