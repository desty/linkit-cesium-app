'use strict';

var config = require('../config');
var gulp   = require('gulp');
var del    = require('del');

gulp.task('clean', function(cb) {

  // Cesium 라이브러리 디렉토리는 /app 에서 복사해온 것인데 build 할 때마다 삭제 되는 것을 방지해야 해서 아래와 같이 처리
  del([config.dist.root + '/*', '!' + config.dist.root + '/Cesium'], cb);

});
