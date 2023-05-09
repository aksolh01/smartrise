import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'ngx-alerts-versus-time-line-chart',
  templateUrl: './alerts-versus-time-line-chart.component.html',
  styleUrls: ['./alerts-versus-time-line-chart.component.scss']
})
export class AlertsVersusTimeLineChartComponent implements AfterViewInit, OnDestroy {
  options: any = {};
  themeSubscription: any;

  constructor(private theme: NbThemeService) {
  }

  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const echarts: any = config.variables.echarts;

      this.options = {
        backgroundColor: echarts.bg,
        color: [
          'red',
          '#ed7d31',
          '#ffc000'
        ],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}',
        },
        legend: {
          left: 'left',
          data: ['Critical', 'High', 'Medium'],
          textStyle: {
            color: echarts.textColor,
          },
        },
        xAxis: [
          {
            name: 'Days',
            type: 'category',
            data:
            [
              '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
              '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
              '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'
            ],
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        yAxis: [
          {
            name: 'Alerts',
            type: 'log',
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            splitLine: {
              lineStyle: {
                color: echarts.splitLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        grid: {
          left: '0%',
          right: '10%',
          bottom: '3%',
          containLabel: true,
        },
        series: [
          {
            name: 'Critical',
            type: 'line',
            data: [
              23, 45, 69, 55, 81, 21, 120, 103, 93, 56,
              88, 103, 100, 87, 81, 55, 102, 100, 96, 100,
              76, 77, 60, 55, 70, 63, 58, 52, 43, 12,
            ],
            smooth: true,
          },
          {
            name: 'High',
            type: 'line',
            data: [
              12, 11, 25, 45, 78, 76, 100, 108, 110, 99,
              93, 77, 60, 55, 50, 33, 41, 48, 55, 73,
              76, 79, 81, 85, 89, 93, 90, 70, 66, 22,
            ],
            smooth: true,
          },
          {
            name: 'Medium',
            type: 'line',
            data: [
              34, 36, 39, 41, 44, 49, 51, 59, 72, 93,
              96, 102, 96, 87, 77, 64, 50, 48, 68, 79,
              71, 73, 79, 60, 65, 50, 45, 44, 40, 30,
            ],
            smooth: true,
          },
        ],
      };
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
  }
}
