'use strict';

var controllersModule = require('./_index');

/**
 * @ngInject
 */
function MainCtrl($scope) {

  // ViewModel
  var vm = this;

  vm.showPlacename = false;

  var viewer = new Cesium.Viewer('cesiumContainer', {
    //timeline : false,
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
    url : '//assets.agi.com/stk-terrain/world'
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

  // 지정한 위치로 이동
  vm.goLonLat = function(lon, lat, altitude) {
    viewer.entities.removeAll();

    viewer.camera.flyTo({
      destination : Cesium.Cartesian3.fromDegrees(lon, lat, 30000.0)
    });

    setTimeout(function() {
      createEntity(lon, lat, altitude);
    }, 2000);
  };

  // 비행기 띄우기 - http://cesiumjs.org/Cesium/Apps/Sandcastle/index.html?src=Interpolation.html&label=Showcases
  Cesium.Math.setRandomNumberSeed(3);

  var start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16));
  var stop = Cesium.JulianDate.addSeconds(start, 360, new Cesium.JulianDate());

  viewer.clock.startTime = start.clone();
  viewer.clock.stopTime = stop.clone();
  viewer.clock.currentTime = start.clone();
  viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
  viewer.clock.multiplier = 1;

  viewer.timeline.zoomTo(start, stop);

  function computeCircularFlight(lon, lat, radius, altitude) {
    var property = new Cesium.SampledPositionProperty();
    for (var i = 0; i <= 360; i += 45) {
      var radians = Cesium.Math.toRadians(i);
      var time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
      var position = Cesium.Cartesian3.fromDegrees(lon + (radius * 1.5 * Math.cos(radians)), lat + (radius * Math.sin(radians)), Cesium.Math.nextRandomNumber() * 500 + (altitude ? altitude : 750));
      property.addSample(time, position);

      viewer.entities.add({
        position: position,
        point: {
          pixelSize: 8,
          color: Cesium.Color.TRANSPARENT,
          outlineColor: Cesium.Color.TRANSPARENT,
          outlineWidth: 3
        }
      });
    }
    return property;
  }

  function createEntity(lon, lat, altitude) {
    if (viewer.trackedEntity) {
      viewer.trackedEntity = null;
    }

    var position = computeCircularFlight(lon, lat, 0.03, altitude);

    var entity = viewer.entities.add({
      availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
        start: start,
        stop: stop
      })]),

      position: position,

      orientation: new Cesium.VelocityOrientationProperty(position),

      model: {
        uri: 'http://cesiumjs.org/Cesium/Apps/SampleData/models/CesiumAir/Cesium_Air.gltf',
        minimumPixelSize: 64
      },

      path: {
        resolution: 1,
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: 0.1,
          color: Cesium.Color.TRANSPARENT
        }),
        width: 10
      }
    });

    viewer.trackedEntity = entity;
  }

  // 최초 로딩시 10초 후 비행기 시점으로 전환 - 북한산 국립공원
  setTimeout(function() {
    createEntity(126.990033, 37.658466);
  }, 10000);

}

controllersModule.controller('MainCtrl', MainCtrl);