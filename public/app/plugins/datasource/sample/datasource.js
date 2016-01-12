define([
  'angular'
],
function (angular) {
  'use strict';

  var module = angular.module('grafana.services');

  module.factory('SampleDatasource', function($q, backendSrv) {

    function SampleDatasource(datasource) {
      this.name = datasource.name;
      this.type = datasource.type;
      this.url = datasource.url;
    }

    SampleDatasource.prototype._get = function(relativeUrl, params) {
      return backendSrv.datasourceRequest({
        method: 'GET',
        url: this.url + (!relativeUrl ? '' : relativeUrl),
        params: params,
      });
    };

    SampleDatasource.prototype.testDatasource = function() {
      return this._get().then(function() {
        return { status: "success", message: "Data source is working", title: "Success" };
      }, function(err) {
        if (err.data && err.data.error) {
          return { status: "error", message: err.data.error, title: "Error" };
        } else {
          return { status: "error", message: err.status, title: "Error" };
        }
      });
    };

    function convert(result) {
      var map = {};
      result.data.data.forEach(function(row) {
        var dp = map[row[9]];
        if(!dp) {
          dp = [];
          map[row[9]] = dp;
        }
        dp.push([row[13], (new Date(row[10])).getTime()]);
      });
      var dataSeries = [];
      for (var key in map) {
        var dp = map[key].sort(function(a,b) {
          return a[1] - b[1];
        });
        dataSeries.push({'target': key, 'datapoints': dp});
      }
      return {data: dataSeries};
    }

    SampleDatasource.prototype.query = function() {
      return this._get('/f29j-qgmr/rows.json').then(function(result) {
        return convert(result);
      });
    };

    SampleDatasource.prototype.metricFindQuery = function() {
      return $q.when([]);
    };

    return SampleDatasource;

  });

});
