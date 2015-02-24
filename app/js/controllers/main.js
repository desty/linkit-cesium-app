'use strict';

var controllersModule = require('./_index');

/**
 * @ngInject
 */
function MainCtrl() {

  // ViewModel
  var vm = this;

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
    imageryProvider : new Cesium.ArcGisMapServerAndVworldSatelliteImageryProvider({
      url: '//services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
    })
  });

  var layers = viewer.scene.imageryLayers;
  layers.addImageryProvider(new Cesium.ArcGisMapServerAndVworldHybridImageryProvider({
    url: '//services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
  }));

  var terrainProvider = new Cesium.CesiumTerrainProvider({
    url : '//cesiumjs.org/tilesets/terrain/smallterrain'
  });
  viewer.terrainProvider = terrainProvider;

}

controllersModule.controller('MainCtrl', MainCtrl);