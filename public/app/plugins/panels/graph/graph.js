define([
  'angular',
  'app/app',
  'lodash',
  'jquery',
  'sigma',
  'force2Atlas'
],
function (angular, app, _, $, sigma) {
  'use strict';

  var module = angular.module('grafana.panels.graph', []);
  app.useModule(module);

  module.directive('graph', function() {

    return {
      link: function(scope, elem) {
        var data, panel, sigmaInstance;

        scope.$on('render-graph', function(event, renderData) {
          if(!renderData) {
            return;
          }
          data = renderData.data;
          render();
          scope.panelRenderingComplete();
        });

        function setElementHeight() {
          try {
            var height = scope.height || panel.height || scope.row.height;
            if (_.isString(height)) {
              height = parseInt(height.replace('px', ''), 10);
            }

            height -= 5; // padding
            height -= panel.title ? 24 : 9; // subtract panel title bar
            height -= 50; // substract tab header

            elem.css('height', height + 'px');

            return true;
          } catch(e) { // IE throws errors sometimes
            return false;
          }
        }

        function render() {
          panel = scope.panel;

          setElementHeight();

          if(sigmaInstance) {
            return;
          }

          // Instantiate sigma:
          sigmaInstance = new sigma.sigma({
            graph: data,
            renderer: {
              // IMPORTANT:
              // This works only with the canvas renderer, so the
              // renderer type set as "canvas" is necessary here.
              container: elem[0],
              type: 'canvas'
            },
            settings: {defaultLabelColor: '#FFFFFF'}
          });

//          sigmaInstance.startForceAtlas2();
        }
      }
    };
  });
});
