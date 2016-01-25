define([
  'angular',
  './queryCtrl',
  './directives'
],
function (angular) {
  'use strict';

  var module = angular.module('grafana.services');

  module.factory('Neo4jDatasource', function($q, backendSrv) {

    function Neo4jDatasource(datasource) {
      this.name = datasource.name;
      this.type = datasource.type;
      this.url = datasource.url;
    }

    Neo4jDatasource.prototype._get = function(relativeUrl, params) {
      return backendSrv.datasourceRequest({
        method: 'GET',
        url: this.url + (!relativeUrl ? '' : relativeUrl),
        params: params,
      });
    };

    Neo4jDatasource.prototype.testDatasource = function() {
      var options = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          url: this.url + '/db/data'
      };
      return backendSrv.datasourceRequest(options).then(function() {
        return { status: "success", message: "Data source is working", title: "Success" };
      }, function(err) {
        if (err.data && err.data.error) {
          return { status: "error", message: err.data.error, title: "Error" };
        } else {
          return { status: "error", message: err.status, title: "Error" };
        }
      });
    };

    Neo4jDatasource.prototype.query = function(options) {
      var self = this;
      var promises = options.targets.map(function() {
        return backendSrv.datasourceRequest(self._createQuery()).then(function(result) {
          return convert(result);
        });
      });
      return $q.all(promises).then(function(res) {
        return {data: res[0]};
      });
    };

    Neo4jDatasource.prototype._createQuery = function() {
      return {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          url: this.url + '/db/data/transaction/commit',
          data: {
            "statements": [
                           {
                             "statement": "match(client)-[:Query]->(host)<-[r]-(Virus) return client, host, r, Virus limit 1000",
                             "resultDataContents": [
                               "row",
                               "graph"
                             ],
                             "includeStats": false
                           }
                         ]
                       }
      };
    };

    function convert(res) {
      var g = {
          nodes: [],
          edges: []
        }, nodeIds = {}, edgeIds = {},
        colors={'Client': '#DE9BF9', 'FQDN': '#68BDF6', 'Host': '#6DCE9E'};
      res.data.results[0].data.forEach(function(row) {
        var graph = row.graph;
        graph.nodes.forEach(function(node) {
          if(!nodeIds[node.id]) {
            nodeIds[node.id] = true;
            var label = node.labels[0];
            g.nodes.push({
              id: node.id,
              label: label === 'FQDN' ? node.properties.name: node.properties.ip,
              x: Math.random(),
              y: Math.random(),
              size: 10,
              color: colors[label]
            });
          }
        });
        graph.relationships.forEach(function(edge) {
          if(!edgeIds[edge.id]) {
            edgeIds[edge.id] = true;
            g.edges.push({
              id: edge.id,
              source: edge.startNode,
              target: edge.endNode,
              size: 10,
              color: '#ccc',
              type: 'curvedArrow',
              arrow: 'source',
              label: "This is the label"
            });
          }
        });
      });
      return g;
    }

    Neo4jDatasource.prototype.metricFindQuery = function() {
      return $q.when([]);
    };

    Neo4jDatasource.prototype.annotationQuery = function() {
      return $q.when([]);
    };

    return Neo4jDatasource;

  });

});
