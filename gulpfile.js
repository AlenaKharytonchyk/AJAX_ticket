const {
  src, dest, parallel, series, watch
} = require('gulp');
const less = require('gulp-less');
const postcss = require('gulp-postcss');
const minifyCSS = require('gulp-csso');
const concat = require('gulp-concat');
const inject = require('gulp-inject');
const eslint = require('gulp-eslint');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const connect = require('gulp-connect');
const babel = require('gulp-babel');

function html() {
  const target = src(['./src/index.html', './src/chat.html']);
  const sources = src(['./build/js/*.js', './build/css/*.css'], {
    read: false
  });

  return target
    .pipe(
      inject(sources, {
        addRootSlash: false,
        ignorePath: '/build/'
      })
    )
    .pipe(dest('./build'))
    .pipe(connect.reload());
}
function css() {
  const processors = [autoprefixer, cssnano];
  return src('src/*.less')
    .pipe(less())
    .pipe(postcss(processors))
    .pipe(minifyCSS())
    .pipe(dest('build/css'))
    .pipe(connect.reload());
}
function webserver() {
  return connect.server({ livereload: true, root: ['build'] });
}

function js() {
  return src('src/*.js', { sourcemaps: true })
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(concat('app.min.js'))
    .pipe(dest('build/js', { sourcemaps: true }))
    .pipe(connect.reload());
}
function json() {
  return src('src/*.json')
    .pipe(dest('build'));
}
function img() {
  return src('src/assets/*.png')
    .pipe(dest('build/assets'));
}
function watchTask(cb) {
  watch('src/*.less', css);
  watch('src/*.js', js);
  watch('src/*.json', json);
  watch('src/*.html', html);
  watch('src/assets/*.png', img);
  cb();
}

exports.watch = series(parallel(css, js, json, img), html, parallel(webserver, watchTask));
exports.default = series(parallel(css, js, json, img), html);
