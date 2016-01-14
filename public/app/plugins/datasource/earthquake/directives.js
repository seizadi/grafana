define([
  'angular',
],
function (angular) {
  'use strict';

  var module = angular.module('sample.directives');

  module.directive('metricQueryEditorEarthquake', function() {
    return {templateUrl: 'app/plugins/datasource/sample/partials/query.editor.html'};
  });

});
