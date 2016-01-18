define([
  'angular',
],
function (angular) {
  'use strict';

  var module = angular.module('grafana.directives');

  module.directive('metricQueryEditorEarthquake', function() {
    return {controller: 'EarthquakeQueryCtrl',
      templateUrl: 'app/plugins/datasource/earthquake/partials/query.editor.html'};
  });

});
