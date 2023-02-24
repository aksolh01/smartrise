import { Component, OnInit, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { ResponsiveService } from '../../../../services/responsive.service';
import { AlertStatus } from '../../../../_shared/models/alertStatus';
import { ScreenBreakpoint } from '../../../../_shared/models/screenBreakpoint';

@Component({
  selector: 'ngx-usa-jobs-map',
  templateUrl: './usa-jobs-map.component.html',
  styleUrls: ['./usa-jobs-map.component.scss'],
})
export class UsaJobsMapComponent implements OnInit {
  @ViewChild('map') map: any;
  // @ViewChild(GoogleMap, { static: false }) map: GoogleMap
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;

  normalMarkers = [];
  offlineMarkers = [];
  needAttentionMarkers = [];
  atFaultMarkers = [];

  latitude = 37.0902;
  longitude = 95.7129;
  markers = [];
  wOptions = {};
  infoContent = {
    jobName: '',
    jobNumber: '',
    alertsCount: 22,
    status: AlertStatus.Alarm,
  };
  zoom = 3;
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: false,
    disableDoubleClickZoom: false,
    maxZoom: 15,
    minZoom: 3,
  };
  legendInFullScreen = false;
  mapWidth = '440px';
  mapHeight = '420px';

  constructor(private responsiveService: ResponsiveService) {}

  ngOnInit() {
    this.center = {
      lat: 38.575764,
      lng: -121.478851,
    };
    this.addMarker();
    const width = this.responsiveService.screenWidth;

    if ((width >= 576 && width < 768) || width < 576) {
      const mW = width * 0.82;
      this.mapWidth = mW.toString() + 'px';
      this.mapHeight = this.responsiveService.screenWidth.toString() + 'px';
    }
    this.responsiveService.currentBreakpoint$.subscribe((w) => {
      if (w === ScreenBreakpoint.xs || w === ScreenBreakpoint.sm) {
        const mW = this.responsiveService.screenWidth * 0.82;
        this.mapWidth = mW.toString() + 'px';
        this.mapHeight = this.responsiveService.screenWidth.toString() + 'px';
      } else {
        this.mapWidth = '440px';
        this.mapHeight = '400px';
      }
    });
  }

  onBoundsChanged() {
    const heightEqualToWindowHeight =
      this.map.googleMap.getDiv().children[0].clientHeight ===
      window.innerHeight;
    const widthEqualToWindowWidth =
      this.map.googleMap.getDiv().children[0].clientWidth === window.innerWidth;

    if (heightEqualToWindowHeight && widthEqualToWindowWidth) {
      this.legendInFullScreen = true;
    } else {
      this.legendInFullScreen = false;
    }
  }

  addMarker() {
    this.markers.push({
      info: {
        jobName: '867 53rd St_V2',
        jobNumber: '210311-011',
        alertsCount: 12,
        status: AlertStatus.Alarm,
      },
      position: {
        lat: this.center.lat,
        lng: this.center.lng,
      },
      options: {
        icon: 'assets/images/orange-pinpoint.png',
      },
    });
    this.markers.push({
      info: {
        jobName: '173 W Berks',
        jobNumber: '209-556790',
        alertsCount: 3,
        status: AlertStatus.Fault,
      },
      position: {
        lat: this.center.lat + 3,
        lng: this.center.lng + 3,
      },
      options: {
        icon: 'assets/images/red-pinpoint.png',
      },
    });
    this.markers.push({
      info: {
        jobName: '25 Holly St MRL',
        jobNumber: '210512-004',
        alertsCount: 1,
        status: AlertStatus.Normal,
      },
      position: {
        lat: this.center.lat + 3.3,
        lng: this.center.lng + 5.9,
      },
      options: {
        icon: 'assets/images/green-pinpoint.png',
      },
    });
    this.markers.push({
      info: {
        jobName: 'NPGS 232 (3-4)',
        jobNumber: '201021-017',
        alertsCount: 14,
        status: AlertStatus.Alarm,
      },
      position: {
        lat: this.center.lat + 2.3,
        lng: this.center.lng + 5.1,
      },
      options: {
        icon: 'assets/images/orange-pinpoint.png',
      },
    });
    this.markers.push({
      info: {
        jobName: 'Perelman Cntr E1, E2',
        jobNumber: '210428-006',
        alertsCount: 4,
        status: AlertStatus.Normal,
      },
      position: {
        lat: this.center.lat + 4,
        lng: this.center.lng + 6,
      },
      options: {
        icon: 'assets/images/green-pinpoint.png',
      },
    });
    this.markers.push({
      info: {
        jobName: 'Phila Club',
        jobNumber: '210430-004',
        alertsCount: 10,
        status: AlertStatus.Fault,
      },
      position: {
        lat: this.center.lat + 4.4,
        lng: this.center.lng + 6.7,
      },
      options: {
        icon: 'assets/images/red-pinpoint.png',
      },
    });
    this.markers.push({
      info: {
        jobName: '1440 Montgomery',
        jobNumber: '210402-003',
        alertsCount: 11,
        status: AlertStatus.Normal,
      },
      position: {
        lat: this.center.lat - 6,
        lng: this.center.lng + 6.7,
      },
      options: {
        icon: 'assets/images/green-pinpoint.png',
      },
    });
    this.markers.push({
      info: {
        jobName: '31-18 31st Street',
        jobNumber: '210430-005',
        alertsCount: 22,
        status: AlertStatus.Fault,
      },
      position: {
        lat: this.center.lat - 1,
        lng: this.center.lng + 12.7,
      },
      options: {
        icon: 'assets/images/red-pinpoint.png',
      },
    });
    this.markers.push({
      info: {
        jobName: '150 Disco Road A',
        jobNumber: '210512-001',
        alertsCount: 13,
        status: AlertStatus.Normal,
      },
      position: {
        lat: this.center.lat + 2,
        lng: this.center.lng + 14.8,
      },
      options: {
        icon: 'assets/images/green-pinpoint.png',
      },
    });
    this.markers.push({
      info: {
        jobName: '920 W. Lawrence',
        jobNumber: '210326-006',
        alertsCount: 44,
        status: AlertStatus.Fault,
      },
      position: {
        lat: this.center.lat + 2,
        lng: this.center.lng + 19.8,
      },
      options: {
        icon: 'assets/images/red-pinpoint.png',
      },
    });
    this.markers.push({
      info: {
        jobName: '1755 E 55th',
        jobNumber: '201202-006',
        alertsCount: 16,
        status: AlertStatus.Fault,
      },
      position: {
        lat: this.center.lat + 3.2,
        lng: this.center.lng + 19.2,
      },
      options: {
        icon: 'assets/images/red-pinpoint.png',
      },
    });
    this.markers.push({
      info: {
        jobName: '360 W Pleasant View',
        jobNumber: '210511-008',
        alertsCount: 16,
        status: AlertStatus.Fault,
      },
      position: {
        lat: this.center.lat + 4.2,
        lng: this.center.lng + 23.3,
      },
      options: {
        icon: 'assets/images/red-pinpoint.png',
      },
    });
    this.markers.push({
      info: {
        jobName: '30-77 Vernon B',
        jobNumber: '210310-009',
        alertsCount: 16,
        status: AlertStatus.Fault,
      },
      position: {
        lat: this.center.lat + 5.2,
        lng: this.center.lng + 20.25,
      },
      options: {
        icon: 'assets/images/red-pinpoint.png',
      },
    });
    this.markers.push({
      info: {
        jobName: 'NYU Weissman',
        jobNumber: '200220-003',
        alertsCount: 19,
        status: AlertStatus.Offline,
      },
      position: {
        lat: this.center.lat + 6.2,
        lng: this.center.lng + 28.25,
      },
      options: {
        icon: 'assets/images/gray-pinpoint.png',
      },
    });
    this.markers.push({
      info: {
        jobName: 'Eli Lilly Bldg 1 PE',
        jobNumber: '210315-010',
        alertsCount: 19,
        status: AlertStatus.Offline,
      },
      position: {
        lat: this.center.lat - 2.2,
        lng: this.center.lng + 27.2,
      },
      options: {
        icon: 'assets/images/gray-pinpoint.png',
      },
    });
    this.markers.push({
      info: {
        jobName: '20 Harding Blvd',
        jobNumber: '210112-008',
        alertsCount: 19,
        status: AlertStatus.Normal,
      },
      position: {
        lat: this.center.lat - 5.2,
        lng: this.center.lng + 29.8,
      },
      options: {
        icon: 'assets/images/green-pinpoint.png',
      },
    });
    this.markers.push({
      info: {
        jobName: 'Westin Southlake T',
        jobNumber: '201130-013',
        alertsCount: 19,
        status: AlertStatus.Fault,
      },
      position: {
        lat: this.center.lat - 6.1,
        lng: this.center.lng + 27,
      },
      options: {
        icon: 'assets/images/red-pinpoint.png',
      },
    });
    this.markers.push({
      info: {
        jobName: '501 Yonge St 1-5',
        jobNumber: '190226-009',
        alertsCount: 11,
        status: AlertStatus.Fault,
      },
      position: {
        lat: this.center.lat - 6.1,
        lng: this.center.lng + 33.698,
      },
      options: {
        icon: 'assets/images/red-pinpoint.png',
      },
    });
    this.markers.push({
      info: {
        jobName: '385 Tremont Ave 1-4',
        jobNumber: '200831-002',
        alertsCount: 11,
        status: AlertStatus.Fault,
      },
      position: {
        lat: this.center.lat + 4.8,
        lng: this.center.lng + 33,
      },
      options: {
        icon: 'assets/images/red-pinpoint.png',
      },
    });

    this.markers.forEach((element) => {
      if (element.info.status === AlertStatus.Normal) {
        this.normalMarkers.push(element);
      }
      if (element.info.status === AlertStatus.Alarm) {
        this.needAttentionMarkers.push(element);
      }
      if (element.info.status === AlertStatus.Fault) {
        this.atFaultMarkers.push(element);
      }
      if (element.info.status === AlertStatus.Offline) {
        this.offlineMarkers.push(element);
      }
    });
  }

  openInfo(marker: MapMarker, content) {
    this.infoContent = content;
    this.infoWindow.open(marker);
  }

  closeInfo() {
    this.infoWindow.close();
  }

  closeWindow() {
    this.infoWindow.close();
  }

  onLegendClicked(event) {
    if (event.remove) {
      const filteredMarkers = [];
      this.markers.forEach((m: any) => {
        if (m.info.status === event.name) {
          filteredMarkers.push(m);
        }
      });
      filteredMarkers.forEach((m) => {
        const i = this.markers.indexOf(m);
        this.markers.splice(i, 1);
      });
    } else {
      let array = [];
      if (event.name === AlertStatus.Normal) {
        array = this.normalMarkers;
      }
      if (event.name === AlertStatus.Alarm) {
        array = this.needAttentionMarkers;
      }
      if (event.name === AlertStatus.Fault) {
        array = this.atFaultMarkers;
      }
      if (event.name === AlertStatus.Offline) {
        array = this.offlineMarkers;
      }

      array.forEach((element) => {
        this.markers.push(element);
      });
    }
  }
}

export interface IWondowInfoContent {
  jobName: string;
  jobNumber: string;
  alertsCount: number;
}
