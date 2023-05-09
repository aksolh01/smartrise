import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NbThemeService } from '@nebular/theme';
import { ScreenBreakpoint } from '../../../../_shared/models/screenBreakpoint';
import { ResponsiveService } from '../../../../services/responsive.service';

@Component({
  selector: 'ngx-alerts-per-parttype-pie-chart',
  templateUrl: './alerts-per-parttype-pie-chart.component.html',
  styleUrls: ['./alerts-per-parttype-pie-chart.component.scss'],
})
export class AlertsPerPartTypePieChartComponent implements AfterViewInit, OnDestroy {
  options: any = {};
  themeSubscription: any;
  legendOrientation: string;
  left = '62%';
  top = '50%';
  config: any;

  constructor(private theme: NbThemeService, private router: Router, private responsiveService: ResponsiveService) {
  }

  ngAfterViewInit() {

    this.responsiveService.currentBreakpoint$.subscribe(w => {
      if (w === ScreenBreakpoint.lg || w === ScreenBreakpoint.xl) {
        this.legendOrientation = 'vertical';
        this.left = '62%';
        this.top = '50%';
      } else if (w === ScreenBreakpoint.md || w === ScreenBreakpoint.xs || w === ScreenBreakpoint.sm) {
        this.legendOrientation = 'horizontal';
        this.top = '60%';
        this.left = '50%';
      }
      if (this.config !== undefined) {
this.initilizeChart(this.config);
}
    });

    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      this.config = config;
      this.initilizeChart(config);
    });
  }

  initilizeChart(config) {
    const echarts: any = config.variables.echarts;

    this.options = {
      backgroundColor: echarts.bg,
      // color: [
      //   '#fff100',
      //   '#ff8c00',
      //   '#e81123',
      //   '#ec008c',
      //   '#68217a',
      //   '#00188f',
      //   '#00bcf2',
      //   '#00b294',
      //   '#009e49',
      //   '#bad80a',
      //   '#b8860b',
      // ],
      grid: {
        left: '15%',
        right: '0%',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} {b}<br/> {c} ({d}%)',
      },
      legend: {
        orient: this.legendOrientation,
        left: 'left',
        data: [
          'Contactor',
          'Braker',
          'Door Lock',
          'Relay',
          'Regen',
          'Guide Shoes',
          'Closed Contacts',
          'Gate switch',
          'Door restrictor',
          'CC lamps',
          'Others'
        ],
        textStyle: {
          color: echarts.textColor,
        },
      },
      series: [
        {
          name: 'Part Type:',
          type: 'pie',
          radius: '80%',
          center: [this.left, this.top],
          data: [
            { value: 250, name: 'Contactor' },
            { value: 1000, name: 'Braker' },
            { value: 500, name: 'Door Lock' },
            { value: 620, name: 'Relay' },
            { value: 2445, name: 'Regen' },
            { value: 300, name: 'Guide Shoes' },
            { value: 856, name: 'Closed Contacts' },
            { value: 455, name: 'Gate switch' },
            { value: 124, name: 'Door restrictor' },
            { value: 200, name: 'CC lamps' },
            { value: 1244, name: 'Others' },
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
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

  onViewAllMyParts() {
    this.router.navigateByUrl('pages/predictive-maintenance/parts-review');
  }
}
