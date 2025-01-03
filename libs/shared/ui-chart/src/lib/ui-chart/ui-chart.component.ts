import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsDrilldown from 'highcharts/modules/drilldown';

@Component({
  selector: 'lib-ui-chart',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './ui-chart.component.html',
  styleUrl: './ui-chart.component.scss'
})
export class UiChartComponent {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  temperature2021 = [
    { name: 'Jan', y: 7.0, drilldown: 'jan-2021' },
    { name: 'Feb', y: 6.9, drilldown: 'jan-2021', color: 'gray' },
    { name: 'Mar', y: 9.5, drilldown: 'jan-2021' },
    { name: 'Apr', y: 14.5, drilldown: 'jan-2021' },
    { name: 'May', y: 18.2, drilldown: 'jan-2021' },
    { name: 'Jun', y: 21.5, drilldown: 'jan-2021' },
    { name: 'Jul', y: 25.2, drilldown: 'jan-2021' },
    { name: 'Aug', y: 26.5, drilldown: 'jan-2021' },
    { name: 'Sep', y: 23.3, drilldown: 'jan-2021' },
    { name: 'Oct', y: 18.3, drilldown: 'jan-2021' },
    { name: 'Nov', y: 13.9, drilldown: 'jan-2021' },
    { name: 'Dec', y: 9.6, drilldown: 'jan-2021' }
  ];

  temperature2022 = [
    { name: 'Jan', y: 0.2, drilldown: 'jan-2022' },
    { name: 'Feb', y: 0.8, drilldown: 'jan-2022' },
    { name: 'Mar', y: 5.7, drilldown: 'jan-2022' },
    { name: 'Apr', y: 8.8, drilldown: 'jan-2022' },
    { name: 'May', y: 13.9, drilldown: 'jan-2022' },
    { name: 'Jun', y: 19.8, drilldown: 'jan-2022' },
    { name: 'Jul', y: 22.2, drilldown: 'jan-2022' },
    { name: 'Aug', y: 25.6, drilldown: 'jan-2022' },
    { name: 'Sep', y: 27.3, drilldown: 'jan-2022' },
    { name: 'Oct', y: 24.5, drilldown: 'jan-2022' },
    { name: 'Nov', y: 19.8, drilldown: 'jan-2022' },
    { name: 'Dec', y: 14.9, drilldown: 'jan-2022' }
  ];

  delta = this.temperature2022.map((value, index) => ({
    name: value.name,
    low: this.temperature2021[index].y,
    high: value.y,
    drilldown: 'jan-delta'
  }));
  average = this.temperature2022.map((value, index) => ({
    y: (this.temperature2021[index].y + value.y) / 2,
    name: value.name,
    drilldown: 'jan-average'
  }));

  drilldown: Highcharts.DrilldownOptions = {
    allowPointDrilldown: false,
    series: [
      {
        id: 'jan-2021',
        name: 'jan 2021',
        type: 'column',
        data: [
          ['East', 4],
          ['West', 2],
          ['North', 1],
          ['South', 4]
        ]
      },
      {
        id: 'jan-2022',
        name: 'jan 2022',
        type: 'column',
        data: [
          ['East', 6],
          ['West', 2],
          ['North', 2],
          ['South', 4]
        ]
      },
      {
        id: 'jan-empty',
        name: 'jan empty',
        type: 'column',
        data: []
      },
      {
        id: 'jan-delta',
        name: 'jan delta',
        type: 'errorbar',
        data: [
          [1, 6],
          [1, 2],
          [1, 2],
          [1, 4]
        ]
      },
      {
        id: 'jan-average',
        name: 'jan average',
        type: 'scatter',
        data: [2, 3, 4, 5],
        pointPlacement: 0.2
      } as any
    ]
  };

  constructor() {
    setTimeout(() => {
      console.log(HighchartsMore, HighchartsDrilldown);
      // HighchartsMore.factory(Highcharts);
    }, 1000);
  }

  ngOnInit(): void {
    this.chartOptions = {
      title: {
        text: 'monthly average temperature'
      },
      chart: {
        events: {
          drilldown: e => {
            console.log(e);
            const chart = this.Highcharts.charts[0]!;
            // setTimeout(() => {
            //   chart.update({
            //     plotOptions: {
            //       scatter: {
            //         color: 'green',
            //         pointStart: undefined
            //       }
            //     },
            //     drilldown: this.drilldown
            //   });

            //   chart.redraw();
            // });

            if (!e.seriesOptions) {
              const month = e.point.name;

              // chart.update({
              //   series: [
              //     {
              //       name: month + ' Weekly Temperatures',
              //       id: month,
              //       type: 'column',
              //       data: [
              //         { name: 'Week 1', y: 21, x: 0 },
              //         { name: 'Week 2', y: 22, x: 1 },
              //         { name: 'Week 3', y: 20, x: 2 },
              //         { name: 'Week 4', y: 23, x: 3 }
              //       ]
              //     },
              //     {
              //       name: 'Average ' + month,
              //       id: 'avg' + month,
              //       type: 'scatter',
              //       data: [
              //         { y: 21, name: 'Average', x: 0 },
              //         { y: 21, name: 'Average', x: 1 },
              //         { y: 21, name: 'Average', x: 2 },
              //         { y: 21, name: 'Average', x: 3 }
              //       ],
              //       marker: {
              //         radius: 8,
              //         fillColor: '#FF0000'
              //       }
              //     }
              //   ]
              // });
              // this.drilldown.series?.forEach(series => {
              //   chart.addSeriesAsDrilldown(e.point, series);
              // });

              // chart.addSeriesAsDrilldown(e.point, {
              //   name: 'Average ' + month,
              //   id: 'avg' + month,
              //   type: 'scatter',
              //   data: [
              //     { y: 21, name: 'Average', x: 0 },
              //     { y: 10, name: 'Average', x: 1 },
              //     { y: 30, name: 'Average', x: 2 },
              //     { y: 15, name: 'Average', x: 3 }
              //   ],
              //   marker: {
              //     radius: 8,
              //     fillColor: '#FF0000'
              //   }
              // });
            }
          }
        }
      },

      subtitle: {
        text: 'Source: WorldClimate.com'
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        title: {
          text: 'Temperature ( oC)'
        }
      },
      tooltip: {
        shared: true
      },
      plotOptions: {
        scatter: {
          color: 'red'
          // pointStart: 0.2,
          // pointPlacement: 0.2
        },
        errorbar: {},
        column: {}
      },
      series: [
        {
          name: '2021',
          type: 'column',
          data: this.temperature2021
        },
        {
          name: '2022',
          type: 'column',
          data: this.temperature2022
        },
        {
          name: 'empty',
          type: 'column',
          showInLegend: false,
          data: [{ drilldown: 'jan-empty' }]
        },
        {
          name: 'Delta',
          type: 'errorbar',
          showInLegend: true,
          data: this.delta
        },
        {
          name: 'Average',
          type: 'scatter',
          showInLegend: true,
          data: this.average,
          pointPlacement: 0.2
        } as any
      ],
      drilldown: this.drilldown
    };
  }
}
