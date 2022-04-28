var rp = require('request-promise');
var Highcharts = require('highcharts-solid-gauge');


var gaugeOptions = {
    chart: {
        type: 'solidgauge'
    },

    title: null,

    pane: {
        center: ['50%', '85%'],
        size: '140%',
        startAngle: -90,
        endAngle: 90,
        background: {
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc'
        }
    },

    exporting: {
        enabled: false
    },

    tooltip: {
        enabled: false
    },

    // the value axis
    yAxis: {
        stops: [
            [0.1, '#55BF3B'], // green
            [0.5, '#DDDF0D'], // yellow
            [0.9, '#DF5353'] // red
        ],
        lineWidth: 0,
        tickWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,
        title: {
            y: -70
        },
        labels: {
            y: 16
        }
    },

    plotOptions: {
        solidgauge: {
            dataLabels: {
                y: 5,
                borderWidth: 0,
                useHTML: true
            }
        }
    }
};

// The speed gauge
var chartSpeed = Highcharts.chart('voltg', Highcharts.merge(gaugeOptions, {
    yAxis: {
        min: 0,
        max: 5,
        title: {
            text: 'Voltage'
        }
    },

    credits: {
        enabled: false
    },

    series: [{
        name: 'Volt',
        data: [80],
        dataLabels: {
            format:
                '<div style="text-align:center">' +
                '<span style="font-size:25px">{y}</span><br/>' +
                '<span style="font-size:12px;opacity:0.4">km/h</span>' +
                '</div>'
        },
        tooltip: {
            valueSuffix: ' V'
        }
    }]

}));

// The RPM gauge
var chartRpm = Highcharts.chart('percentg', Highcharts.merge(gaugeOptions, {
    yAxis: {
        min: 0,
        max: 100,
        title: {
            text: 'Percentage'
        }
    },

    series: [{
        name: 'Percent',
        data: [1],
        dataLabels: {
            format:
                '<div style="text-align:center">' +
                '<span style="font-size:25px">{y:.1f}</span><br/>' +
                '<span style="font-size:12px;opacity:0.4">' +
                '* 1000 / min' +
                '</span>' +
                '</div>'
        },
        tooltip: {
            valueSuffix: ' %'
        }
    }]

}));

// Bring life to the dials
setInterval(function () {
    // Speed
    var point,
        newVal,
        inc;

    if (chartSpeed) {
        point = chartSpeed.series[0].points[0];
        var options = {
            method: 'GET',
            uri: 'https://io.adafruit.com/api/v2/kaveesh2001/feeds/voltage',
            json: true,
          };
    
          rp(options)
            .then((parseBody) => {
        inc = parseFloat(parseBody.last_value);
        newVal = point.y + inc;
            })
        if (newVal < 0 || newVal > 5) {
            newVal = point.y - inc;
        }

        point.update(newVal);
    }

    // RPM
    if (chartRpm) {
        point = chartRpm.series[0].points[0];
        var options = {
            method: 'GET',
            uri: 'https://io.adafruit.com/api/v2/kaveesh2001/feeds/percent',
            json: true,
          };
    
          rp(options)
            .then((parseBody) => {
        inc = parseFloat(parseBody.last_value);
        newVal = point.y + inc;
            })
        if (newVal < 0 || newVal > 100) {
            newVal = point.y - inc;
        }

        point.update(newVal);
    }
}, 1000);