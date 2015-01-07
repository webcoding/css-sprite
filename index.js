'use strict';

var sprite = require('./lib/css-sprites');
var through2 = require('through2');
var vfs = require('vinyl-fs');
var fs = require('graceful-fs');
var mkdirp = require('mkdirp');
var path = require('path');
var replaceExtension = require('./lib/replace-extension');
var _ = require('lodash');
var noop = function () {};

var writeFile = function (file, enc, cb) {
  var stream = this;
  mkdirp(file.base, function () {
    fs.writeFile(file.path, file.contents, function () {
      stream.push(file);
      cb();
    });
  });
};

var defaults = {
  src: null,            //源文件(array 或 string)[required]
  out: '',              //输出精灵文件的目录路径[process.cwd()]
  base64: false,        //为true时精灵输出base64编码样式(css输出到<out>)
  name: 'sprite',       //精灵名称，不包含扩展名[sprite]
  prefix: '',           //css中class的前缀名(不包含.)[icon]
  style: null,          //输出的样式名，如果省略则CSS写入
  format: 'png',        //输出图片格式，默认png
  cssPath: '../images', //css中精灵路径(相对于css样式或使用绝对路径)[../images]
  //可选: css, less, sass, scss or stylus [css]
  processor: 'css',     //css输出格式，若无则无输入
  template: null,       //样式模板，会覆盖processor选项(要求必须mustache格式的模板)
  retina: false,        //同时生产视网膜和标准的精灵(src必须包含视网膜图标，会自动压缩产生对应标准尺寸)
  //可选: 指定引擎 (auto, phantomjs, canvas, gm, pngsmith, pixelsmith)
  engine: 'pixelsmith', //压缩图片使用的引擎
  //可选算法：top-down  left-right  diagonal  alt-diagonal  binary-tree
  algorithm: 'top-down', //生成图片使用的布局算法[默认top-down]

  background: '#FFFFFF', //背景，默认#FFFFFF
  opacity: 0,            //透明度(0-100) 默认png时为0 jpg时为100
  margin: 0              //精灵间隔[4]
};

module.exports = {
  /*
   *  Creates sprite and css file
   */
  create: function (o, cb) {
    if (!o.src) {
      throw new Error('glob missing');
    }
    if (!o.out) {
      throw new Error('output dir missing');
    }

    var opts = _.extend({}, defaults, o);
    if (opts.style && path.basename(opts.style).indexOf('.') === -1) {
      opts.style = path.join(opts.style, replaceExtension(opts.name, '.' + opts.processor));
    }
    vfs.src(opts.src)
      .pipe(sprite(opts))
      .pipe(through2.obj(writeFile))
      .on('data', noop)
      .on('end', function () {
        if (_.isFunction(cb)) {
          cb();
        }
      });
  },
  /*
   *  Takes a vinyl-fs Readable/Writable stream of images
   *  returns a Readable/Writable stream of vinyl files of the sprite and css file
   */
  stream: function (o) {
    var opts = _.extend({}, defaults, o);
    return sprite(opts);
  }
};
