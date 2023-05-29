import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Ng2TableCellComponent } from '../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { IAlertSettingsPartType } from '../../../_shared/models/alertSettingsPart';
import { AlertType } from '../../../_shared/models/alertType';
import { IAlarm } from '../../../_shared/models/alarm';
import { IVendor } from '../../../_shared/models/vendor';
import { Severity, ThresholdType } from '../../../_shared/models/predictiveMaintenanceEnums';
import { BaseComponent } from '../../base.component';
import { MapSeverityComponent } from '../map-severity/map-severity.component';
import { AlertsSettingsActionsComponent } from './alerts-settings-actions/alerts-settings-actions.component';
import { IAlertSetting } from '../../../_shared/models/alertSetting';
import { AlertSettingComponent } from '../alert-setting/alert-setting.component';
import { AlertSeverityCellComponent } from '../../../_shared/components/business/alert-severity.component';
import { ResponsiveService } from '../../../services/responsive.service';
import { ITextValueLookup } from '../../../_shared/models/text-value.lookup';
import { CpDateFilterComponent } from '../../../_shared/components/table-filters/cp-date-filter.component';
import { BaseServerDataSource } from '../../../_shared/datasources/base-server.datasource';
import { AlertService } from '../../../services/alert.service';
import { AlertSettingsParams } from '../../../_shared/models/alertSettingsParams';
import { CpListFilterComponent } from '../../../_shared/components/table-filters/cp-list-filter.component';
import { ScreenBreakpoint } from '../../../_shared/models/screenBreakpoint';
import { BaseComponentService } from '../../../services/base-component.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'ngx-alerts-settings',
  templateUrl: './alerts-settings.component.html',
  styleUrls: ['./alerts-settings.component.scss']
})
export class AlertsSettingsComponent extends BaseComponent implements OnInit {

  name: string;
  severity?: Severity;
  type?: AlertType;
  createdDate?: Date;
  modifiedDate?: Date;
  totalAlerts?: number;

  severities: ITextValueLookup[] = [];

  isSmall = false;
  showFilters = false;
  canCreateAlertSetting = true;
  partTypes: IAlertSettingsPartType[] = [];
  thresholdTypes = [];
  possiblePartTypes: IAlertSettingsPartType[] = [];
  vendors: IVendor[] = [];
  alertTypes = [];
  faults = [];
  alarms: IAlarm[] = [
    {
      code: '0',
      description: 'No Alarm',
      correctiveAction: 'NA',
    },
    {
      code: '1',
      description: 'NTS point 1 has been tripped in the up direction for the normal motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '2',
      description: 'NTS point 2 has been tripped in the up direction for the normal motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '3',
      description: 'NTS point 3 has been tripped in the up direction for the normal motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '4',
      description: 'NTS point 4 has been tripped in the up direction for the normal motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '5',
      description: 'NTS point 5 has been tripped in the up direction for the normal motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '6',
      description: 'NTS point 6 has been tripped in the up direction for the normal motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '7',
      description: 'NTS point 7 has been tripped in the up direction for the normal motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '8',
      description: 'NTS point 8 has been tripped in the up direction for the normal motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '9',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '10',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '11',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '12',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '13',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '14',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '15',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '16',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '17',
      description: 'NTS point 1 has been tripped in the up direction for the E-Power motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '18',
      description: 'NTS point 2 has been tripped in the up direction for the E-Power motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '19',
      description: 'NTS point 3 has been tripped in the up direction for the E-Power motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '20',
      description: 'NTS point 4 has been tripped in the up direction for the E-Power motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '21',
      description: 'NTS point 5 has been tripped in the up direction for the E-Power motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '22',
      description: 'NTS point 6 has been tripped in the up direction for the E-Power motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '23',
      description: 'NTS point 7 has been tripped in the up direction for the E-Power motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '24',
      description: 'NTS point 8 has been tripped in the up direction for the E-Power motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '25',
      description: 'NTS point 1 has been tripped in the up direction for the Short motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '26',
      description: 'NTS point 2 has been tripped in the up direction for the Short motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '27',
      description: 'NTS point 3 has been tripped in the up direction for the Short motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '28',
      description: 'NTS point 4 has been tripped in the up direction for the Short motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '29',
      description: 'NTS point 5 has been tripped in the up direction for the Short motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '30',
      description: 'NTS point 6 has been tripped in the up direction for the Short motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '31',
      description: 'NTS point 7 has been tripped in the up direction for the Short motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '32',
      description: 'NTS point 8 has been tripped in the up direction for the Short motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '33',
      description: 'NTS point 1 has been tripped in the down direction for the normal motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '34',
      description: 'NTS point 2 has been tripped in the down direction for the normal motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '35',
      description: 'NTS point 3 has been tripped in the down direction for the normal motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '36',
      description: 'NTS point 4 has been tripped in the down direction for the normal motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '37',
      description: 'NTS point 5 has been tripped in the down direction for the normal motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '38',
      description: 'NTS point 6 has been tripped in the down direction for the normal motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '39',
      description: 'NTS point 7 has been tripped in the down direction for the normal motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '40',
      description: 'NTS point 8 has been tripped in the down direction for the normal motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '41',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '42',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '43',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '44',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '45',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '46',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '47',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '48',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '49',
      description: 'NTS point 1 has been tripped in the down direction for the E-Power motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '50',
      description: 'NTS point 2 has been tripped in the down direction for the E-Power motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '51',
      description: 'NTS point 3 has been tripped in the down direction for the E-Power motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '52',
      description: 'NTS point 4 has been tripped in the down direction for the E-Power motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '53',
      description: 'NTS point 5 has been tripped in the down direction for the E-Power motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '54',
      description: 'NTS point 6 has been tripped in the down direction for the E-Power motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '55',
      description: 'NTS point 7 has been tripped in the down direction for the E-Power motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '56',
      description: 'NTS point 8 has been tripped in the down direction for the E-Power motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '57',
      description: 'NTS point 1 has been tripped in the down direction for the Short motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '58',
      description: 'NTS point 2 has been tripped in the down direction for the Short motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '59',
      description: 'NTS point 3 has been tripped in the down direction for the Short motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '60',
      description: 'NTS point 4 has been tripped in the down direction for the Short motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '61',
      description: 'NTS point 5 has been tripped in the down direction for the Short motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '62',
      description: 'NTS point 6 has been tripped in the down direction for the Short motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '63',
      description: 'NTS point 7 has been tripped in the down direction for the Short motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '64',
      description: 'NTS point 8 has been tripped in the down direction for the Short motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '65',
      description: 'Normal profile NTS points are not of increasing in position/speed value or a trip speed exceeds contract speed.',
      correctiveAction: 'Cycle power to the system or edit an S-Curve parameter to trigger a NTS point recalculation.',
    },
    {
      code: '66',
      description: 'Inspection profile NTS points are not of increasing in position/speed value or a trip speed exceeds contract speed.',
      correctiveAction: 'Cycle power to the system or edit an S-Curve parameter to trigger a NTS point recalculation.',
    },
    {
      code: '67',
      description: 'Emergency profile NTS points are not of increasing in position/speed value or a trip speed exceeds contract speed.',
      correctiveAction: 'Cycle power to the system or edit an S-Curve parameter to trigger a NTS point recalculation.',
    },
    {
      code: '68',
      description: 'Short profile NTS points are not of increasing in position/speed value or a trip speed exceeds contract speed.',
      correctiveAction: 'Cycle power to the system or edit an S-Curve parameter to trigger a NTS point recalculation.',
    },
    {
      code: '69',
      description:
        'When 01-150 is set to ON, this debugging alarm will signal when an ESTOP is commanded due to class of operation change.',
      correctiveAction: 'NA',
    },
    {
      code: '70',
      description: 'When 01-150 is set to ON, this debugging alarm will signal when an ESTOP is commanded due to run flag failing to drop.',
      correctiveAction: 'NA',
    },
    {
      code: '71',
      description: 'When 01-150 is set to ON, this debugging alarm will signal when an ESTOP is commanded due to failing to start a run.',
      correctiveAction: 'NA',
    },
    {
      code: '72',
      description: 'When 01-150 is set to ON, this debugging alarm will signal when an ESTOP is commanded due to invalid inspection mode.',
      correctiveAction: 'NA',
    },
    {
      code: '73',
      description: 'When 01-150 is set to ON, this debugging alarm will signal when an ESTOP is commanded due to invalid recall destination.',
      correctiveAction: 'NA',
    },
    {
      code: '74',
      description: 'When 01-130 is set to ON, this debugging alarm will signal when the car is commanded to stop at next available floor.',
      correctiveAction: 'NA',
    },
    {
      code: '75',
      description: 'When 01-150 is set to ON, this debugging alarm will signal when an ESTOP is during EQ operation.',
      correctiveAction: 'NA',
    },
    {
      code: '76',
      description: 'When 01-150 is set to ON, this debugging alarm will signal when an ESTOP is during flood operation.',
      correctiveAction: 'NA',
    },
    {
      code: '77',
      description: 'Car is stopped outside of a door zone.',
      correctiveAction: 'NA',
    },
    {
      code: '78',
      description: 'Car is performing releveling.',
      correctiveAction: 'NA',
    },
    {
      code: '79',
      description: 'Defaulting 1-bit parameters.',
      correctiveAction: 'NA',
    },
    {
      code: '80',
      description: 'Defaulting 8-bit parameters.',
      correctiveAction: 'NA',
    },
    {
      code: '81',
      description: 'Defaulting 16-bit parameters.',
      correctiveAction: 'NA',
    },
    {
      code: '82',
      description: 'Defaulting 24-bit parameters.',
      correctiveAction: 'NA',
    },
    {
      code: '83',
      description: 'Defaulting 32-bit parameters.',
      correctiveAction: 'NA',
    },
    {
      code: '84',
      description: 'Requested recall destination has an invalid door configuration.',
      correctiveAction: 'NA',
    },
    {
      code: '85',
      description: 'Requested recall destination is an invalid floor.',
      correctiveAction: 'NA',
    },
    {
      code: '86',
      description: 'Requested recall destination is not a valid opening.',
      correctiveAction: 'NA',
    },
    {
      code: '87',
      description: 'Processor has started up with watchdog disabled.',
      correctiveAction: 'Remove the WD jumper and restart the board to reenable.',
    },
    {
      code: '88',
      description: 'Processor has started up with watchdog disabled.',
      correctiveAction: 'Remove the WD jumper and restart the board to reenable.',
    },
    {
      code: '89',
      description: 'Processor has started up with watchdog disabled.',
      correctiveAction: 'Remove the WD jumper and restart the board to reenable.',
    },
    {
      code: '90',
      description: 'Processor has started up with watchdog disabled.',
      correctiveAction: 'Remove the WD jumper and restart the board to reenable.',
    },
    {
      code: '91',
      description: 'Processor has started up with watchdog disabled.',
      correctiveAction: 'Remove the WD jumper and restart the board to reenable.',
    },
    {
      code: '92',
      description: 'Processor has started up with watchdog disabled.',
      correctiveAction: 'Remove the WD jumper and restart the board to reenable.',
    },
    {
      code: '93',
      description: 'Machine room SRU CAN1 tranciever has self reset due to excessive bus errors.',
      correctiveAction: 'Verify bus wiring. If problem perists, remove boards from the network to isolate the board with the problem tranceiver.',
    },
    {
      code: '94',
      description: 'Machine room SRU CAN2 tranciever has self reset due to excessive bus errors.',
      correctiveAction: 'Verify bus wiring. If problem perists, remove boards from the network to isolate the board with the problem tranceiver.',
    },
    {
      code: '95',
      description: 'Machine room SRU CAN3 tranciever has self reset due to excessive bus errors.',
      correctiveAction: 'Verify bus wiring. If problem perists, remove boards from the network to isolate the board with the problem tranceiver.',
    },
    {
      code: '96',
      description: 'Machine room SRU CAN4 tranciever has self reset due to excessive bus errors.',
      correctiveAction: 'Verify bus wiring. If problem perists, remove boards from the network to isolate the board with the problem tranceiver.',
    },
    {
      code: '97',
      description: 'Car top SRU CAN1 tranciever has self reset due to excessive bus errors.',
      correctiveAction: 'Verify bus wiring. If problem perists, remove boards from the network to isolate the board with the problem tranceiver.',
    },
    {
      code: '98',
      description: 'Car top SRU CAN2 tranciever has self reset due to excessive bus errors.',
      correctiveAction: 'Verify bus wiring. If problem perists, remove boards from the network to isolate the board with the problem tranceiver.',
    },
    {
      code: '99',
      description: 'Car top SRU CAN3 tranciever has self reset due to excessive bus errors.',
      correctiveAction: 'Verify bus wiring. If problem perists, remove boards from the network to isolate the board with the problem tranceiver.',
    },
    {
      code: '100',
      description: 'Car top SRU CAN4 tranciever has self reset due to excessive bus errors.',
      correctiveAction: 'Verify bus wiring. If problem perists, remove boards from the network to isolate the board with the problem tranceiver.',
    },
    {
      code: '101',
      description: 'Car operating panel SRU CAN1 tranciever has self reset due to excessive bus errors.',
      correctiveAction: 'Verify bus wiring. If problem perists, remove boards from the network to isolate the board with the problem tranceiver.',
    },
    {
      code: '102',
      description: 'Car operating panel SRU CAN2 tranciever has self reset due to excessive bus errors.',
      correctiveAction: 'Verify bus wiring. If problem perists, remove boards from the network to isolate the board with the problem tranceiver.',
    },
    {
      code: '103',
      description: 'Car operating panel SRU CAN3 tranciever has self reset due to excessive bus errors.',
      correctiveAction: 'Verify bus wiring. If problem perists, remove boards from the network to isolate the board with the problem tranceiver.',
    },
    {
      code: '104',
      description: 'Car operating panel SRU CAN4 tranciever has self reset due to excessive bus errors.',
      correctiveAction: 'Verify bus wiring. If problem perists, remove boards from the network to isolate the board with the problem tranceiver.',
    },
    {
      code: '105',
      description: 'Car is triggering a drive fault reset.',
      correctiveAction: 'NA',
    },
    {
      code: '106',
      description: 'Drive reset limit has been reached.  The controller will no longer reset drive faults.',
      correctiveAction: 'NA',
    },
    {
      code: '107',
      description: 'The car is fully loaded and will no longer take hall calls.',
      correctiveAction: 'NA',
    },
    {
      code: '108',
      description: 'The car has received a remote request to change a 1-bit parameter.',
      correctiveAction: 'NA',
    },
    {
      code: '109',
      description: 'The car has received a remote request to change a 8-bit parameter.',
      correctiveAction: 'NA',
    },
    {
      code: '110',
      description: 'The car has received a remote request to change a 16-bit parameter.',
      correctiveAction: 'NA',
    },
    {
      code: '111',
      description: 'The car has received a remote request to change a 24-bit parameter.',
      correctiveAction: 'NA',
    },
    {
      code: '112',
      description: 'The car has received a remote request to change a 32-bit parameter.',
      correctiveAction: 'NA',
    },
    {
      code: '113',
      description: 'The car has received a remote request to change a magnetek drive parameter.',
      correctiveAction: 'NA',
    },
    {
      code: '114',
      description: 'The car has received a remote request to change a KEB drive parameter.',
      correctiveAction: 'NA',
    },
    {
      code: '115',
      description: 'Manual run request rejected due to invalid car door state.',
      correctiveAction: 'NA',
    },
    {
      code: '116',
      description: 'Manual run request rejected due to invalid hall lock state.',
      correctiveAction: 'NA',
    },
    {
      code: '117',
      description: 'Manual run request rejected due to disarmed direction inputs. This may occur if car enters inspection with its direction inputs active.',
      correctiveAction: 'NA',
    },
    {
      code: '118',
      description: 'This alarm is unused but is kept as a placeholder for older versions of software.',
      correctiveAction: 'NA',
    },
    {
      code: '119',
      description: 'This alarm is unused but is kept as a placeholder for older versions of software.',
      correctiveAction: 'NA',
    },
    {
      code: '120',
      description: 'Manual run request rejected due to front door open button request.',
      correctiveAction: 'NA',
    },
    {
      code: '121',
      description: 'Manual run request rejected due to rear door open button request.',
      correctiveAction: 'NA',
    },
    {
      code: '122',
      description: 'Manual run request rejected due to invalid hoistway access floor or opening configuration.',
      correctiveAction: 'NA',
    },
    {
      code: '123',
      description: 'Manual run request rejected due to missing CT enable signal.',
      correctiveAction: 'NA',
    },
    {
      code: '124',
      description: 'Car has been idle with a valid destination for the user configured timeout (08-202), and has been forced to change direction.',
      correctiveAction: 'NA',
    },
    {
      code: '125',
      description: 'Debugging communication timer with MR CPLD elapsed.',
      correctiveAction: 'NA',
    },
    {
      code: '126',
      description: 'Debugging communication timer with CT CPLD elapsed.',
      correctiveAction: 'NA',
    },
    {
      code: '127',
      description: 'Debugging communication timer with COP CPLD elapsed.',
      correctiveAction: 'NA',
    },
    {
      code: '128',
      description: 'The car is in motion but its destination has been canceled. There are no reachable alternative destinations. It will ramp down at the next available landing and reassess. This can occur in cases where a hall call is reassigned to a closer car. This will not occur if 01-00196 is ON.',
      correctiveAction: 'NA',
    },
    {
      code: '129',
      description: 'The flood switch has been activated.',
      correctiveAction: 'NA',
    },
    {
      code: '130',
      description: 'The car has received a remote request to change parameters in a bulk parameter restore format.',
      correctiveAction: 'NA',
    },
    {
      code: '131',
      description: 'A Duplicate Group Priority was Detected',
      correctiveAction: 'NA',
    },
    {
      code: '132',
      description: 'Connection was lost for Inter Group 1',
      correctiveAction: 'NA',
    },
    {
      code: '133',
      description: 'Connection was lost for Inter Group 2',
      correctiveAction: 'NA',
    },
    {
      code: '134',
      description: 'Connection was lost for Inter Group 3',
      correctiveAction: 'NA',
    },
    {
      code: '135',
      description: 'Connection was lost for Inter Group 4',
      correctiveAction: 'NA',
    },
    {
      code: '136',
      description: 'Connection was lost for Inter Group 5',
      correctiveAction: 'NA',
    },
    {
      code: '137',
      description: 'Connection was lost for Inter Group 6',
      correctiveAction: 'NA',
    },
    {
      code: '138',
      description: 'Connection was lost for Inter Group 7',
      correctiveAction: 'NA',
    },
    {
      code: '139',
      description: 'Connection was lost for Inter Group 8',
      correctiveAction: 'NA',
    },
    {
      code: '140',
      description: 'Intergroup status packet received by group with priority 0.',
      correctiveAction: 'NA',
    },
    {
      code: '141',
      description: 'Pressed Car Call Button is secured. ',
      correctiveAction: 'Check security options to verify if the CCB should or should not be secured. ',
    },
    {
      code: '142',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '143',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '144',
      description: 'C4 load weighing device is performing a load learn at each landing.',
      correctiveAction: 'NA',
    },
    {
      code: '145',
      description: 'C4 load weighing device is performing an empty car learn at each landing.',
      correctiveAction: 'NA',
    },
    {
      code: '146',
      description: 'When 01-129 is ON, this debug alarm will be set when the mode of operation changes.',
      correctiveAction: 'NA',
    },
    {
      code: '147',
      description: 'Riser1 marked as offline after 30 seconds without communication.',
      correctiveAction: 'NA',
    },
    {
      code: '148',
      description: 'Riser1 reporting an unknown error.',
      correctiveAction: 'NA',
    },
    {
      code: '149',
      description: 'Riser1 reporting a power-on reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '150',
      description: 'Riser1 reporting a watchdog reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '151',
      description: 'Riser1 reporting a brown-out reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '152',
      description: 'Riser1 reporting a group network communication loss error.',
      correctiveAction: 'NA',
    },
    {
      code: '153',
      description: 'Riser1 reporting a hall network communication loss error.',
      correctiveAction: 'NA',
    },
    {
      code: '154',
      description: 'Riser1 reporting an invalid error.',
      correctiveAction: 'NA',
    },
    {
      code: '155',
      description: 'Riser1 reporting an invalid error.',
      correctiveAction: 'NA',
    },
    {
      code: '156',
      description: 'Riser1 reporting an invalid error.',
      correctiveAction: 'NA',
    },
    {
      code: '157',
      description: 'Riser1 has detected another board with the same address.',
      correctiveAction: 'NA',
    },
    {
      code: '158',
      description: 'Riser1 reporting a CAN1 bus reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '159',
      description: 'Riser1 reporting a CAN2 bus reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '160',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '161',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '162',
      description: 'Riser2 marked as offline after 30 seconds without communication.',
      correctiveAction: 'NA',
    },
    {
      code: '163',
      description: 'Riser2 reporting an unknown error.',
      correctiveAction: 'NA',
    },
    {
      code: '164',
      description: 'Riser2 reporting a power-on reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '165',
      description: 'Riser2 reporting a watchdog reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '166',
      description: 'Riser2 reporting a brown-out reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '167',
      description: 'Riser2 reporting a group network communication loss error.',
      correctiveAction: 'NA',
    },
    {
      code: '168',
      description: 'Riser2 reporting a hall network communication loss error.',
      correctiveAction: 'NA',
    },
    {
      code: '169',
      description: 'Riser2 reporting an invalid error.',
      correctiveAction: 'NA',
    },
    {
      code: '170',
      description: 'Riser2 reporting an invalid error.',
      correctiveAction: 'NA',
    },
    {
      code: '171',
      description: 'Riser2 reporting an invalid error.',
      correctiveAction: 'NA',
    },
    {
      code: '172',
      description: 'Riser2 has detected another board with the same address.',
      correctiveAction: 'NA',
    },
    {
      code: '173',
      description: 'Riser2 reporting a CAN1 bus reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '174',
      description: 'Riser2 reporting a CAN2 bus reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '175',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '176',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '177',
      description: 'Riser3 marked as offline after 30 seconds without communication.',
      correctiveAction: 'NA',
    },
    {
      code: '178',
      description: 'Riser3 reporting an unknown error.',
      correctiveAction: 'NA',
    },
    {
      code: '179',
      description: 'Riser3 reporting a power-on reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '180',
      description: 'Riser3 reporting a watchdog reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '181',
      description: 'Riser3 reporting a brown-out reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '182',
      description: 'Riser3 reporting a group network communication loss error.',
      correctiveAction: 'NA',
    },
    {
      code: '183',
      description: 'Riser3 reporting a hall network communication loss error.',
      correctiveAction: 'NA',
    },
    {
      code: '184',
      description: 'Riser3 reporting an invalid error.',
      correctiveAction: 'NA',
    },
    {
      code: '185',
      description: 'Riser3 reporting an invalid error.',
      correctiveAction: 'NA',
    },
    {
      code: '186',
      description: 'Riser3 reporting an invalid error.',
      correctiveAction: 'NA',
    },
    {
      code: '187',
      description: 'Riser3 has detected another board with the same address.',
      correctiveAction: 'NA',
    },
    {
      code: '188',
      description: 'Riser3 reporting a CAN1 bus reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '189',
      description: 'Riser3 reporting a CAN2 bus reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '190',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '191',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '192',
      description: 'Riser4 marked as offline after 30 seconds without communication.',
      correctiveAction: 'NA',
    },
    {
      code: '193',
      description: 'Riser4 reporting an unknown error.',
      correctiveAction: 'NA',
    },
    {
      code: '194',
      description: 'Riser4 reporting a power-on reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '195',
      description: 'Riser4 reporting a watchdog reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '196',
      description: 'Riser4 reporting a brown-out reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '197',
      description: 'Riser4 reporting a group network communication loss error.',
      correctiveAction: 'NA',
    },
    {
      code: '198',
      description: 'Riser4 reporting a hall network communication loss error.',
      correctiveAction: 'NA',
    },
    {
      code: '199',
      description: 'Riser4 reporting an invalid error.',
      correctiveAction: 'NA',
    },
    {
      code: '200',
      description: 'Riser4 reporting an invalid error.',
      correctiveAction: 'NA',
    },
    {
      code: '201',
      description: 'Riser4 reporting an invalid error.',
      correctiveAction: 'NA',
    },
    {
      code: '202',
      description: 'Riser4 has detected another board with the same address.',
      correctiveAction: 'NA',
    },
    {
      code: '203',
      description: 'Riser4 reporting a CAN1 bus reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '204',
      description: 'Riser4 reporting a CAN2 bus reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '205',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '206',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '207',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '208',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '209',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '210',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '211',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '212',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '213',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '214',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '215',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '216',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '217',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '218',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '219',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '220',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '221',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '222',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '223',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '224',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '225',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '226',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '227',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '228',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '229',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '230',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '231',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '232',
      description: 'Module runtime limit exceeded for module index 1.',
      correctiveAction: 'NA',
    },
    {
      code: '233',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '234',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '235',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '236',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '237',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '238',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '239',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '240',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '241',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '242',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '243',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '244',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '245',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '246',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '247',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '248',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '249',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '250',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '251',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '252',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '253',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '254',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '255',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '256',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '257',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '258',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '259',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '260',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '261',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '262',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '263',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '264',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '265',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '266',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '267',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '268',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '269',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '270',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '271',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '272',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '273',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '274',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '275',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '276',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '277',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '278',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '279',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '280',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '281',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '282',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '283',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '284',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '285',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '286',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '287',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '288',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '289',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '290',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '291',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '292',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '293',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '294',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '295',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '296',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '297',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '298',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '299',
      description: 'Module runtime limit exceeded for module index 1.',
      correctiveAction: 'NA',
    },
    {
      code: '300',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '301',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '302',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '303',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '304',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '305',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '306',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '307',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '308',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '309',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '310',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '311',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '312',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '313',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '314',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '315',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '316',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '317',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '318',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '319',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '320',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '321',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '322',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '323',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '324',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '325',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '326',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '327',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '328',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '329',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '330',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '331',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '332',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '333',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '334',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '335',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '336',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '337',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '338',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '339',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '340',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '341',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '342',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '343',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '344',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '345',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '346',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '347',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '348',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '349',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '350',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '351',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '352',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '353',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '354',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '355',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '356',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '357',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '358',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '359',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '360',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '361',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '362',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '363',
      description: 'Module runtime limit exceeded for module index 1.',
      correctiveAction: 'NA',
    },
    {
      code: '364',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '365',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '366',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '367',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '368',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '369',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '370',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '371',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '372',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '373',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '374',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '375',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '376',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '377',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '378',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '379',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '380',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '381',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '382',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '383',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '384',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '385',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '386',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '387',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '388',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '389',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '390',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '391',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '392',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '393',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '394',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '395',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '396',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '397',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '398',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '399',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '400',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '401',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '402',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '403',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '404',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '405',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '406',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '407',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '408',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '409',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '410',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '411',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '412',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '413',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '414',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '415',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '416',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '417',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '418',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '419',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '420',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '421',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '422',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '423',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '424',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '425',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '426',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '427',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '428',
      description: 'Module runtime limit exceeded for module index 1.',
      correctiveAction: 'NA',
    },
    {
      code: '429',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '430',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '431',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '432',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '433',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '434',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '435',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '436',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '437',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '438',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '439',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '440',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '441',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '442',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '443',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '444',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '445',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '446',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '447',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '448',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '449',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '450',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '451',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '452',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '453',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '454',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '455',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '456',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '457',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '458',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '459',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '460',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '461',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '462',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '463',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '464',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '465',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '466',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '467',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '468',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '469',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '470',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '471',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '472',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '473',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '474',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '475',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '476',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '477',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '478',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '479',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '480',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '481',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '482',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '483',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '484',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '485',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '486',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '487',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '488',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '489',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '490',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '491',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '492',
      description: 'Module runtime limit exceeded for module index 1.',
      correctiveAction: 'NA',
    },
    {
      code: '493',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '494',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '495',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '496',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '497',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '498',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '499',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '500',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '501',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '502',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '503',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '504',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '505',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '506',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '507',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '508',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '509',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '510',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '511',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '512',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '513',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '514',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '515',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '516',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '517',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '518',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '519',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '520',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '521',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '522',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '523',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '524',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '525',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '526',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '527',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '528',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '529',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '530',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '531',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '532',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '533',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '534',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '535',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '536',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '537',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '538',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '539',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '540',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '541',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '542',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '543',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '544',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '545',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '546',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '547',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '548',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '549',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '550',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '551',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '552',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '553',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '554',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '555',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '556',
      description: 'Module runtime limit exceeded for module index 1.',
      correctiveAction: 'NA',
    },
    {
      code: '557',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '558',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '559',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '560',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '561',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '562',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '563',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '564',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '565',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '566',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '567',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '568',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '569',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '570',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '571',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '572',
      description: 'NA',
      correctiveAction: 'N/A',
    },
    {
      code: '573',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '574',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '575',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '576',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '577',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '578',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '579',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '580',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '581',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '582',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '583',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '584',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '585',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '586',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '587',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '588',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '589',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '590',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '591',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '592',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '593',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '594',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '595',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '596',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '597',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '598',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '599',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '600',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '601',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '602',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '603',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '604',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '605',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '606',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '607',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '608',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '609',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '610',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '611',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '612',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '613',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '614',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '615',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '616',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '617',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '618',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '619',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '620',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '621',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '622',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '623',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '624',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '625',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '626',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '627',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '628',
      description: 'DD Panel manager board has gone offline.',
      correctiveAction: 'Check DD manager board wiring.',
    },
    {
      code: '629',
      description: 'Test alarm signaling that both locks and gsw are open while in motion. Enabled with 01-159.',
      correctiveAction: 'NA',
    },
    {
      code: '630',
      description: 'FRAM\'s data redundancy check has failed, but the data was recovered.',
      correctiveAction: 'NA',
    },
    {
      code: '631',
      description: 'Debugging alarm signalling that DO output asserted during a run. Will not flag if decelerating, in stop sequence, or releveling.',
      correctiveAction: 'NA',
    },
    {
      code: '632',
      description: 'Debugging alarm signalling that the flag preventing DO is being lost during a run. Will not flag if decelerating, in stop sequence, or releveling.',
      correctiveAction: 'NA',
    },
    {
      code: '633',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '634',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '635',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '636',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '637',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '638',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '639',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '640',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '641',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '642',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '643',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '644',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '645',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '646',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '647',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '648',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '649',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '650',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '651',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '652',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '653',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '654',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '655',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '656',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '657',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '658',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '659',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '660',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '661',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '662',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '663',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '664',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '665',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '666',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '667',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '668',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '669',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '670',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '671',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '672',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '673',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '674',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '675',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '676',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '677',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '678',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '679',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '680',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '681',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '682',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '683',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '684',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '685',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '686',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '687',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '688',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '689',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '690',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '691',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '692',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '693',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '694',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '695',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '696',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '697',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '698',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '699',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '700',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '701',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '702',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '703',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '704',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '705',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '706',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '707',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '708',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '709',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '710',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '711',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '712',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '713',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '714',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '715',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '716',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '717',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '718',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '719',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '720',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '721',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '722',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '723',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '724',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '725',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '726',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '727',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '728',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '729',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '730',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '731',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '732',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '733',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '734',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '735',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '736',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '737',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '738',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '739',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '740',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '741',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '742',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '743',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '744',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '745',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '746',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '747',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '748',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '749',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '750',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '751',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '752',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '753',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '754',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '755',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '756',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '757',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '758',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '759',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '760',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '761',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '762',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '763',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '764',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '765',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '766',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '767',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '768',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '769',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '770',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '771',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '772',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '773',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '774',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '775',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '776',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '777',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '778',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '779',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '780',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '781',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '782',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '783',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '784',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '785',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '786',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '787',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '788',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '789',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '790',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '791',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '792',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '793',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '794',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '795',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '796',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '797',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '798',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '799',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '800',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '801',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '802',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '803',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '804',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '805',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '806',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '807',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '808',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '809',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '810',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '811',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '812',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '813',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '814',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '815',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '816',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '817',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '818',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '819',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '820',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '821',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '822',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '823',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '824',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '825',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '826',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '827',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '828',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '829',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '830',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '831',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '832',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '833',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '834',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '835',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '836',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '837',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '838',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '839',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '840',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '841',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '842',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '843',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '844',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '845',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '846',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '847',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '848',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '849',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '850',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '851',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '852',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '853',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '854',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '855',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '856',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '857',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '858',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '859',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '860',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '861',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '862',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '863',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '864',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '865',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '866',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '867',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '868',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '869',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '870',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '871',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '872',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '873',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '874',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '875',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '876',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '877',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '878',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '879',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '880',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '881',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '882',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '883',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '884',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '885',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '886',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '887',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '888',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '889',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '890',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '891',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '892',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '893',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '894',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '895',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '896',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '897',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '898',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '899',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '900',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '901',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '902',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '903',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '904',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '905',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '906',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '907',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '908',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '909',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '910',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '911',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '912',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '913',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '914',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '915',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '916',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '917',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '918',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '919',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '920',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '921',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '922',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '923',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '924',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '925',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '926',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '927',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '928',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '929',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '930',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '931',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '932',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '933',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '934',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '935',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '936',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '937',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '938',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '939',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '940',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '941',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '942',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '943',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '944',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '945',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '946',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '947',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '948',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '949',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '950',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '951',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '952',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '953',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '954',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '955',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '956',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '957',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '958',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '959',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '960',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '961',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '962',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '963',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '964',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '965',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '966',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '967',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '968',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '969',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '970',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '971',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '972',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '973',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '974',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '975',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '976',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '977',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '978',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '979',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '980',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '981',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '982',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '983',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '984',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '985',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '986',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '987',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '988',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '989',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '990',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '991',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '992',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '993',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '994',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '995',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '996',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '997',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '998',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '999',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1000',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1001',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1002',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1003',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1004',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1005',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1006',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1007',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1008',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1009',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1010',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1011',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1012',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1013',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1014',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1015',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1016',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1017',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1018',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1019',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1020',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1021',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1022',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1023',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1024',
      description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1025',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1026',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1027',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1028',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1029',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1030',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1031',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1032',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1033',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1034',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1035',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1036',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1037',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1038',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1039',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1040',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1041',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1042',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1043',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1044',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1045',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1046',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1047',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1048',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1049',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1050',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1051',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1052',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1053',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1054',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1055',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1056',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1057',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1058',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1059',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1060',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1061',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1062',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1063',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1064',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1065',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1066',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1067',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1068',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1069',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1070',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1071',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1072',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1073',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1074',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1075',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1076',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1077',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1078',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1079',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1080',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1081',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1082',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1083',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1084',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1085',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1086',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1087',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1088',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1089',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1090',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1091',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1092',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1093',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1094',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1095',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1096',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1097',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1098',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1099',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1100',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1101',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1102',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1103',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1104',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1105',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1106',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1107',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1108',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1109',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1110',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1111',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1112',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1113',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1114',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1115',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1116',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1117',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1118',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1119',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1120',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1121',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1122',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1123',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1124',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1125',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1126',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1127',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1128',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1129',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1130',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1131',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1132',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1133',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1134',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1135',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1136',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1137',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1138',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1139',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1140',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1141',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1142',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1143',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1144',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1145',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1146',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1147',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1148',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1149',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1150',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1151',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1152',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1153',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1154',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1155',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1156',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1157',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1158',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1159',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1160',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1161',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1162',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1163',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1164',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1165',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1166',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1167',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1168',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1169',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1170',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1171',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1172',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1173',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1174',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1175',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1176',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1177',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1178',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1179',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1180',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1181',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1182',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1183',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1184',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1185',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1186',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1187',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1188',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1189',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1190',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1191',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1192',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1193',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1194',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1195',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1196',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1197',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1198',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1199',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1200',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1201',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1202',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1203',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1204',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1205',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1206',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1207',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1208',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1209',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1210',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1211',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1212',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1213',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1214',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1215',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1216',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1217',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1218',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1219',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1220',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1221',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1222',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1223',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1224',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1225',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1226',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1227',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1228',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1229',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1230',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1231',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1232',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1233',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1234',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1235',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1236',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1237',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1238',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1239',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1240',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1241',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1242',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1243',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1244',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1245',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1246',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1247',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1248',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1249',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1250',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1251',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1252',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1253',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1254',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1255',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1256',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1257',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1258',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1259',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1260',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1261',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1262',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1263',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1264',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1265',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1266',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1267',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1268',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1269',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1270',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1271',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1272',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1273',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1274',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1275',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1276',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1277',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1278',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1279',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1280',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1281',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1282',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1283',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1284',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1285',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1286',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1287',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1288',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1289',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1290',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1291',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1292',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1293',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1294',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1295',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1296',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1297',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1298',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1299',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1300',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1301',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1302',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1303',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1304',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1305',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1306',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1307',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1308',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1309',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1310',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1311',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1312',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1313',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1314',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1315',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1316',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1317',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1318',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1319',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1320',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1321',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1322',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1323',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1324',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1325',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1326',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1327',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1328',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1329',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1330',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1331',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1332',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1333',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1334',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1335',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1336',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1337',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1338',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1339',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1340',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1341',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1342',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1343',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1344',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1345',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1346',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1347',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1348',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1349',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1350',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1351',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1352',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1353',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1354',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1355',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1356',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1357',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1358',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1359',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1360',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1361',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1362',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1363',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1364',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1365',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1366',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1367',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1368',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1369',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1370',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1371',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1372',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1373',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1374',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1375',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1376',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1377',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1378',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1379',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1380',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1381',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1382',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1383',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1384',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1385',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1386',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1387',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1388',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1389',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1390',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1391',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1392',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1393',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1394',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1395',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1396',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1397',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1398',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1399',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1400',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1401',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1402',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1403',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1404',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1405',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1406',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1407',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1408',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1409',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1410',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1411',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1412',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1413',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1414',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1415',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1416',
      description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1417',
      description: 'Communication with load weighing device has been lost.',
      correctiveAction: 'Check the status of the smart rise load weigher. If no loadweigher exists, set load weigher select (08-135) to zero.',
    },
    {
      code: '1418',
      description: 'Communication with DL20 fixture and car top SRU has been lost.',
      correctiveAction: 'Check wiring and power to DL20.',
    },
    {
      code: '1419',
      description: 'Communication with DL20 fixture and car operating panel SRU has been lost.',
      correctiveAction: 'Check wiring and power to DL20.',
    },
    {
      code: '1420',
      description: 'CPLD communication buffers have been overrun.',
      correctiveAction: 'Contact smartrise support.',
    },
    {
      code: '1421',
      description: 'CPLD communication buffers have been overrun.',
      correctiveAction: 'Contact smartrise support.',
    },
    {
      code: '1422',
      description: 'CPLD communication buffers have been overrun.',
      correctiveAction: 'Contact smartrise support.',
    },
    {
      code: '1423',
      description: 'Fire phase 1 has been activated by the main fire keyswitch.',
      correctiveAction: 'Check the fire input and riser board status.',
    },
    {
      code: '1424',
      description: 'Fire phase 1 has been activated by the remote fire keyswitch.',
      correctiveAction: 'Check the fire input and riser board status.',
    },
    {
      code: '1425',
      description: 'Fire phase 1 has been activated by the main smoke input.',
      correctiveAction: 'Check the fire input and riser board status.',
    },
    {
      code: '1426',
      description: 'Fire phase 1 has been activated by the alternate smoke input.',
      correctiveAction: 'Check the fire input and riser board status.',
    },
    {
      code: '1427',
      description: 'Fire phase 1 has been activated by the machine room smoke input.',
      correctiveAction: 'Check the fire input and riser board status.',
    },
    {
      code: '1428',
      description: 'Fire phase 1 has been activated by the hoistway smoke input.',
      correctiveAction: 'Check the fire input and riser board status.',
    },
    {
      code: '1429',
      description: 'Fire phase 1 has been activated by a latched fire reclal source following a power loss.',
      correctiveAction: 'Check the fire input and riser board status.',
    },
    {
      code: '1430',
      description: 'Fire phase 1 has been activated by the pit smoke input.',
      correctiveAction: 'Check the fire input and riser board status.',
    },
    {
      code: '1431',
      description: 'Fire phase 1 has been activated by the second machine room smoke input.',
      correctiveAction: 'Check the fire input and riser board status.',
    },
    {
      code: '1432',
      description: 'Fire phase 1 has been activated by the second hoistway smoke input.',
      correctiveAction: 'Check the fire input and riser board status.',
    },
    {
      code: '1433',
      description: 'Machine room SRU board needs to be reset.',
      correctiveAction: 'Cycle power to the machine room SRU board.',
    },
    {
      code: '1434',
      description: 'Car top SRU board needs to be reset.',
      correctiveAction: 'Cycle power to the car top SRU board.',
    },
    {
      code: '1435',
      description: 'Car operating panel SRU board needs to be reset.',
      correctiveAction: 'Cycle power to the car operating panel SRU board.',
    },
    {
      code: '1436',
      description: 'Unintended movement test feature is active. If not intended, turn OFF MR SRU DIP B8 and parameter 01-0052 to disable the feature.',
      correctiveAction: 'Unintended movement test feature is active. If not intended, turn OFF MR SRU DIP B8 and parameter 01-0052 to disable the feature.',
    },
    {
      code: '1437',
      description: 'Communication has been lost between Dupar COP and COP SRU.',
      correctiveAction: 'Check wiring between Dupar COP and COP SRU (C3H/C3L)',
    },
    {
      code: '1438',
      description: 'Riser 1 has reported communication loss with one of its hall boards.',
      correctiveAction: 'Check the hall board status menu for a hall board reporting 0% communcation and check wiring.',
    },
    {
      code: '1439',
      description: 'Riser 2 has reported communication loss with one of its hall boards.',
      correctiveAction: 'Check the hall board status menu for a hall board reporting 0% communcation and check wiring.',
    },
    {
      code: '1440',
      description: 'Riser 3 has reported communication loss with one of its hall boards.',
      correctiveAction: 'Check the hall board status menu for a hall board reporting 0% communcation and check wiring.',
    },
    {
      code: '1441',
      description: 'Riser 4 has reported communication loss with one of its hall boards.',
      correctiveAction: 'Check the hall board status menu for a hall board reporting 0% communcation and check wiring.',
    },
    {
      code: '1442',
      description: 'Shield error state is unknown.',
      correctiveAction: 'Check wiring of power and network lines.',
    },
    {
      code: '1443',
      description: 'Shield is starting up after a standard reset event.',
      correctiveAction: 'Check wiring of power and network lines.',
    },
    {
      code: '1444',
      description: 'Shield is starting up after a brown out reset event.',
      correctiveAction: 'Check wiring of power and network lines.',
    },
    {
      code: '1445',
      description: 'Shield is starting up after a watchdog timer reset event.',
      correctiveAction: 'Check wiring of power and network lines.',
    },
    {
      code: '1446',
      description: 'Shield has not see communication from the group network in 5 seconds.',
      correctiveAction: 'Check wiring of power and network lines.',
    },
    {
      code: '1447',
      description: 'Shield has not seen communication from the RPi in 5 seconds.',
      correctiveAction: 'Check wiring of power and network lines.',
    },
    {
      code: '1448',
      description: 'Shield RTC has failed.',
      correctiveAction: 'Replace on board battery.',
    },
    {
      code: '1449',
      description: 'Shield UART transmit buffer has overflowed.',
      correctiveAction: 'Contact smartrise support.',
    },
    {
      code: '1450',
      description: 'Shield UART receive buffer has overflowed.',
      correctiveAction: 'Contact smartrise support.',
    },
    {
      code: '1451',
      description: 'Shield CAN transmit buffer has overflowed.',
      correctiveAction: 'Contact smartrise support.',
    },
    {
      code: '1452',
      description: 'Shield CAN receive buffer has overflowed.',
      correctiveAction: 'Contact smartrise support.',
    },
    {
      code: '1453',
      description: 'Shield has detected a can bus reset event.',
      correctiveAction: 'Check wiring of power and network lines.',
    },
    {
      code: '1454',
      description: 'VIP process has been canceled due to excessive wait time.',
      correctiveAction: 'NA',
    },
    {
      code: '1455',
      description: 'Fire phase 1 has been activated by Virtual Input Fire Remote Recall',
      correctiveAction: 'NA',
    },
    {
      code: '1456',
      description: 'Car is on EMS phase 2, in a dead zone with doors open, but can\'t exit EMS 2 because it is not at the correct recall floor (the floor it was first called to on EMS phase 1).',
      correctiveAction: 'Either move car to the correct EMS 1 recall floor, or turn ON parameter EMS_ExitPh2AtAnyFloor (01-98) to allow exiting EMS phase 2 at any floor.',
    },
    {
      code: '1457',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '1458',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '1459',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '1460',
      description: 'While attempting to do the Buffer Test, Buffer speed is 0 or less than Learn Speed.',
      correctiveAction: 'Set the Buffer Speed to a higher FPM ( Contract Speed or above Learn Speed ). ',
    },
    {
      code: '1461',
      description: 'While attempting to do the Asc/Des Overspeed test, Asc/Des speed is 0 or less than Learn Speed.',
      correctiveAction: 'Set the Asc/Des speed to a higher FPM ( Contract Speed or above Learn Speed ). ',
    },
    {
      code: '1462',
      description: 'Primary CEDES camera channel 1 reporting a communication error.',
      correctiveAction: 'Check wiring and network termination.',
    },
    {
      code: '1463',
      description: 'Primary CEDES camera channel 1 reporting a cannot read tape error.',
      correctiveAction: 'Clean camera window, clean tape, check alignment.',
    },
    {
      code: '1464',
      description: 'Primary CEDES camera channel 1 reporting a tape too close error.',
      correctiveAction: 'Fix tape alignment.',
    },
    {
      code: '1465',
      description: 'Primary CEDES camera channel 1 reporting a tape too far error.',
      correctiveAction: 'Fix tape alignment.',
    },
    {
      code: '1466',
      description: 'Primary CEDES camera channel 1 reporting a tape too far left error.',
      correctiveAction: 'Fix tape alignment.',
    },
    {
      code: '1467',
      description: 'Primary CEDES camera channel 1 reporting a tape too far right error.',
      correctiveAction: 'Fix tape alignment.',
    },
    {
      code: '1468',
      description: 'Primary CEDES camera channel 1 reporting a contrast - service recommended read status.',
      correctiveAction: 'Clean camera window, clean tape, check alignment.',
    },
    {
      code: '1469',
      description: 'Primary CEDES camera channel 1 reporting a contrast - warning read status.',
      correctiveAction: 'Clean camera window, clean tape, check alignment.',
    },
    {
      code: '1470',
      description: 'Primary CEDES camera channel 1 reporting a contrast - stopped read status.',
      correctiveAction: 'Clean camera window, clean tape, check alignment.',
    },
    {
      code: '1471',
      description: 'Primary CEDES camera channel 1 failed CRC check.',
      correctiveAction: 'Check wiring and network termination.',
    },
    {
      code: '1472',
      description: 'Primary CEDES camera channel 2 reporting a communication error.',
      correctiveAction: 'Check wiring and network termination.',
    },
    {
      code: '1473',
      description: 'Primary CEDES camera channel 2 reporting a cannot read tape error.',
      correctiveAction: 'Clean camera window, clean tape, check alignment.',
    },
    {
      code: '1474',
      description: 'Primary CEDES camera channel 2 reporting a tape too close error.',
      correctiveAction: 'Fix tape alignment.',
    },
    {
      code: '1475',
      description: 'Primary CEDES camera channel 2 reporting a tape too far error.',
      correctiveAction: 'Fix tape alignment.',
    },
    {
      code: '1476',
      description: 'Primary CEDES camera channel 2 reporting a tape too far left error.',
      correctiveAction: 'Fix tape alignment.',
    },
    {
      code: '1477',
      description: 'Primary CEDES camera channel 2 reporting a tape too far right error.',
      correctiveAction: 'Fix tape alignment.',
    },
    {
      code: '1478',
      description: 'Primary CEDES camera channel 2 reporting a contrast - service recommended read status.',
      correctiveAction: 'Clean camera window, clean tape, check alignment.',
    },
    {
      code: '1479',
      description: 'Primary CEDES camera channel 2 reporting a contrast - warning read status.',
      correctiveAction: 'Clean camera window, clean tape, check alignment.',
    },
    {
      code: '1480',
      description: 'Primary CEDES camera channel 2 reporting a contrast - stopped read status.',
      correctiveAction: 'Clean camera window, clean tape, check alignment.',
    },
    {
      code: '1481',
      description: 'Primary CEDES camera channel 2 failed CRC check.',
      correctiveAction: 'Check wiring and network termination.',
    },
    {
      code: '1482',
      description: 'ETSL CEDES camera channel 2 reporting a communication error.',
      correctiveAction: 'Check wiring and network termination.',
    },
    {
      code: '1483',
      description: 'ETSL CEDES camera channel 2 reporting a cannot read tape error.',
      correctiveAction: 'Clean camera window, clean tape, check alignment.',
    },
    {
      code: '1484',
      description: 'ETSL CEDES camera channel 2 reporting a tape too close error.',
      correctiveAction: 'Fix tape alignment.',
    },
    {
      code: '1485',
      description: 'ETSL CEDES camera channel 2 reporting a tape too far error.',
      correctiveAction: 'Fix tape alignment.',
    },
    {
      code: '1486',
      description: 'ETSL CEDES camera channel 2 reporting a tape too far left error.',
      correctiveAction: 'Fix tape alignment.',
    },
    {
      code: '1487',
      description: 'ETSL CEDES camera channel 2 reporting a tape too far right error.',
      correctiveAction: 'Fix tape alignment.',
    },
    {
      code: '1488',
      description: 'ETSL CEDES camera channel 2 reporting a contrast - service recommended read status.',
      correctiveAction: 'Clean camera window, clean tape, check alignment.',
    },
    {
      code: '1489',
      description: 'ETSL CEDES camera channel 2 reporting a contrast - warning read status.',
      correctiveAction: 'Clean camera window, clean tape, check alignment.',
    },
    {
      code: '1490',
      description: 'ETSL CEDES camera channel 2 reporting a contrast - stopped read status.',
      correctiveAction: 'Clean camera window, clean tape, check alignment.',
    },
    {
      code: '1491',
      description: 'ETSL CEDES camera channel 2 failed CRC check.',
      correctiveAction: 'Check wiring and network termination.',
    },
    {
      code: '1492',
      description: 'DAD unit has stopped communicating with the C4 car for 15 seconds.',
      correctiveAction: 'Check group network wiring. Check that power is supplied to the DAD unit.',
    },
    {
      code: '1493',
      description: 'Communication lost with primary soft starter.',
      correctiveAction: '(Hydro Only) Check primary soft starter board and wiring.',
    },
    {
      code: '1494',
      description: 'Primary soft starter reporting an unknown fault.',
      correctiveAction: '(Hydro Only) Check primary soft starter board and wiring.',
    },
    {
      code: '1495',
      description: 'Primary soft starter recovering from a reset due to power off.',
      correctiveAction: '(Hydro Only) Check primary soft starter board and wiring.',
    },
    {
      code: '1496',
      description: 'Primary soft starter recovering from reset due to watchdog.',
      correctiveAction: '(Hydro Only) Check primary soft starter board and wiring.',
    },
    {
      code: '1497',
      description: 'Primary soft starter recovering from reset due to voltage dip.',
      correctiveAction: '(Hydro Only) Check primary soft starter board and wiring.',
    },
    {
      code: '1498',
      description: 'Primary soft starter reporting loss of communication with the elevator controller.',
      correctiveAction: '(Hydro Only) Check primary soft starter board and wiring.',
    },
    {
      code: '1499',
      description: 'Primary soft starter reporting an overcurrent error.',
      correctiveAction: '(Hydro Only) Check primary soft starter board and wiring.',
    },
    {
      code: '1500',
      description: 'Primary soft starter reporting an overvoltage error.',
      correctiveAction: '(Hydro Only) Check primary soft starter board and wiring.',
    },
    {
      code: '1501',
      description: 'Primary soft starter reporting an undervoltage error.',
      correctiveAction: '(Hydro Only) Check primary soft starter board and wiring.',
    },
    {
      code: '1502',
      description: 'Primary soft starter reporting a missing phase.',
      correctiveAction: '(Hydro Only) Check primary soft starter board and wiring.',
    },
    {
      code: '1503',
      description: 'Primary soft starter reporting phase sequence error.',
      correctiveAction: '(Hydro Only) Check primary soft starter board and wiring.',
    },
    {
      code: '1504',
      description: 'Primary soft starter reporting a CAN bus reset.',
      correctiveAction: '(Hydro Only) Check primary soft starter board and wiring.',
    },
    {
      code: '1505',
      description: 'Discrete input fault 2 from the Soft Starter has been actived.',
      correctiveAction: '(Hydro Only) Check the SS 2 Input fault, and the contact feeding the input from the drive.',
    },
    {
      code: '1506',
      description: 'Communication lost with secondary soft starter.',
      correctiveAction: '(Hydro Only) Check secondary soft starter board and wiring.',
    },
    {
      code: '1507',
      description: 'Secondary soft starter reporting an unknown fault.',
      correctiveAction: '(Hydro Only) Check secondary soft starter board and wiring.',
    },
    {
      code: '1508',
      description: 'Secondary soft starter recovering from a reset due to power off.',
      correctiveAction: '(Hydro Only) Check secondary soft starter board and wiring.',
    },
    {
      code: '1509',
      description: 'Secondary soft starter recovering from reset due to watchdog.',
      correctiveAction: '(Hydro Only) Check secondary soft starter board and wiring.',
    },
    {
      code: '1510',
      description: 'Secondary soft starter recovering from reset due to voltage dip.',
      correctiveAction: '(Hydro Only) Check secondary soft starter board and wiring.',
    },
    {
      code: '1511',
      description: 'Secondary soft starter reporting loss of communication with the elevator controller.',
      correctiveAction: '(Hydro Only) Check secondary soft starter board and wiring.',
    },
    {
      code: '1512',
      description: 'Secondary soft starter reporting an overcurrent error.',
      correctiveAction: '(Hydro Only) Check secondary soft starter board and wiring.',
    },
    {
      code: '1513',
      description: 'Secondary soft starter reporting an overvoltage error.',
      correctiveAction: '(Hydro Only) Check secondary soft starter board and wiring.',
    },
    {
      code: '1514',
      description: 'Secondary soft starter reporting an undervoltage error.',
      correctiveAction: '(Hydro Only) Check secondary soft starter board and wiring.',
    },
    {
      code: '1515',
      description: 'Secondary soft starter reporting a missing phase.',
      correctiveAction: '(Hydro Only) Check secondary soft starter board and wiring.',
    },
    {
      code: '1516',
      description: 'Secondary soft starter reporting phase sequence error.',
      correctiveAction: '(Hydro Only) Check secondary soft starter board and wiring.',
    },
    {
      code: '1517',
      description: 'Secondary soft starter reporting a CAN bus reset.',
      correctiveAction: '(Hydro Only) Check secondary soft starter board and wiring.',
    },
    {
      code: '1518',
      description: 'Discrete input fault 2 from the Soft Starter has been actived.',
      correctiveAction: '(Hydro Only) Check the SS 2 Input fault, and the contact feeding the input from the drive.',
    },
    {
      code: '1519',
      description: 'Primary soft starter reporting another board on the network has the same address.',
      correctiveAction: '(Hydro Only) Check primary soft starter address DIP switches.',
    },
    {
      code: '1520',
      description: 'Secondary soft starter reporting another board on the network has the same address.',
      correctiveAction: '(Hydro Only) Check secondary soft starter address DIP switches.',
    },
    {
      code: '1521',
      description: 'If the car on fire phase 2 operation, and not at the recall floor. When the in car fire keyswitch is turned to the OFF position, the car will be put in a Fire Phase 2 Hold state if option Fire__Phase2ExitOnlyAtRecallFlr (01-0017) is ON. This alarm informs the user that they should move the car back to the recall floor before attempting to exit phase 2.',
      correctiveAction: 'Return the car to the recall floor before exiting phase 2.',
    },
    {
      code: '1522',
      description: 'The car has attempted to move to a recall floor but failed to start movement within 5 seconds.',
      correctiveAction: 'This alarm is for diagnostics and does not require immediate smartrise support unless accompanied by other recall related issues.',
    },
    {
      code: '1523',
      description: 'The car has failed to slowdown to configured leveling speed during a slowdown learn within 10 seconds of cutting the high speed valve. Set the car\'s leveling speed parameter to above the car\'s max leveling valve speed.',
      correctiveAction: 'This alarm is for identifying when the car\'s leveling speed is not set above the car\'s leveling speed.',
    },
    {
      code: '1524',
      description: 'Serial load weighing device reporting an unknown error.',
      correctiveAction: 'Check wiring of the serial load weighing device.',
    },
    {
      code: '1525',
      description: 'Serial load weighing device reporting a powering on reset error.',
      correctiveAction: 'Check serial load weighing device\'s power supply.',
    },
    {
      code: '1526',
      description: 'Serial load weighing device reporting a watchdog reset error.',
      correctiveAction: 'Contact smartrise support.',
    },
    {
      code: '1527',
      description: 'Serial load weighing device reporting a brown out reset error.',
      correctiveAction: 'Check serial load weighing device\'s power supply.',
    },
    {
      code: '1528',
      description: 'Serial load weighing device reporting no communciation with the C4 system detected.',
      correctiveAction: 'Check wiring of serial load weighing device\'s CAN H and CAN L.',
    },
    {
      code: '1529',
      description: 'Serial load weighing device reporting no communication detected with load cell processor.',
      correctiveAction: 'Contact smartrise support.',
    },
    {
      code: '1530',
      description: 'Serial load weighing device reporting the can bus controller has reset.',
      correctiveAction: 'Check wiring of serial load weighing device\'s CAN H and CAN L.',
    },
    {
      code: '1531',
      description: 'Serial load weighing device reporting the watchdog is disabled.',
      correctiveAction: 'Check on board watchdog jumper.',
    },
    {
      code: '1532',
      description: 'The CAN1 buffer on MRA has overflowed. Investigate CN1+/- network issues.',
      correctiveAction: 'Check CN1 +/- network wiring and termination.',
    },
    {
      code: '1533',
      description: 'The CAN1 buffer on CTA has overflowed. Investigate CN1+/- network issues.',
      correctiveAction: 'Check CN1 +/- network wiring and termination.',
    },
    {
      code: '1534',
      description: 'The CAN1 buffer on COPA has overflowed. Investigate CN1+/- network issues.',
      correctiveAction: 'Check CN1 +/- network wiring and termination.',
    },
    {
      code: '1535',
      description: 'The car has reached the normal limits of either the bottom or top doorzone. ',
      correctiveAction: 'Move the car away from the Norma Limit. ',
    },
  ];
  alertType: AlertType;
  faultAlertType = AlertType.Fault;
  alarmAlertType = AlertType.Alarm;
  countBasedPartAlertType = AlertType.CountBasedPart;
  timeBasedPartAlertType = AlertType.TimeBasedPart;

  recordsNumber = 5;

  partType: any;
  thresholdType: ThresholdType;

  periodThresholdType = ThresholdType.Period;
  counterThresholdType = ThresholdType.Counter;
  // faultsCountThresholdType = ThresholdType.FaultsCount;

  source = new BaseServerDataSource();
  alertSettings: IAlertSetting[] = [];
  settings: any = {
    mode: 'external',
    actions: {
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      name: {
        filter: true,
        sort: true,
        title: 'Alert Name',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Alert Name');
        },
      },
      severity: {
        sort: true,
        title: 'Severity',
        type: 'custom',
        valuePrepareFunction: (value) => Severity[value],
        renderComponent: AlertSeverityCellComponent,
        onComponentInitFunction: (instance: AlertSeverityCellComponent) => {
          instance.setHeader('Severity');
        },
        filter: {
          type: 'custom',
          component: CpListFilterComponent,
          config: {
            selectText: 'All',
            list: this.populateLookupAsFilterList(Severity),
          },
        }
      },
      type: {
        sort: true,
        title: 'Alert Type',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        valuePrepareFunction: (value) => (AlertType[value] || '').replace(/([A-Z])/g, ' $1').trim(),
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Alert Type');
        },
        filter: {
          type: 'custom',
          component: CpListFilterComponent,
          config: {
            selectText: 'All',
            list: this.populateLookupAsFilterList(AlertType),
          },
        }
      },
      createdDate: {
        sort: true,
        title: 'Created Date',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        valuePrepareFunction: (value) => this.formatUSDate(value),
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Created Date');
        },
        filter: {
          type: 'custom',
          component: CpDateFilterComponent,
        }
      },
      modifiedDate: {
        sort: true,
        title: 'Modified Date',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        valuePrepareFunction: (value) => this.formatUSDate(value),
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Modified Date');
        },
        filter: {
          type: 'custom',
          component: CpDateFilterComponent,
        }
      },
      totalAlerts: {
        filter: true,
        sort: true,
        title: 'Total Alerts',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Total Alerts');
        },
      },
      actionsCol: {
        filter: false,
        sort: false,
        title: 'Actions',
        type: 'custom',
        renderComponent: AlertsSettingsActionsComponent,
        onComponentInitFunction: this.onActionsInit.bind(this),
      },
    },
  };
  notificationMethods: any;
  responsiveSubscription: any;

  constructor(
    baseService: BaseComponentService,
    private modalService: BsModalService,
    private responsiveService: ResponsiveService,
    private alertService: AlertService,
  ) {
    super(baseService);
    this.populateLookup(this.severities, Severity);
  }

  onPartTypeChanged(event) {
    this.source.setFilter([
      {
        field: 'partType',
        search: event.target.value
      }]);
  }

  onActionsInit(notificationSettingsActionsComponent: AlertsSettingsActionsComponent) {
    notificationSettingsActionsComponent.removeNotificationSetting.subscribe((x) => {
      const index = this.alertSettings.indexOf(x);
      delete this.alertSettings[index];
      this.source.refresh();
    });
    notificationSettingsActionsComponent.editNotificationSettings.subscribe((x: IAlertSetting) => {
      this.editNotificationSettings(x);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  editNotificationSettings(alert: IAlertSetting) {
    const modelRef = this.modalService.show<AlertSettingComponent>(AlertSettingComponent, {
      initialState: {
        isEditMode: true,
        alert: {

          alertId: 1,
          alertName: 'Alert 1',
          alertDescription: 'Alert 1 Description',
          alertDate: new Date('2/2/2021'),

          severity: Severity.Critical,
          alertType: AlertType.CountBasedPart,

          fault: null,
          faultCount: null,
          faultPossibleAffectedParts: null,
          faultThreshold: null,

          alarm: null,
          alarmCount: null,
          alarmPossibleAffectedParts: null,
          alarmThreshold: null,

          countBasedPart: 'Contactors',
          countBasedVendor: 'Vendor 1',
          nbOfLatchesOfTurns: 3000,
          nbOfLatchesOfTurnsThreshold: 2800,

          timeBasedPart: null,
          timeBasedVendor: null,
          nbOfDays: null,
          nbOfDaysThreshold: null,
        }
      },
      class: 'alert-settings-model'
    });
    const sub = modelRef.onHidden.subscribe(() => {
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.initializeGrid();
    this.recordsNumber = environment.recordsPerPage;
    this.onRecordsNumberChanged(this.recordsNumber);
    this.responsiveSubscription = this.responsiveService.currentBreakpoint$.subscribe(w => {
      if (w === ScreenBreakpoint.lg || w === ScreenBreakpoint.xl) {
        if (this.isSmall !== false) {
          this.onReset();
          this.isSmall = false;
        }
      } else if (w === ScreenBreakpoint.md || w === ScreenBreakpoint.xs || w === ScreenBreakpoint.sm) {
        if (this.isSmall !== true) {
          this.onReset();
          this.isSmall = true;
        }
      }
    });
  }

  initializeGrid() {
    this.source.serviceCallBack = (param) => {
      const alertParams = param as AlertSettingsParams;
      if (this.isSmall) {
        alertParams.name = this.name;
        alertParams.severity = this.severity;
        alertParams.type = this.type;
        alertParams.createdDate = this.createdDate;
        alertParams.modifiedDate = this.modifiedDate;
        alertParams.totalAlerts = this.totalAlerts;
      }
      return this.alertService.getAlertsSettings(alertParams);
    };
    this.source.refresh();
  }

  onMapSeverity() {
    const modalRef = this.modalService.show<MapSeverityComponent>(MapSeverityComponent, {
      initialState: {
        partType: this.partType
      }
    });

    modalRef.content.severityMapped.subscribe((notificationSetting) => {
      this.alertSettings.push(notificationSetting);
      this.source.refresh();
      modalRef.hide();
    });

    const subscription = modalRef.onHidden
      .subscribe(() => {
        subscription.unsubscribe();
      });
  }

  onCreateAlertSetting() {
    const modelRef = this.modalService.show<AlertSettingComponent>(AlertSettingComponent, {
      initialState: {
        isEditMode: false
      },
      class: 'alert-settings-model'
    });
    const sub = modelRef.onHidden.subscribe(() => {
      sub.unsubscribe();
    });
  }

  onReset() {
    if (this.isSmall) {
      this.name = null;
      this.severity = null;
      this.totalAlerts = null;
      this.type = null;
      this.createdDate = null;
      this.modifiedDate = null;

      this.source.refreshAndGoToFirstPage();
    } else {
      this.source.resetFilters();
    }
  }

  onRecordsNumberChanged(value: number) {
    this.source.setPaging(1, value);
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  onSearch() {
    this.source.refresh();
  }
}
