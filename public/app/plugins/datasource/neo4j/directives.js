define([
  'angular',
],
function (angular) {
  'use strict';

  var module = angular.module('grafana.directives');

  module.directive('metricQueryEditorNeo4j', function() {
    return {controller: 'Neo4jQueryCtrl',
      templateUrl: 'app/plugins/datasource/neo4j/partials/query.editor.html'};
  });

});
