import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'ngx-alerts-per-job-pie-chart',
  template: './alerts-per-job-pie-chart.component.html',
  styleUrls: ['./alerts-per-job-pie-chart.component.scss'],
})

export class AlertsPerJobPieChartComponent implements AfterViewInit, OnDestroy {
  options: any = {};
  themeSubscription: any;

  constructor(private theme: NbThemeService) {
  }

  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        backgroundColor: echarts.bg,
        color: [
          colors.warningLight,
          colors.infoLight,
          colors.dangerLight,
          colors.successLight,
          colors.primaryLight
        ],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['Low', 'Medium', 'High', 'Critical'],
          textStyle: {
            color: echarts.textColor,
          },
        },
        series: [
          {
            name: 'Severity',
            type: 'pie',
            radius: '80%',
            center: ['50%', '50%'],
            data: [
              { value: 335, name: 'Low',  },
              { value: 310, name: 'Medium' },
              { value: 234, name: 'High' },
              { value: 135, name: 'Critical' },
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: echarts.itemHoverShadowColor,
              },
            },
            label: {
              position: 'inner',
              formatter: '{d}%'
              // normal: {
              //   textStyle: {
              //     color: echarts.textColor,
              //   },
              // },
            },
            labelLine: {
              show: false,
              // normal: {
              //   lineStyle: {
              //     color: echarts.axisLineColor,
              //   },
              // },
            },
          },
        ],
      };
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
  }
}
