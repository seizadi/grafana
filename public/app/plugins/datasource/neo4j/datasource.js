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
        return {data: res};
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
                             "statement": "MATCH (n)-[r]->(m) where n.ip in ['6.155.145.206'] RETURN n AS FROM , r AS `->`, m AS to",
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
//      console.log(res);
      res.data.results[0].data.forEach(function(row) {
        if(row.graph.relationships.length>0) {
          console.log(row.graph);
        }
      });
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
