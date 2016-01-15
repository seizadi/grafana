define([
  'angular',
  'app/app',
  'lodash',
  'jquery',
  'leaflet'
],
function (angular, app, _, $, L) {
  'use strict';

  var module = angular.module('grafana.panels.map', []);
  app.useModule(module);

  module.directive('mapPanel', function() {

    return {
      link: function(scope, elem) {
        var data, annotations, panel, map, circles = [];

        scope.$on('render', function(event, renderData) {
          data = renderData.data;
          buildAnnotationCache(renderData.annotations);
          render(renderData);
          scope.panelRenderingComplete();
        });

        function buildAnnotationCache(events) {
          if(!events || events.length === 0) {
            annotations = null;
            return;
          }
          annotations = {};
          events.forEach(function(event) {
            annotations[event.tags] = event.title;
          });
        }

        function setElementHeight() {
          try {
            var height = scope.height || panel.height || scope.row.height;
            if (_.isString(height)) {
              height = parseInt(height.replace('px', ''), 10);
            }

            height -= 5; // padding
            height -= panel.title ? 24 : 9; // subtract panel title bar

            elem.css('height', height + 'px');

            return true;
          } catch(e) { // IE throws errors sometimes
            return false;
          }
        }

        function initMap() {
          if(map) {
            return;
          }
          L.Icon.Default.imagePath = 'public/vendor/leaflet/dist/images';
          map = L.map(elem[0]).setView([37.8, -96], 2);
          L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);

//          L.marker([51.5, -0.09]).addTo(map)
//            .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
//            .openPopup();
        }

        function addCircles() {
          circles.forEach(function(c) {
            map.removeLayer(c);
          });
          circles = [];
          if(!data) {
            return;
          }
          if(data.length > 0 && data[0].datapoints[0].length < 3) {
            return;
          }
          data.forEach(function(row) {
            row.datapoints.forEach(function(dp) {
              var coords = dp[2].coordinates;
              var circle = L.circle([coords[1], coords[0]], dp[0]*10000, {
                color: row.target,
                fillColor: '#f03',
                fillOpacity: 0.5
              }).addTo(map);
              if(annotations) {
                circle.bindPopup(annotations[dp[3]]);
              }
              circles.push(circle);
            });
          });
        }

        function render() {
          panel = scope.panel;

          setElementHeight();

          initMap();
          addCircles();
        }
      }
    };
  });
});
