///<reference path="../../../headers/common.d.ts" />

import './pieChartPanel';
import './legend';

import moment from 'moment';
import kbn from 'app/core/utils/kbn';
import _ from 'lodash';
import TimeSeries from 'app/core/time_series2';
import {MetricsPanelCtrl} from 'app/plugins/sdk';

class PieChartCtrl extends MetricsPanelCtrl {
  static templateUrl = 'module.html';

  unitFormats: any;
  series: any = [];

  panelDefaults = {
    legend: {
      show: true, // disable/enable legend
      legendType: 'rightSide',
      values: false, // disable/enable legend values
      min: false,
      max: false,
      current: false,
      total: false,
      avg: false
    },
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
    _.defaults(this.panel.legend, this.panelDefaults.legend);

    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
  }

  onInitEditMode() {
    this.unitFormats = kbn.getUnitFormats();
  }

  setUnitFormat(axis, subItem) {
    this.panel.format = subItem.value;
    this.render();
  }

  refreshData(datasource) {
    return this.issueQueries(datasource)
    .then(res => this.dataHandler(res))
    .catch(err => {
      this.render([]);
      throw err;
    });
  }

  loadSnapshot(snapshotData) {
    this.dataHandler(snapshotData);
  }

  dataHandler(results) {
    this.series = _.map(results.data, (series, i) => this.seriesHandler(series, i));
    this.render(this.series);
  }

  seriesHandler(seriesData, index) {
    var series = new TimeSeries({
      datapoints: seriesData.datapoints,
      alias: seriesData.target
    });
    series.flotpairs = series.getFlotPairs(this.panel.nullPointMode);
    return series;
  }

}

export {PieChartCtrl, PieChartCtrl as PanelCtrl}
