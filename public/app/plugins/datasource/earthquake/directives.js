define([
  'angular',
],
function (angular) {
  'use strict';

  var module = angular.module('sample.directives');

  module.directive('metricQueryEditorEarthquake', function() {
    return {templateUrl: 'app/plugins/datasource/earthquake/partials/query.editor.html'};
  });

});
