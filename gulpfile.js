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

sprite = sprite.stream;

// 定义变量
var sprite_files = './test/icons/*/*/*@2x.png',
    test_files = './test/sprite/*.png',
    fixtures_files = './test/fixtures/*.png',
    output_path = './test/dist/';

// generate sprite.png and _sprite.scss
gulp.task('sprite', function () {
  return gulp.src(test_files)
    .pipe(sprite({
      src: null,
      out: 'css',
      prefix: 'icon',
      name: '_icons',
      style: '_icons.css',         //'_icons.scss',
      // spriteInfo: {
      //   styleNameReg: '',
      //   iconAreaSize: '',
      //   styleType: ''
      // },
      format: 'png',
      cssPath: '../images',
      processor: 'css',
      //template: 'scss.template.mustache',             //'scss.mustache'
      //retina: true,
      algorithm: 'binary-tree',     //binary-tree
      //retina: false,
      //background: '#FFFFFF',
      //opacity: 0,
      margin: 0
    }))
    .pipe(gulpif('*.png', gulp.dest(output_path+''), gulp.dest(output_path+'')))
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
