///<reference path="../../../headers/common.d.ts" />

import './mapPanel';

import _ from 'lodash';
import {MetricsPanelCtrl} from 'app/plugins/sdk';

class MapCtrl extends MetricsPanelCtrl {
  static templateUrl = 'module.html';

  annotationsPromise: any;
  colors: any = [];

  panelDefaults = {
    // datasource name, null = default datasource
    datasource: null,
    // sets client side (flot) or native graphite png renderer (png)
    renderer: 'flot',
    // metric queries
    targets: [{}]
  };

  /** @ngInject */
  constructor($scope, $injector, private annotationsSrv) {
    super($scope, $injector);

    _.defaults(this.panel, this.panelDefaults);

    this.colors = $scope.$root.colors;
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

export {MapCtrl, MapCtrl as PanelCtrl}
