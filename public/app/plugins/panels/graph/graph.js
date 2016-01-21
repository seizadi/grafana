define([
  'angular',
  'app/app',
  'lodash',
  'jquery',
  'sigma'
],
function (angular, app, _, $, sigma) {
  'use strict';

  var module = angular.module('grafana.panels.graph', []);
  app.useModule(module);

  module.directive('graph', function() {

    return {
      link: function(scope, elem) {
        var data, panel, graph;

        scope.$on('render-graph', function(event, renderData) {
          if(!renderData) {
            return;
          }
          data = renderData.data;
          render(renderData);
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

          if(graph) {
            return;
          }

          /**
           * This is a basic example on how to instantiate sigma. A random graph is
           * generated and stored in the "graph" variable, and then sigma is instantiated
           * directly with the graph.
           *
           * The simple instance of sigma is enough to make it render the graph on the on
           * the screen, since the graph is given directly to the constructor.
           */
          var i,
              N = 100,
              E = 500,
              g = {
                nodes: [],
                edges: []
              };

          // Generate a random graph:
          for (i = 0; i < N; i++) {
            g.nodes.push({
              id: 'n' + i,
              label: 'Node ' + i,
              x: Math.random(),
              y: Math.random(),
              size: Math.random(),
              color: '#666'
            });
          }

          for (i = 0; i < E; i++) {
            g.edges.push({
              id: 'e' + i,
              source: 'n' + (Math.random() * N | 0),
              target: 'n' + (Math.random() * N | 0),
              size: Math.random(),
              color: '#ccc'
            });
          }

          // Instantiate sigma:
          graph = new sigma({
            graph: g,
            container: elem[0]
          });
        }
      }
    };
  });
});
