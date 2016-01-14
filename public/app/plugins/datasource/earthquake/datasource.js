define([
  'angular'
],
function (angular) {
  'use strict';

  var module = angular.module('grafana.services');

  module.factory('EarthquakeDatasource', function($q, backendSrv) {

    function EarthquakeDatasource(datasource) {
      this.name = datasource.name;
      this.type = datasource.type;
      this.url = datasource.url;
    }

    EarthquakeDatasource.prototype._get = function(relativeUrl, params) {
      return backendSrv.datasourceRequest({
        method: 'GET',
        url: this.url + (!relativeUrl ? '' : relativeUrl),
        params: params,
      });
    };

    EarthquakeDatasource.prototype.testDatasource = function() {
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
      result.data.features.forEach(function(row) {
        var props = row.properties;
        var dp = map[props.alert];
        if(!dp) {
          dp = [];
          map[props.alert] = dp;
        }
        dp.push([props.mag, props.updated, row.geometry]);
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

    EarthquakeDatasource.prototype.query = function(options) {
      var params = {'starttime': parseDate(options.range.from),
          'endtime': parseDate(options.range.to),
          'minmagnitude' : 6,
          'format': 'geojson'};
      return this._get('/query', params).then(function(result) {
        return convert(result);
      });
    };

    function parseDate(milli) {
      return new Date(milli).toISOString().slice(0, 10);
    }

    EarthquakeDatasource.prototype.metricFindQuery = function() {
      return $q.when([]);
    };

    return EarthquakeDatasource;

  });

});
