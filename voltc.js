var rp = require('request-promise');
var Highcharts = require('highcharts');

      var options = {
        method: 'GET',
        uri: 'https://io.adafruit.com/api/v2/kaveesh2001/feeds/voltage',
        json: true,
      };

      rp(options)
        .then((parseBody) => {

    // Create the chart    
    Highcharts.chart('voltc', {
      chart: {
          type: 'spline',
          animation: Highcharts.svg, // don't animate in old IE
          marginRight: 10,
          events: {
              load: function () {
  
                  // set up the updating of the chart each second
                  var series = this.series[0];
                  setInterval(function () {
                    var options = {
                      method: 'GET',
                      uri: 'https://io.adafruit.com/api/v2/kaveesh2001/feeds/voltage',
                      json: true,
                    };
              
                    rp(options)
                      .then((parseBody) => {
                      var x = (new Date()).getTime(), // current time
                          y = parseFloat(parseBody.last_value);
                      series.addPoint([x, y], true, true);
                  })}, 5000);
              }
          }
      },
  
      time: {
          useUTC: false
      },
  
      title: {
          text: 'Voltage'
      },
  
      accessibility: {
          announceNewData: {
              enabled: true,
              minAnnounceInterval: 15000,
              announcementFormatter: function (allSeries, newSeries, newPoint) {
                  if (newPoint) {
                      return 'New point added. Value: ' + newPoint.y;
                  }
                  return false;
              }
          }
      },
  
      xAxis: {
          type: 'datetime',
          tickPixelInterval: 150
      },
  
      yAxis: {
          title: {
              text: 'Volt (V)'
          },
          plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
          }]
      },
  
      tooltip: {
          headerFormat: '<b>{series.name}</b><br/>',
          pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}'
      },
  
      legend: {
          enabled: false
      },
  
      exporting: {
          enabled: false
      },
  
      series: [{
          name: 'Voltage',
          data: (function () {
              // generate an array of random data
              var data = [],
                  time = (new Date()).getTime(),
                  i;
  
              for (i = -19; i <= 0; i += 1) {
                  data.push({
                      x: time + i * 1000,
                      y: parseFloat(parseBody.last_value)
                  });
              }
              return data;
          }())
      }]
  });
        
  });
