import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import {PlotsService} from '../_services/plots.service';
import {User} from '../_models/user';
import {environment} from '../../environments/environment.prod';
import {AlertService} from '../_services/alert.service';
import * as Highcharts from 'highcharts';
import {ChartObject} from 'highcharts';
import {CreateCharts} from './create.charts';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    plots = {};
    classification_table_keys= [];
    classification_table: any = {};
    attack_by_dates: any = [];

    user: User = null;
    private classificationBarChart: ChartObject;
    private geoLocationChart: ChartObject;
    private asnChart: ChartObject;
    private classificationTimeLineChart: ChartObject;
    private ipBarChart: ChartObject;
    private networkHistChart: ChartObject;

    constructor(
        private plotService: PlotsService,
        private alertService: AlertService,
    ) {
        if (localStorage.getItem(environment.userStorageKey)) {
            this.user = JSON.parse(localStorage.getItem(environment.userStorageKey));
        }
    }

    ngOnInit() {
        const theme = {
            colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572',
                '#FF9655', '#FFF263', '#6AF9C4'],
            chart: {
                backgroundColor: {
                    linearGradient: [0, 0, 500, 500],
                    stops: [
                        [0, 'rgb(255, 255, 255)'],
                        [1, 'rgb(240, 240, 255)']
                    ]
                },
            },
            title: {
                style: {
                    color: '#000',
                    font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
                }
            },
            subtitle: {
                style: {
                    color: '#666666',
                    font: 'bold 12px "Trebuchet MS", Verdana, sans-serif'
                }
            },

            legend: {
                itemStyle: {
                    font: '9pt Trebuchet MS, Verdana, sans-serif',
                    color: 'black'
                },
                itemHoverStyle: {
                    color: 'gray'
                }
            }
        };

        // Apply the theme
        Highcharts.setOptions(theme);

        this.classificationBarChart = CreateCharts.getClassificationBarChart('threatClassification', true, 'Threat classification');
        this.geoLocationChart = CreateCharts.getGeoChart('geoGroups', 0, 'Threats according to source origin', true);
        this.asnChart = CreateCharts.getGeoChart('asnChart', 60, 'Autonomous Systems Number(ASN) counts', false);
        this.classificationTimeLineChart = CreateCharts.getClassificationTimeLine();
        this.ipBarChart = CreateCharts.getClassificationBarChart('ipChart', false, 'Threats by Each IP');
        this.networkHistChart = CreateCharts.getIpScatterChart();

        this.fetchPlotData();
    }

    isEmpty(obj: object): boolean {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }

    fetchPlotData() {
        if (this.user == null) {
            return;
        }
        const token = localStorage.getItem(environment.tokenKey);
        this.plotService.getPlots(this.user.id, token).subscribe(data => {
            if (data && data.token) {
                localStorage.setItem(environment.tokenKey, data.token);
            }
            if (data.error) {
                this.alertService.error(data.error);
            }else {
                const plots = JSON.parse(data.data);
                if (this.isEmpty(plots)) {
                    return;
                }

                for (const plot of plots) {
                    const key = plot.id;
                    this.plots[key] = plot[key];
                }

                this.classification_table = this.plots['classification_table'];
                this.classification_table_keys = Object.keys(this.plots['classification_table']);
                const kn = this.plots['attack_by_dates'];
                for (const k of Object.keys(kn)) {

                    const n = k.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('_')
                        .split('Attacks_')[1].replace(new RegExp('_', 'g'), ' ');

                    this.attack_by_dates.push([n, kn[k]]);
                }
                this.updateClassificationBarChart(this.plots['attack_by_type_bar_graph']);
                this.updateGeoPieChart(this.plots['attack_by_location']);
                this.updateAsnPieChart(this.plots['attack_by_asn']);
                this.updateClassTimeLineChart(this.plots['attack_by_type_date_series_graph']);
                this.updateIpChart(this.plots['attack_by_ip']);
                this.updateNetworkScatter(this.plots['attack_by_network']);
            }
        });
    }

    updateClassificationBarChart (data) {
        for (const key of Object.keys(data)) {
            this.classificationBarChart.addSeries({
                name: key,
                data: [data[key]]
            }, false, false);
            this.classificationBarChart.redraw(true);
        }
    }

    updateGeoPieChart (data) {
        const datum = [];
        for (const key of Object.keys(data)) {
            if (key === 'anonymous') {
                continue;
            }
            datum.push({name: key, y: data[key], drilldown: key});
        }
        this.geoLocationChart.series[0].setData(datum);
        this.geoLocationChart.redraw(true);
    }

    updateAsnPieChart (data) {
        const datum = [];
        for (const key of Object.keys(data)) {
            if (key === '0.0') {
                continue;
            }
            datum.push({name: key, y: data[key], drilldown: key});
        }
        this.asnChart.series[0].setData(datum);
        this.asnChart.redraw(true);
    }

    updateClassTimeLineChart (data) {
        const seriesData = [];
        for (const key of Object.keys(data)) {
            const series = {};
            const dat = [];
            const times = data[key];
            for (const key1 of Object.keys(times)) {
                dat.push([Date.parse(key1), times[key1]]);
            }
            dat.sort((a, b) => {
                const keyA = a[0], keyB = b[0];
                // Compare the 2 dates
                if (keyA < keyB) { return -1; }
                if (keyA > keyB) { return 1; }
                return 0;
            });

            series['name'] = key;
            series['data'] = dat;
            seriesData.push(series);
            this.classificationTimeLineChart.addSeries(series);
        }
    }

    updateIpChart (data) {
        let sortable = [];
        for (const key of Object.keys(data)) {
            if (key === '0.0.0.0') {
                continue;
            }
            sortable.push([key, data[key]]);
        }
        sortable = sortable.sort((a, b) => {
            const keyA = a[1], keyB = b[1];
            // Compare the 2 values
            if (keyA < keyB) { return -1; }
            if (keyA > keyB) { return 1; }
            return 0;
        }).reverse();

        for (let i = 0; i < sortable.slice(0, 20).length; i++) {
            const d = sortable[i];
            this.ipBarChart.addSeries({
                name: d[0],
                data: [d[1]]
            }, false, false);
            this.ipBarChart.redraw(true);
        }
    }

    updateNetworkScatter(data) {
        const sortable = [];
        for (const key of Object.keys(data)) {
            if (key === '0.0.0.0/0') {
                continue;
            }
            sortable.push([CreateCharts.net2num(key), data[key]]);
        }
        this.networkHistChart.series[0].setData(sortable);
        this.networkHistChart.redraw(true);
    }


}
