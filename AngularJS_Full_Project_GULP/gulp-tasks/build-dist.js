'use strict'

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin')
var rename = require('gulp-rename');
var del = require('del');
var runSequence = require('run-sequence');
var replace = require('gulp-replace');

gulp.paths = {
    dist: 'dist',
    vendors: 'dist/vendors'
};

var paths = gulp.paths;

var vendorsJS = [
  'node_modules/@uirouter/angularjs/release/angular-ui-router.min.js',
  'node_modules/angular/angular.min.js',
  'node_modules/angular-animate/angular-animate.min.js',
  'node_modules/angular-breadcrumb/dist/angular-breadcrumb.min.js',
  'node_modules/angular-chart.js/dist/angular-chart.min.js',
  'node_modules/angular-daterangepicker/js/angular-daterangepicker.min.js',
  'node_modules/angular-loading-bar/build/loading-bar.min.js',
  'node_modules/angular-sanitize/angular-sanitize.min.js',
  'node_modules/angular-toastr/dist/angular-toastr.tpls.min.js',
  'node_modules/angular-translate/dist/angular-translate.min.js',
  'node_modules/angular-ui-calendar/src/calendar.js',
  'node_modules/angular-ui-mask/dist/mask.min.js',
  'node_modules/bootstrap/dist/js/bootstrap.min.js',
  'node_modules/bootstrap-daterangepicker/daterangepicker.js',
  'node_modules/chart.js/dist/Chart.min.js',
  'node_modules/fullcalendar/dist/fullcalendar.min.js',
  'node_modules/fullcalendar/dist/gcal.min.js',
  'node_modules/jquery/dist/jquery.min.js',
  'node_modules/jquery/dist/jquery.min.map',
  'node_modules/moment/min/moment.min.js',
  'node_modules/oclazyload/dist/ocLazyLoad.min.js',
  'node_modules/popper.js/dist/umd/popper.min.js',
  'node_modules/popper.js/dist/umd/popper.min.js.map'
]

var vendorsCSS = [
  'node_modules/font-awesome/css/font-awesome.min.css',
  'node_modules/font-awesome/css/font-awesome.css.map',
  'node_modules/simple-line-icons/css/simple-line-icons.css'
]

var vendorsFonts = [
  'node_modules/font-awesome/fonts/**',
  'node_modules/simple-line-icons/fonts/**'
]

gulp.task('copy:vendorsCSS', function() {
  return gulp.src(vendorsCSS)
  .pipe(gulp.dest(paths.vendors + '/css/'));
});

gulp.task('minify:vendorsCSS', function() {
  return gulp.src([paths.vendors + '/css/*.css', '!' + paths.vendors + '/css/*.min.css'])
  .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.vendors + '/css/'));
});

gulp.task('clean:vendorsCSS', function () {
    return del([paths.vendors + '/css/*.css', '!' + paths.vendors + '/css/*.min.css']);
});

gulp.task('vendors:css', function(callback) {
    runSequence('copy:vendorsCSS', 'minify:vendorsCSS', 'clean:vendorsCSS', callback);
});

gulp.task('copy:vendorsJS', function() {
  return gulp.src(vendorsJS)
  .pipe(gulp.dest(paths.vendors + '/js/'));
});

gulp.task('minify:vendorsJS', function() {
  return gulp.src([paths.vendors + '/js/*.js', '!' + paths.vendors + '/js/*.min.js'])
  .pipe(gulp.dest(paths.vendors + '/js/'))
  .pipe(uglify())
  .pipe(rename({ suffix: '.min' }))
  .pipe(gulp.dest(paths.vendors+'/js/'));
});

gulp.task('clean:vendorsJS', function () {
    return del([paths.vendors + '/js/*.js', '!' + paths.vendors + '/js/*.min.js']);
});

gulp.task('vendors:js', function(callback) {
    runSequence('copy:vendorsJS', 'minify:vendorsJS', 'clean:vendorsJS', callback);
});

gulp.task('copy:vendorsFonts', function() {
  return gulp.src(vendorsFonts)
  .pipe(gulp.dest(paths.vendors + '/fonts/'));
});

gulp.task('replace:node_modules', function(){
  return gulp.src([
      './dist/*.html',
      './dist/**/*.js',
    ], {base: './'})
    .pipe(replace(/node_modules+.+(\/[a-z0-9][^/]*\.js+(\'|\"))/ig, 'vendors/js$1'))
    .pipe(replace(/vendors\/js\/(.*).js/ig, 'vendors/js/$1.min.js'))
    .pipe(replace(/..\/..\/vendors\/js\/(.*).js/ig, '../../vendors/js/$1.min.js'))
    .pipe(replace('.min.min.js', '.min.js'))
    .pipe(replace(/node_modules+.+(\/[a-z0-9][^/]*\.css+(\'|\"))/ig, 'vendors/css$1'))
    .pipe(replace(/vendors\/css\/(.*).css/ig, 'vendors/css/$1.min.css'))
    .pipe(replace(/..\/..\/vendors\/css\/(.*).css/ig, '../../vendors/css/$1.min.css'))
    .pipe(replace('.min.min.css', '.min.css'))
    .pipe(gulp.dest('./'));
});

gulp.task('vendors', function(callback) {
    runSequence('vendors:css', 'vendors:js', 'copy:vendorsFonts', 'replace:node_modules', callback);
});

gulp.task('clean:dist', function () {
    return del(paths.dist);
});

gulp.task('copy:css', function() {
   return gulp.src('./css/**/*')
   .pipe(gulp.dest(paths.dist+'/css'));
});

gulp.task('copy:img', function() {
   return gulp.src('./img/**/*')
   .pipe(gulp.dest(paths.dist+'/img'));
});

gulp.task('copy:js', function() {
   return gulp.src('./js/**/*')
   .pipe(gulp.dest(paths.dist+'/js'));
});

gulp.task('copy:views', function() {
   return gulp.src('./views/**/*')
   .pipe(gulp.dest(paths.dist+'/views'));
});

gulp.task('copy:html', function() {
   return gulp.src('index.html')
   .pipe(gulp.dest(paths.dist+'/'));
});

gulp.task('build:dist', function(callback) {
    runSequence('clean:dist', 'copy:css', 'copy:img', 'copy:js', 'copy:views', 'copy:html', 'vendors', callback);
});
