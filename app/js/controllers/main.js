'use strict';

var controllersModule = require('./_index');

/**
 * @ngInject
 */
function MainCtrl($scope) {

  // ViewModel
  var vm = this;

  vm.showPlacename = true;

  var viewer = new Cesium.Viewer('cesiumContainer', {
    timeline : false,
    animation : false,
    baseLayerPicker : false,
    fullscreenButton: false,
    geocoder: false,
    homeButton: false,
    infoBox: false,
    sceneModePicker: false,
    selectionIndicator: false,
    navigationHelpButton: false,
    navigationInstructionsInitiallyVisible: false,
    // ArcGIS imagery provider 를 사용하지만 우리나라 지역의 경우 브이월드 지도를 사용하도록 커스트마이징
    imageryProvider : new Cesium.ArcGisMapServerAndVworldSatelliteImageryProvider({
      url: '//services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
    })
  });

  // 브이월드 hybrid 레이어 추가
  var layers = viewer.scene.imageryLayers;
  var hybridLayer = layers.addImageryProvider(new Cesium.ArcGisMapServerAndVworldHybridImageryProvider({
    url: '//services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
  }));

  // terrain 설정
  var terrainProvider = new Cesium.CesiumTerrainProvider({
    url : '//cesiumjs.org/tilesets/terrain/smallterrain'
  });
  viewer.terrainProvider = terrainProvider;

  // 우리나라로 이동
  viewer.camera.flyTo({
    destination : Cesium.Cartesian3.fromDegrees(127.5235, 30.3218, 300000.0),
    orientation : {
      heading : Cesium.Math.toRadians(0.0),
      pitch : Cesium.Math.toRadians(-30.0),
      roll : 0.0
    }
  });

  // 지명/도로 보이기/가리기
  $scope.$watch('home.showPlacename', function(newVal, oldVal) {
    if (newVal) {
      hybridLayer.alpha = 1;
    } else {
      hybridLayer.alpha = 0;
    }
  });

}

controllersModule.controller('MainCtrl', MainCtrl);