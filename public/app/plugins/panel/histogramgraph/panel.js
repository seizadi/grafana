define([
  'angular',
  'app/app',
  'lodash',
  'jquery',
  './graph',
  './histogram'
],
function (angular, app, _, $) {
  'use strict';

  var module = angular.module('grafana.directives', []);
  app.useModule(module);

  module.directive('histogramGraphPanel', function() {

    return {
      templateUrl: 'app/plugins/panel/histogramgraph/panel.html',
      link: function(scope, elem) {
        var data;

        $('.nav.nav-tabs a', elem).click(function (e) {
          e.preventDefault();
          var navtab = $(this);
          var attrVal = navtab.attr('data-source');
          $('.tab-pane.active', elem).removeClass('active');
          $('div[data-target*=' + attrVal + ']', elem).addClass('active');
          $(this).tab('show');
          if(attrVal === 'graph') {
            scope.$broadcast('render-graph', data);
          }
        });

        scope.$on('render', function(event, renderData) {
          var height = scope.row.height;
          console.log(height, elem.width());
          if(!renderData) {
            return;
          }
          scope.$broadcast('render-histogram', renderData);
          data = renderData;
          scope.panelRenderingComplete();
        });

      }
    };
  });
});
