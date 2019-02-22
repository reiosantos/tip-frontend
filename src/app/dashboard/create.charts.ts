import * as Highcharts from 'highcharts';

export class CreateCharts {

    static getClassificationBarChart(section_id: string, has_legend: boolean, title: string) {

        return Highcharts.chart(section_id, {
            chart: {
                type: 'bar',
                zoomType: 'xy'
            },
            title: {
                text: title
            },
            subtitle: {
                text: 'grouped'
            },
            xAxis: {
                categories: ['Threats'],
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Count',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                }
            },
            tooltip: {
                valueSuffix: ' '
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -40,
                y: 80,
                enabled: has_legend,
                floating: true,
                borderWidth: 1,
                shadow: true
            },
            credits: {
                enabled: false
            },
            series: []
        });
    }

    static getGeoChart(section_id: string, innerRadius: number, title: string, has_legend: boolean) {

        return Highcharts.chart(section_id, {
            chart: {
                type: 'pie',
                plotShadow: true
            },
            title: {
                text: title
            },
            subtitle: {
                text: null
            },
            legend: {
                enabled: has_legend,
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}: {point.y:.1f}%'
                    }
                },
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    innerSize: innerRadius.toString() + '%',
                    dataLabels: {
                        enabled: true
                    },
                    showInLegend: true
                }
            },

            tooltip: {
                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
            },

            series: [
                {
                    'name': 'Countries',
                    'data': []
                }
            ]
        });
    }

    static getClassificationTimeLine() {

        return Highcharts.chart('classificationTimeLine', {
            chart: {
                type: 'spline',
                zoomType: 'xy'
            },
            title: {
                text: 'Time of happening'
            },
            subtitle: {
                text: 'Irregular time data'
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    month: '%e. %b',
                    year: '%b'
                },
                title: {
                    text: 'Date'
                }
            },
            yAxis: {
                title: {
                    text: 'attempts'
                },
                min: 0
            },
            tooltip: {
                headerFormat: '<b>{series.name}</b><br>',
                pointFormat: '{point.x:%e. %b}: {point.y:.2f} attempts'
            },

            plotOptions: {
                spline: {
                    marker: {
                        enabled: true
                    }
                }
            },

            colors: ['#6CF', '#39F', '#06C', '#036', '#000'],

            series: []
        });
    }

    static getIpScatterChart() {

        return Highcharts.chart('scatterChart', {
            chart: {
                type: 'scatter',
                zoomType: 'xy'
            },
            title: {
                text: 'Most suspicious networks'
            },
            subtitle: {
                text: 'with count values'
            },
            xAxis: {
                title: {
                    // enabled: true,
                    text: 'IPs'
                },
                startOnTick: true,
                endOnTick: true,
                showLastLabel: true
            },
            yAxis: {
                title: {
                    text: 'Count'
                }
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'top',
                x: 100,
                y: 70,
                floating: true,
                borderWidth: 1
            },
            plotOptions: {
                scatter: {
                    marker: {
                        radius: 5,
                        states: {
                            hover: {
                                enabled: true,
                                lineColor: 'rgb(100,100,100)'
                            }
                        }
                    },
                    states: {
                        hover: {
                            marker: {
                                enabled: false
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '<b>{series.name}</b><br>',
                        pointFormatter: function() {
                            return CreateCharts.num2net(this.x) + ' , ' + this.y;
                        }
                    }
                }
            },
            series: [{
                name: 'Network',
                color: 'rgba(223, 83, 83, .5)',
                data: []
            }]
        });
    }

    static ip2num(ip) {
        const addr = ip.split('.');
        if ( addr.length !== 4 || addr.some( (elm) => (parseInt(elm, 10) > 255 || parseInt(elm, 10) < 0 ) ) ) {
            throw new Error('Invalid ip4 string: ' + ip);
        }
        return  (+parseInt(addr[0], 10) << 24) + (+parseInt(addr[1], 10) << 16) +
            (+parseInt(addr[2], 10) << 8) + (+parseInt(addr[3], 10));
    }

    static num2ip(num) {
        return [num >> 24 & 0xff, num >> 16 & 0xff, num >> 8 & 0xff, num & 0xff].join('.');
    }

    static net2num(ip) {
        const addr = ip.split('.');
        const last = addr[3].split('/');

        if ( addr.length !== 4 || addr.some( (elm) => (parseInt(elm, 10) > 255 || parseInt(elm, 10) < 0 ) ) ) {
            throw new Error('Invalid ip4 string: ' + ip);
        }
        return  (+parseInt(addr[0], 10) << 24) + (+parseInt(addr[1], 10) << 16) +
            (+parseInt(addr[2], 10) << 8) + (+parseInt(last[0], 10)); // + (+parseInt(last[1], 10) << -8);
    }

    static num2net(num) {
        return [num >> 24 & 0xff, num >> 16 & 0xff, num >> 8 & 0xff, num & 0xff].join('.'); // + '/' + (num >> -8 & 0xff);
    }
}
