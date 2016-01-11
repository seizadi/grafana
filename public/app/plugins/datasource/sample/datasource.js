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
        url: this.url + relativeUrl,
        params: params,
      });
    };

    SampleDatasource.prototype.testDatasource = function() {
      return this._get('/countries?per_page=1&incomeLevel=LIC&format=json').then(function() {
        return { status: "success", message: "Data source is working", title: "Success" };
      }, function(err) {
        if (err.data && err.data.error) {
          return { status: "error", message: err.data.error, title: "Error" };
        } else {
          return { status: "error", message: err.status, title: "Error" };
        }
      });
    };

    SampleDatasource.prototype.query = function(options) {
      return backendSrv.get('/api/metrics/test', {
        from: options.range.from.valueOf(),
        to: options.range.to.valueOf(),
        maxDataPoints: options.maxDataPoints
      });
    };

    SampleDatasource.prototype.metricFindQuery = function() {
      return $q.when([]);
    };

    return SampleDatasource;

  });

});
