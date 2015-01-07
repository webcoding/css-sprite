/*
 * grunt-css-sprite
 * https://github.com/aslansky/grunt-css-sprite
 *
 * Copyright (c) 2014 Alexander Slansky
 * Licensed under the MIT license.
 */

//'use strict';

// 引入 gulp
var gulp = require('gulp'); 

// 引入组件
var gulpif = require('gulp-if');
var sprite = require('./index');

// 自定义方法 sprite.create(options, cb);
// sprite.create({
//     'size': 16,
//     'unit': 'rem',
//     'concatName': 'icons'
//   },function(){

//   }
// );

sprite = sprite.stream;

// 定义变量
var sprite_files = './test/icons/*/*/16.png',
    test_files = './test/icon/*.png',
    fixtures_files = './test/fixtures/*.png',
    output_path = './test/dist/';

// generate sprite.png and _sprite.scss
gulp.task('sprite', function () {
  return gulp.src(test_files)
    .pipe(sprite({
      src: null,
      out: '',
      name: 'sprite',
      style: null,                //'_icons.scss',
      format: 'png',
      cssPath: '../img',
      processor: 'scss',
      template: null,             //'scss.mustache'
      orientation: 'vertical',    //binary-tree
      retina: false,
      background: '#FFFFFF',
      margin: 0,
      opacity: 0
    }))
    .pipe(gulpif('*.png', gulp.dest(output_path+'img/'), gulp.dest(output_path+'scss/')))
});

// generate scss with base64 encoded images
gulp.task('base64', function () {
  return gulp.src(test_files)
    .pipe(sprite({
      base64: true,
      style: '_base64.scss',
      processor: 'scss'
    }))
    .pipe(gulp.dest(output_path+'scss/'));
});
