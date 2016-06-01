///<reference path="../../../headers/common.d.ts" />

import './panel';

import _ from 'lodash';
import {MetricsPanelCtrl} from 'app/plugins/sdk';

class HistogramGraphCtrl extends MetricsPanelCtrl {
  static templateUrl = 'module.html';

  annotationsPromise: any;

  panelDefaults = {
    links: [],
    datasource: null,
    maxDataPoints: 3,
    interval: null,
    targets: [{}],
    cacheTimeout: null,
    nullText: null,
    nullPointMode: 'connected'
  };


  /** @ngInject */
  constructor($scope, $injector, private annotationsSrv) {
    super($scope, $injector);
    _.defaults(this.panel, this.panelDefaults);
  }

  refreshData(datasource) {
    this.annotationsPromise = this.annotationsSrv.getAnnotations(this.dashboard);

    return this.issueQueries(datasource)
      .then(res => this.dataHandler(res))
      .catch(err => {
        this.render([]);
        throw err;
      });
  }

  loadSnapshot(snapshotData) {
    this.annotationsPromise = this.annotationsSrv.getAnnotations(this.dashboard);
    this.dataHandler(snapshotData);
  }

  dataHandler(results) {
    // png renderer returns just a url
    if (_.isString(results)) {
      this.render(results);
      return;
    }

    this.annotationsPromise.then(annotations => {
      this.loading = false;
      results.annotations = annotations;
      this.render(results);
    }, () => {
      this.loading = false;
      this.render(results);
    });
  };

}

export {HistogramGraphCtrl, HistogramGraphCtrl as PanelCtrl}
