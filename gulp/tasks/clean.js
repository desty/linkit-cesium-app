'use strict';

var config = require('../config');
var gulp   = require('gulp');
var del    = require('del');

gulp.task('clean', function(cb) {

  // Cesium ���̺귯�� ���丮�� /app ���� �����ؿ� ���ε� build �� ������ ���� �Ǵ� ���� �����ؾ� �ؼ� �Ʒ��� ���� ó��
  del([config.dist.root + '/*', '!' + config.dist.root + '/Cesium'], cb);

});
