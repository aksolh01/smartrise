import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { SmartriseValidators } from '../../../_shared/constants';
import { IAlarm } from '../../../_shared/models/alarm';
import { IAlertDetails } from '../../../_shared/models/alertData';
import { AlertType } from '../../../_shared/models/alertType';
import { IFaultLookup } from '../../../_shared/models/faultLookup';
import { Severity, ThresholdType } from '../../../_shared/models/predictiveMaintenanceEnums';
import { BaseComponentService } from '../../../services/base-component.service';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'ngx-alert-setting',
  templateUrl: './alert-setting.component.html',
  styleUrls: ['./alert-setting.component.scss']
})
export class AlertSettingComponent extends BaseComponent implements OnInit {
  @ViewChild('autoFaultInput') autoFaultInput;
  @ViewChild('autoAlarmInput') autoAlarmInput;

  alert: IAlertDetails = {

    alarm: null,
    alarmCount: null,
    alarmPossibleAffectedParts: null,
    alarmThreshold: null,

    alertDate: null,
    alertDescription: null,
    alertId: null,
    alertName: null,
    alertType: null,

    countBasedPart: null,
    countBasedVendor: null,
    fault: null,
    faultCount: null,
    faultPossibleAffectedParts: null,
    faultThreshold: null,
    severity: null,
    timeBasedPart: null,
    timeBasedVendor: null,
    nbOfDays: null,
    nbOfDaysThreshold: null,
    nbOfLatchesOfTurns: null,
    nbOfLatchesOfTurnsThreshold: null,
  };
  alertType: AlertType;
  alertTypes = [];
  notificationMethods = [];
  isEditMode = false;

  alertSettingsForm: UntypedFormGroup;
  faultAlertType = AlertType.Fault;
  alarmAlertType = AlertType.Alarm;

  countBasedPartAlertType = AlertType.CountBasedPart;
  timeBasedPartAlertType = AlertType.TimeBasedPart;
  severities = [];
  partTypes = [];
  faults = [
    {
      code: '0',
      description: 'No faults active.',
      correctiveAction: 'NA',
    },
    {
      code: '1',
      description: 'Governor safety input is currently low.',
      correctiveAction: 'Check wiring and safety contacts.',
    },
    {
      code: '2',
      description: 'Governor fault is latched.',
      correctiveAction: 'Press the EBRK RST button to clear.',
    },
    {
      code: '3',
      description: 'EB1 relay is currently dropped.',
      correctiveAction: 'NA',
    },
    {
      code: '4',
      description: 'EB1 fault is latched.',
      correctiveAction: 'Press the EBRK RST button to clear.',
    },
    {
      code: '5',
      description: 'A GSW and Lock is open and the car is more than two and a half inches from the nearest learned floor position. The movement direction dissagrees with the commanded.',
      correctiveAction: 'Check wiring and safety contacts.',
    },
    {
      code: '6',
      description: 'Unintended movement fault is latched.',
      correctiveAction: 'Press the EBRK RST button to clear.',
    },
    {
      code: '7',
      description: 'Car speed has deviated from the motor encoder speed by an adjustable percentage.',
      correctiveAction: 'Confirm system and drive contract speed match.',
    },
    {
      code: '8',
      description: 'Traction loss fault is latched.',
      correctiveAction: 'Press TLOSS button to clear.',
    },
    {
      code: '9',
      description: 'Car speed has deviated from the command speed by an adjustable percentage. ',
      correctiveAction: 'Confirm system and drive contract speed match, clean CEDES tape, or reduce s-curve values.',
    },
    {
      code: '10',
      description: 'In car stop switch (COP-SF2) input is missing.',
      correctiveAction: 'Check wiring and safety contacts.',
    },
    {
      code: '11',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '12',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '13',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '14',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '15',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '16',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '17',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '18',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '19',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '20',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '21',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '22',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '23',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '24',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '25',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '26',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '27',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '28',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '29',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '30',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '31',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '32',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '33',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '34',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '35',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '36',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '37',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '38',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '39',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '40',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '41',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '42',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '43',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '44',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '45',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '46',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '47',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '48',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '49',
      description: 'Input read by the main MCU system and the CPLD safety system do not match.',
      correctiveAction: 'Verify the board has its RDC jumper on.',
    },
    {
      code: '50',
      description: 'SFP relay is stuck in the OFF position.',
      correctiveAction: 'Verify the relay is tightly seated on its connector.',
    },
    {
      code: '51',
      description: 'SFP relay is stuck in the ON position.',
      correctiveAction: 'Verify the relay is tightly seated on its connector.',
    },
    {
      code: '52',
      description: 'SFP relay has been dropped.',
      correctiveAction: 'Investigate the fault issued by the CPLD.',
    },
    {
      code: '53',
      description: 'EB3 relay is stuck in the OFF position.',
      correctiveAction: 'Verify the relay is tightly seated on its connector.',
    },
    {
      code: '54',
      description: 'EB3 relay is stuck in the ON position.',
      correctiveAction: 'Verify the relay is tightly seated on its connector.',
    },
    {
      code: '55',
      description: 'EB4 relay is stuck in the OFF position.',
      correctiveAction: 'Verify the relay is tightly seated on its connector.',
    },
    {
      code: '56',
      description: 'EB4 relay is stuck in the ON position.',
      correctiveAction: 'Verify the relay is tightly seated on its connector.',
    },
    {
      code: '57',
      description: 'EB1 relay is stuck.',
      correctiveAction: 'Verify the relay is tightly seated on its connector.',
    },
    {
      code: '58',
      description: 'M contactor is stuck in the ON position.',
      correctiveAction: 'Check the wiring to and from the M contactor.',
    },
    {
      code: '59',
      description: 'M contactor is stuck in the OFF position.',
      correctiveAction: 'Check the wiring to and from the M contactor.',
    },
    {
      code: '60',
      description: 'B2 contactor is stuck in the ON position.',
      correctiveAction: 'Check the wiring to and from the B2 contactor.',
    },
    {
      code: '61',
      description: 'B2 contactor is stuck in the OFF position.',
      correctiveAction: 'Check the wiring to and from the B2 contactor.',
    },
    {
      code: '62',
      description: 'Hall door bypass switch is ON.',
      correctiveAction: 'Turn off machine room board H-DOOR switch.',
    },
    {
      code: '63',
      description: 'Car door bypass switch is ON.',
      correctiveAction: 'Turn off machine room board C-DOOR switch.',
    },
    {
      code: '64',
      description: 'Car speed exceeded 110% of contract speed.',
      correctiveAction: 'Confirm system and drive contract speed match or reduce s-curve values.',
    },
    {
      code: '65',
      description: 'Car overspeed fault is latched.',
      correctiveAction: 'Press EBRK RST button to clear.',
    },
    {
      code: '66',
      description: 'Car speed exceeded 150 fpm in inspection mode.',
      correctiveAction: 'Confirm system and drive contract speed match.',
    },
    {
      code: '67',
      description: 'Car speed exceeded 150 fpm with front gateswitch open.',
      correctiveAction: 'Confirm system and drive contract speed match. Check door contacts and wiring.',
    },
    {
      code: '68',
      description: 'Car speed exceeded 150 fpm with front top lock open.',
      correctiveAction: 'Confirm system and drive contract speed match. Check door contacts and wiring.',
    },
    {
      code: '69',
      description: 'Car  speed exceeded 150 fpm with front middle lock open.',
      correctiveAction: 'Confirm system and drive contract speed match. Check door contacts and wiring.',
    },
    {
      code: '70',
      description: 'Car  speed exceeded 150 fpm with front bottom lock open.',
      correctiveAction: 'Confirm system and drive contract speed match. Check door contacts and wiring.',
    },
    {
      code: '71',
      description: 'Car speed exceeded 150 fpm with rear gateswitch open.',
      correctiveAction: 'Confirm system and drive contract speed match. Check door contacts and wiring.',
    },
    {
      code: '72',
      description: 'Car speed exceeded 150 fpm with rear top lock open.',
      correctiveAction: 'Confirm system and drive contract speed match. Check door contacts and wiring.',
    },
    {
      code: '73',
      description: 'Car  speed exceeded 150 fpm with rear middle lock open.',
      correctiveAction: 'Confirm system and drive contract speed match. Check door contacts and wiring.',
    },
    {
      code: '74',
      description: 'Car  speed exceeded 150 fpm with rear bottom lock open.',
      correctiveAction: 'Confirm system and drive contract speed match. Check door contacts and wiring.',
    },
    {
      code: '75',
      description: 'Car is out of service on flood operation.',
      correctiveAction: 'NA',
    },
    {
      code: '76',
      description: 'Necessary door inputs are not programmed and the doors cannot function.',
      correctiveAction: 'Program the necessary door inputs.',
    },
    {
      code: '77',
      description: 'CPU stop switch is ON for the machine room board.',
      correctiveAction: 'Turn off DIP A1 on the machine room board.',
    },
    {
      code: '78',
      description: 'CPU stop switch is ON for the machine room board.',
      correctiveAction: 'Turn off DIP A1 on the machine room board.',
    },
    {
      code: '79',
      description: 'CPU stop switch is ON for the car top board.',
      correctiveAction: 'Turn off DIP A1 on the car top board.',
    },
    {
      code: '80',
      description: 'CPU stop switch is ON for the car top board.',
      correctiveAction: 'Turn off DIP A1 on the car top board.',
    },
    {
      code: '81',
      description: 'CPU stop switch is ON for the car operating panel board.',
      correctiveAction: 'Turn off DIP A1 on the car operating panel board.',
    },
    {
      code: '82',
      description: 'CPU stop switch is ON for the car operating panel board.',
      correctiveAction: 'Turn off DIP A1 on the car operating panel board.',
    },
    {
      code: '83',
      description: 'A system configuration parameter was changed. The system must be power cycled.',
      correctiveAction: 'Cycle power to the system.',
    },
    {
      code: '84',
      description: 'Number of floors setting is outside the valid range.',
      correctiveAction: 'Set number of floors to a value from 2 to 64.',
    },
    {
      code: '85',
      description: 'Contract speed setting is outside the valid range.',
      correctiveAction: 'Set contract speed to a value from 10 to 1600.',
    },
    {
      code: '86',
      description: 'Inspection speed setting is outside the valid range.',
      correctiveAction: 'Set inspection speed to a value from 0 to 150.',
    },
    {
      code: '87',
      description: 'Learn speed setting is outside the valid range.',
      correctiveAction: 'Set learn speed to a value from 10 to contract speed.',
    },
    {
      code: '88',
      description: 'Terminal speed setting is outside the valid range.',
      correctiveAction: 'Set terminal speed to a value from 0 to 30.',
    },
    {
      code: '89',
      description: 'Leveling speed setting is outside the valid range.',
      correctiveAction: 'Set leveling speed to a value from 1 to 20.',
    },
    {
      code: '90',
      description: 'NTS speed setting is outside the valid range.',
      correctiveAction: 'Set NTS speed to a value from 1 to 20.',
    },
    {
      code: '91',
      description: 'Learned floor positions are invalid. ',
      correctiveAction: 'Set machine room DIP A5 and follow on screen instructions to learn floor positions.',
    },
    {
      code: '92',
      description: 'Normal profile ETS points are not of increasing in position/speed value or a trip speed exceeds contract speed.',
      correctiveAction: 'Cycle power to the system or edit an S-Curve parameter to trigger a ETS point recalculation.',
    },
    {
      code: '93',
      description: 'Inspection profile ETS points are not of increasing in position/speed value or a trip speed exceeds contract speed.',
      correctiveAction: 'Cycle power to the system or edit an S-Curve parameter to trigger a ETS point recalculation.',
    },
    {
      code: '94',
      description: 'Emergency profile ETS points are not of increasing in position/speed value or a trip speed exceeds contract speed.',
      correctiveAction: 'Cycle power to the system or edit an S-Curve parameter to trigger a ETS point recalculation.',
    },
    {
      code: '95',
      description: 'Short profile ETS points are not of increasing in position/speed value or a trip speed exceeds contract speed.',
      correctiveAction: 'Cycle power to the system or edit an S-Curve parameter to trigger a ETS point recalculation.',
    },
    {
      code: '96',
      description: 'Car is at a learned floor level but is missng the door zone signal.',
      correctiveAction: 'Adjust the learned floor position or door zone magnet at the fault position.',
    },
    {
      code: '97',
      description: 'Fire stop switch (COP-SF3) input is missing.',
      correctiveAction: 'Check wiring and safety contacts.',
    },
    {
      code: '98',
      description: 'Gate switch jumper was detected. Gate switch input must go low to clear.',
      correctiveAction: 'Remove jumper or increase the door jumper timeout setting.',
    },
    {
      code: '99',
      description: 'Lock jumper was detected. A lock input must go low to clear.',
      correctiveAction: 'Remove jumper or increase the door jumper timeout setting.',
    },
    {
      code: '100',
      description: 'A lock was stuck open when closing doors.',
      correctiveAction: 'NA',
    },
    {
      code: '101',
      description: 'Gate switch stuck open when closing doors.',
      correctiveAction: 'NA',
    },
    {
      code: '102',
      description: 'Door failed to open.',
      correctiveAction: 'NA',
    },
    {
      code: '103',
      description: 'Door failed to close.',
      correctiveAction: 'NA',
    },
    {
      code: '104',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '105',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '106',
      description: 'Door signals were unexpectedly lost.',
      correctiveAction: 'NA',
    },
    {
      code: '107',
      description: 'Gate switch jumper was detected. Gate switch input must go low to clear.',
      correctiveAction: 'Remove jumper or increase the door jumper timeout setting.',
    },
    {
      code: '108',
      description: 'Lock jumper was detected. A lock input must go low to clear.',
      correctiveAction: 'Remove jumper or increase the door jumper timeout setting.',
    },
    {
      code: '109',
      description: 'A lock was stuck open when closing doors.',
      correctiveAction: 'NA',
    },
    {
      code: '110',
      description: 'Gate switch stuck open when closing doors.',
      correctiveAction: 'NA',
    },
    {
      code: '111',
      description: 'Door failed to open.',
      correctiveAction: 'NA',
    },
    {
      code: '112',
      description: 'Door failed to close.',
      correctiveAction: 'NA',
    },
    {
      code: '113',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '114',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '115',
      description: 'Door signals were unexpectedly lost.',
      correctiveAction: 'NA',
    },
    {
      code: '116',
      description: 'Car made a signle run that exceeded the run time limit.',
      correctiveAction: 'Adjust max runtime setting.',
    },
    {
      code: '117',
      description: 'EB3 or EB4 bypass relay is stuck in the ON position.',
      correctiveAction: 'NA',
    },
    {
      code: '118',
      description: 'Machine room processor A parameter edit buffer overflowed.',
      correctiveAction: 'Reduce rate of parameter edit requests.',
    },
    {
      code: '119',
      description: 'Machine room processor B parameter edit buffer overflowed.',
      correctiveAction: 'Reduce rate of parameter edit requests.',
    },
    {
      code: '120',
      description: 'Car top processor A parameter edit buffer overflowed.',
      correctiveAction: 'Reduce rate of parameter edit requests.',
    },
    {
      code: '121',
      description: 'Car top processor B parameter edit buffer overflowed.',
      correctiveAction: 'Reduce rate of parameter edit requests.',
    },
    {
      code: '122',
      description: 'Car operating panel processor A parameter edit buffer overflowed.',
      correctiveAction: 'Reduce rate of parameter edit requests.',
    },
    {
      code: '123',
      description: 'Car operating panel processor B parameter edit buffer overflowed.',
      correctiveAction: 'Reduce rate of parameter edit requests.',
    },
    {
      code: '124',
      description: 'MR-A processor reported offline by CT-A processor.',
      correctiveAction: 'Check wiring of communcation lines. Check for stalled HB LEDs.',
    },
    {
      code: '125',
      description: 'MR-A processor reported offline by COP-A processor.',
      correctiveAction: 'Check wiring of communcation lines. Check for stalled HB LEDs.',
    },
    {
      code: '126',
      description: 'MR-A processor reported offline by MR-B processor.',
      correctiveAction: 'Check wiring of communcation lines. Check for stalled HB LEDs.',
    },
    {
      code: '127',
      description: 'CT-A processor reported offline by MR-A processor.',
      correctiveAction: 'Check wiring of communcation lines. Check for stalled HB LEDs.',
    },
    {
      code: '128',
      description: 'CT-A processor reported offline by COP-A processor.',
      correctiveAction: 'Check wiring of communcation lines. Check for stalled HB LEDs.',
    },
    {
      code: '129',
      description: 'CT-A processor reported offline by CT-B processor.',
      correctiveAction: 'Check wiring of communcation lines. Check for stalled HB LEDs.',
    },
    {
      code: '130',
      description: 'COP-A processor reported offline by MR-A processor.',
      correctiveAction: 'Check wiring of communcation lines. Check for stalled HB LEDs.',
    },
    {
      code: '131',
      description: 'COP-A processor reported offline by CT-A processor.',
      correctiveAction: 'Check wiring of communcation lines. Check for stalled HB LEDs.',
    },
    {
      code: '132',
      description: 'COP-A processor reported offline by COP-B processor.',
      correctiveAction: 'Check wiring of communcation lines. Check for stalled HB LEDs.',
    },
    {
      code: '133',
      description: 'MR-B processor reported offline by MR-A processor.',
      correctiveAction: 'Check wiring of communcation lines. Check for stalled HB LEDs.',
    },
    {
      code: '134',
      description: 'CT-B processor reported offline by CT-A processor.',
      correctiveAction: 'Check wiring of communcation lines. Check for stalled HB LEDs.',
    },
    {
      code: '135',
      description: 'COP-B processor reported offline by COP-A processor.',
      correctiveAction: 'Check wiring of communcation lines. Check for stalled HB LEDs.',
    },
    {
      code: '136',
      description: 'Processor was reset, triggered by power loss or user reset.',
      correctiveAction: 'NA',
    },
    {
      code: '137',
      description: 'Processor was reset, triggered by power loss or user reset.',
      correctiveAction: 'NA',
    },
    {
      code: '138',
      description: 'Processor was reset, triggered by power loss or user reset.',
      correctiveAction: 'NA',
    },
    {
      code: '139',
      description: 'Processor was reset, triggered by power loss or user reset.',
      correctiveAction: 'NA',
    },
    {
      code: '140',
      description: 'Processor was reset, triggered by power loss or user reset.',
      correctiveAction: 'NA',
    },
    {
      code: '141',
      description: 'Processor was reset, triggered by power loss or user reset.',
      correctiveAction: 'NA',
    },
    {
      code: '142',
      description: 'Processor was reset, triggered by watch dog.',
      correctiveAction: 'NA',
    },
    {
      code: '143',
      description: 'Processor was reset, triggered by watch dog.',
      correctiveAction: 'NA',
    },
    {
      code: '144',
      description: 'Processor was reset, triggered by watch dog.',
      correctiveAction: 'NA',
    },
    {
      code: '145',
      description: 'Processor was reset, triggered by watch dog.',
      correctiveAction: 'NA',
    },
    {
      code: '146',
      description: 'Processor was reset, triggered by watch dog.',
      correctiveAction: 'NA',
    },
    {
      code: '147',
      description: 'Processor was reset, triggered by watch dog.',
      correctiveAction: 'NA',
    },
    {
      code: '148',
      description: 'Processor was reset, triggered by dip in board voltage.',
      correctiveAction: 'NA',
    },
    {
      code: '149',
      description: 'Processor was reset, triggered by dip in board voltage.',
      correctiveAction: 'NA',
    },
    {
      code: '150',
      description: 'Processor was reset, triggered by dip in board voltage.',
      correctiveAction: 'NA',
    },
    {
      code: '151',
      description: 'Processor was reset, triggered by dip in board voltage.',
      correctiveAction: 'NA',
    },
    {
      code: '152',
      description: 'Processor was reset, triggered by dip in board voltage.',
      correctiveAction: 'NA',
    },
    {
      code: '153',
      description: 'Processor was reset, triggered by dip in board voltage.',
      correctiveAction: 'NA',
    },
    {
      code: '154',
      description: 'Hoistway safety (MR-SFH) input missing.',
      correctiveAction: 'Check wiring and safety contacts.',
    },
    {
      code: '155',
      description: 'Machine room safety (MR-SFM) input missing.',
      correctiveAction: 'Check wiring and safety contacts.',
    },
    {
      code: '156',
      description: 'Pit (MR-PIT) input missing.',
      correctiveAction: 'Check wiring and safety contacts.',
    },
    {
      code: '157',
      description: 'Buffer (MR-BUF) input missing.',
      correctiveAction: 'Check wiring and safety contacts.',
    },
    {
      code: '158',
      description: 'Top final limit (MR-TFL) input missing.',
      correctiveAction: 'Check wiring and safety contacts.',
    },
    {
      code: '159',
      description: 'Bottom final limit (MR-BFL) input missing.',
      correctiveAction: 'Check wiring and safety contacts.',
    },
    {
      code: '160',
      description: 'Car top switch (CT-SF1) input missing.',
      correctiveAction: 'Check wiring and safety contacts.',
    },
    {
      code: '161',
      description: 'Car top escape hatch (CT-SF2) input missing.',
      correctiveAction: 'Check wiring and safety contacts.',
    },
    {
      code: '162',
      description: 'Car top car safeties (CT-SF3) input missing.',
      correctiveAction: 'Check wiring and safety contacts.',
    },
    {
      code: '163',
      description: 'Front top lock is open.',
      correctiveAction: 'Check wiring and safety contacts.',
    },
    {
      code: '164',
      description: 'Front middle lock is open.',
      correctiveAction: 'Check wiring and safety contacts.',
    },
    {
      code: '165',
      description: 'Front bototm lock is open.',
      correctiveAction: 'Check wiring and safety contacts.',
    },
    {
      code: '166',
      description: 'Rear top lock is open.',
      correctiveAction: 'Check wiring and safety contacts.',
    },
    {
      code: '167',
      description: 'Rear middle lock is open.',
      correctiveAction: 'Check wiring and safety contacts.',
    },
    {
      code: '168',
      description: 'Rear bottom lock is open.',
      correctiveAction: 'Check wiring and safety contacts.',
    },
    {
      code: '169',
      description: 'Front gate switch is open.',
      correctiveAction: 'Check wiring and safety contacts.',
    },
    {
      code: '170',
      description: 'Rear gate switch is open.',
      correctiveAction: 'Check wiring and safety contacts.',
    },
    {
      code: '171',
      description: 'New FRAM chip detected and formatting is in progress.',
      correctiveAction: 'NA',
    },
    {
      code: '172',
      description: 'FRAM read or write request was unsuccessful.',
      correctiveAction: 'NA',
    },
    {
      code: '173',
      description: 'Attempt to format FRAM chip has failed.',
      correctiveAction: 'NA',
    },
    {
      code: '174',
      description: 'Machine room 120 VAC supply is missing.',
      correctiveAction: 'Check wiring and safety contacts.',
    },
    {
      code: '175',
      description: 'A motion control error has occurred.',
      correctiveAction: 'NA',
    },
    {
      code: '176',
      description: 'Motion start sequence aborted due to unsafe door state.',
      correctiveAction: 'Check door contacts.',
    },
    {
      code: '177',
      description: 'NA', correctiveAction: 'NA',
    },
    {
      code: '178',
      description: 'Motion start sequence aborted due to missing M contactor feedback.',
      correctiveAction: 'NA',
    },
    {
      code: '179',
      description: 'Motion start sequence aborted due to missing serial drive control feedback.',
      correctiveAction: 'NA',
    },
    {
      code: '180',
      description: 'Motion start sequence aborted due to missing B2 contactor feedback.',
      correctiveAction: 'NA',
    },
    {
      code: '181',
      description: 'Motion start sequence aborted due to missing BPS feedback.',
      correctiveAction: 'Verify BPS wiring and inversion parameter.',
    },
    {
      code: '182',
      description: 'Requested run distance is too short (less than 0.25 inch).',
      correctiveAction: 'Verify the car is not rolling back at the start of run.',
    },
    {
      code: '183',
      description: 'Motion stop sequence aborted after failing to ramp to zero speed.',
      correctiveAction: 'NA',
    },
    {
      code: '184',
      description: 'Motion stop sequence aborted after failing to achieve encoder speed of or below 1 fpm.',
      correctiveAction: 'NA',
    },
    {
      code: '185',
      description: 'Motion stop sequence aborted after failing BPS check.',
      correctiveAction: 'Verify BPS wiring and inversion parameter.',
    },
    {
      code: '186',
      description: 'NA', correctiveAction: 'NA',
    },
    {
      code: '187',
      description: 'Motion stop sequence aborted after failing to drop the M contactor.',
      correctiveAction: 'NA',
    },
    {
      code: '188',
      description: 'Motion stop sequence aborted after failing to complete preflight.',
      correctiveAction: 'NA',
    },
    {
      code: '189',
      description: 'Brake pick switch feedback indicates brake is stuck closed during a run.',
      correctiveAction: 'Reset machine room board to clear. Check BPS wiring, NC and correct brake voltage settings.',
    },
    {
      code: '190',
      description: 'Brake pick switch feedback indicates brake is stuck open while car is stopped.',
      correctiveAction: 'Reset machine room board to clear. Check BPS wiring, NC and correct brake voltage settings.',
    },
    {
      code: '191',
      description: 'Rope gripper relay EB2 was dropped.',
      correctiveAction: 'NA',
    },
    {
      code: '192',
      description: 'EB2 relay is stuck.',
      correctiveAction: 'Verify the relay is tightly seated on its connector.',
    },
    {
      code: '193',
      description: 'Brake board communication was lost. Reported by the main system.',
      correctiveAction: 'Check CAN bus wiring and termination.',
    },
    {
      code: '194',
      description: 'Brake board reporting an unknown state.',
      correctiveAction: 'NA',
    },
    {
      code: '195',
      description: 'Brake board recovering from reset due to power loss.',
      correctiveAction: 'NA',
    },
    {
      code: '196',
      description: 'Brake board recovering from reset due to watch dog.',
      correctiveAction: 'NA',
    },
    {
      code: '197',
      description: 'Brake board reporting communication loss.',
      correctiveAction: 'Check CAN bus wiring and termination.',
    },
    {
      code: '198',
      description: 'Brake board reporting a  gate driver fault.',
      correctiveAction: 'Check wiring on brake board\'s high voltage connections.',
    },
    {
      code: '199',
      description: 'Brake board reporting MOSFET failure.',
      correctiveAction: 'Check wiring on brake board\'s high voltage connections.',
    },
    {
      code: '200',
      description: 'Brake board reporting CAN bus reset.',
      correctiveAction: 'Check for short on the CAN bus.',
    },
    {
      code: '201',
      description: 'Brake board reporting DIP switch settings in conflict with another board.',
      correctiveAction: 'Check system brake boards for identical DIP1 state.',
    },
    {
      code: '202',
      description: 'Brake board recovering from reset due to voltage dip.',
      correctiveAction: 'NA',
    },
    {
      code: '203',
      description: 'Brake board does not detect an AC voltage source. Only valid on 20A brake boards.',
      correctiveAction: 'Check that the board has a valid AC power source.',
    },
    {
      code: '204',
      description: 'Brake board communication was lost. Reported by the main system.',
      correctiveAction: 'Check CAN bus wiring and termination.',
    },
    {
      code: '205',
      description: 'Brake board reporting an unknown state.',
      correctiveAction: 'NA',
    },
    {
      code: '206',
      description: 'Brake board recovering from reset due to power loss.',
      correctiveAction: 'NA',
    },
    {
      code: '207',
      description: 'Brake board recovering from reset due to watch dog.',
      correctiveAction: 'NA',
    },
    {
      code: '208',
      description: 'Brake board reporting communication loss.',
      correctiveAction: 'Check CAN bus for correct wiring and termination.',
    },
    {
      code: '209',
      description: 'Brake board reporting a  gate driver fault.',
      correctiveAction: 'Check wiring on brake board\'s high voltage connections.',
    },
    {
      code: '210',
      description: 'Brake board reporting MOSFET failure.',
      correctiveAction: 'Check wiring on brake board\'s high voltage connections.',
    },
    {
      code: '211',
      description: 'Brake board reporting CAN bus reset.',
      correctiveAction: 'Check for short on the CAN bus.',
    },
    {
      code: '212',
      description: 'Brake board reporting DIP switch settings in conflict with another board.',
      correctiveAction: 'Check system brake boards for identical DIP1 state.',
    },
    {
      code: '213',
      description: 'Brake board recovering from reset due to voltage dip.',
      correctiveAction: 'NA',
    },
    {
      code: '214',
      description: 'Brake board does not detect an AC voltage source. Only valid on 20A brake boards.',
      correctiveAction: 'Check that the board has a valid AC power source.',
    },
    {
      code: '215',
      description: 'CPLD reporting a startup state.',
      correctiveAction: '',
    },
    {
      code: '216',
      description: 'CPLD reporting unintended movement.',
      correctiveAction: 'Press the EBRK RST button to clear.',
    },
    {
      code: '217',
      description: 'CPLD reporting a governor fault.',
      correctiveAction: 'Press the EBRK RST button to clear.',
    },
    {
      code: '218',
      description: 'CPLD reporting a redundancy fault.',
      correctiveAction: 'NA',
    },
    {
      code: '219',
      description: 'CPLD reporting loss of CN2 network communcation.',
      correctiveAction: 'Check for miswiring on the CN2 network. Check CT/COP toggle switch.',
    },
    {
      code: '220',
      description: 'CPLD reporting loss of a nonbypass input.',
      correctiveAction: 'Check machine room and car top safety inputs.',
    },
    {
      code: '221',
      description: 'CPLD reporting loss of in car stop input.',
      correctiveAction: 'Check COP SF2 input.',
    },
    {
      code: '222',
      description: 'CPLD reporting invalid inspection mode.',
      correctiveAction: 'An invalid set of inspection switches are active.',
    },
    {
      code: '223',
      description: 'CPLD reporting loss of SFH input.',
      correctiveAction: 'Check machine room SFH input.',
    },
    {
      code: '224',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '225',
      description: 'CPLD reporting invalid access switch and lock combination.',
      correctiveAction: 'NA',
    },
    {
      code: '226',
      description: 'CPLD reporting lock open.',
      correctiveAction: 'NA',
    },
    {
      code: '227',
      description: 'CPLD reporting gateswitch open.',
      correctiveAction: 'NA',
    },
    {
      code: '228',
      description: 'CPLD reporting a bypass switch is active.',
      correctiveAction: 'NA',
    },
    {
      code: '229',
      description: 'CPLD reporting preflight failure.',
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
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '233',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '234',
      description: 'Door zone stuck high and over six inches from the closest learned floor position.',
      correctiveAction: 'Check DZ input wiring (CT-503/504). Check for obstruction of the DZ sensor.',
    },
    {
      code: '235',
      description: 'Car moving outside the mode defined position limit.',
      correctiveAction: 'Option to bypass term limits is avaliable.',
    },
    {
      code: '236',
      description: 'Attempting a manual run outside specified the current position limits.',
      correctiveAction: 'Option to bypass term limits is avaliable.',
    },
    {
      code: '237',
      description: 'Requested acceleration curve is invalid.',
      correctiveAction: 'Increase current s-curve acceleration rate parameters.',
    },
    {
      code: '238',
      description: 'Requested deceleration curve is invalid.',
      correctiveAction: 'Increase current s-curve deceleration rate parameters.',
    },
    {
      code: '239',
      description: 'Requested mid run acceleration curve is invalid.',
      correctiveAction: 'Increase current s-curve acceleration rate parameters.',
    },
    {
      code: '240',
      description: 'Requested mid run deceleration curve is invalid.',
      correctiveAction: 'Increase current s-curve deceleration rate parameters.',
    },
    {
      code: '241',
      description: 'Normal profile s-curve settings are invalid.',
      correctiveAction: 'Increase the profile\'s acceleration or deceleration rate parameters.',
    },
    {
      code: '242',
      description: 'Inspection profile s-curve settings are invalid.',
      correctiveAction: 'Increase the profile\'s acceleration or deceleration rate parameters.',
    },
    {
      code: '243',
      description: 'E-Power profile s-curve settings are invalid.',
      correctiveAction: 'Increase the profile\'s acceleration or deceleration rate parameters.',
    },
    {
      code: '244',
      description: 'Short profile s-curve settings are invalid.',
      correctiveAction: 'Increase the profile\'s acceleration or deceleration rate parameters.',
    },
    {
      code: '245',
      description: 'SFM relay is stuck.',
      correctiveAction: 'Verify the relay is tightly seated on its connector.',
    },
    {
      code: '246',
      description: 'Car is overloaded.',
      correctiveAction: 'Remove weight from the car.',
    },
    {
      code: '247',
      description: 'Preflight test failed.',
      correctiveAction: 'NA',
    },
    {
      code: '248',
      description: 'Preflight test failed.',
      correctiveAction: 'NA',
    },
    {
      code: '249',
      description: 'Preflight test failed.',
      correctiveAction: 'NA',
    },
    {
      code: '250',
      description: 'Parameters are syncronizing.',
      correctiveAction: 'NA',
    },
    {
      code: '251',
      description: 'Parameters are syncronizing.',
      correctiveAction: 'NA',
    },
    {
      code: '252',
      description: 'Parameters are syncronizing.',
      correctiveAction: 'NA',
    },
    {
      code: '253',
      description: 'Motion parameters are being recalculated.',
      correctiveAction: 'NA',
    },
    {
      code: '254',
      description: 'Regen unit reporting a fault state.',
      correctiveAction: 'Check regen status and the regen fault input wiring.',
    },
    {
      code: '255',
      description: 'The encoder speed has exceeded the speed command by over 25 fpm.',
      correctiveAction: 'Option to disable this fault is available via 01-0073.',
    },
    {
      code: '256',
      description: 'Emergency brake pick switch feedback indicates emergency brake is stuck closed during a run.',
      correctiveAction: 'Check BPS wiring, NC and correct brake voltage settings.',
    },
    {
      code: '257',
      description: 'Emergency brake pick switch feedback indicates emergency brake is stuck open while car is stopped.',
      correctiveAction: 'Check BPS wiring, NC and correct brake voltage settings.',
    },
    {
      code: '258',
      description: 'Rear door DIP switch and parameter do not match.',
      correctiveAction: 'Match DIP and parameter setting.',
    },
    {
      code: '259',
      description: 'Enable landing inspection DIP switch and parameter do not match.',
      correctiveAction: 'Match DIP and parameter setting.',
    },
    {
      code: '260',
      description: 'Enable pit inspection DIP switch and parameter do not match.',
      correctiveAction: 'Match DIP and parameter setting.',
    },
    {
      code: '261',
      description: 'DIP B8 is on while not performing the unintended movement acceptance test.',
      correctiveAction: 'Move to unintended movement acceptance test or clear DIP B8.',
    },
    {
      code: '262',
      description: 'Construction mode is required when the motor learn DIP switch is ON.',
      correctiveAction: 'Move to construction mode or clear DIP A6.',
    },
    {
      code: '263',
      description: 'Both IC and CT inspection switches are required for CT inspection operation.',
      correctiveAction: 'Assert both IC and CT inspection switches. Optionally turn off this parameter enabled option.',
    },
    {
      code: '264',
      description: 'Drive\'s serial speed reg signal is stuck high when it should be commanded low.',
      correctiveAction: 'Check drive\'s speed reg settings for correct serial mapping.',
    },
    {
      code: '265',
      description: 'B contactor feedback is stuck high.',
      correctiveAction: 'Check the wiring to and from the B contactor.',
    },
    {
      code: '266',
      description: 'Drive\'s serial speed reg signal is stuck low when should be commanded high.',
      correctiveAction: 'Check drive\'s speed reg settings for correct serial mapping.',
    },
    {
      code: '267',
      description: 'B contactor feedback is stuck low.',
      correctiveAction: 'Check the wiring to and from the B contactor.',
    },
    {
      code: '268',
      description: 'Unused (valid only for SR-3032K)',
      correctiveAction: 'NA',
    },
    {
      code: '269',
      description: 'Communication loss between system and master or master and slave expansions',
      correctiveAction: 'Check expansion 1-8 CAN bus wiring',
    },
    {
      code: '270',
      description: 'Communication loss between system and master or master and slave expansions',
      correctiveAction: 'Check expansion 9-16 CAN bus wiring',
    },
    {
      code: '271',
      description: 'Communication loss between system and master or master and slave expansions',
      correctiveAction: 'Check expansion 17-24 CAN bus wiring',
    },
    {
      code: '272',
      description: 'Communication loss between system and master or master and slave expansions',
      correctiveAction: 'Check expansion 25-32 CAN bus wiring',
    },
    {
      code: '273',
      description: 'Communication loss between system and master or master and slave expansions',
      correctiveAction: 'Check expansion 33-40 CAN bus wiring',
    },
    {
      code: '274',
      description: 'Communication loss between system and master or master and slave expansions',
      correctiveAction: 'Check expansion 41-48 CAN bus wiring',
    },
    {
      code: '275',
      description: 'Communication loss between system and master or master and slave expansions',
      correctiveAction: 'Check expansion 49-56 CAN bus wiring',
    },
    {
      code: '276',
      description: 'Communication loss between system and master or master and slave expansions',
      correctiveAction: 'Check expansion 57-64 CAN bus wiring',
    },
    {
      code: '277',
      description: 'Communication loss between system and master or master and slave expansions',
      correctiveAction: 'Check expansion 65-72 CAN bus wiring',
    },
    {
      code: '278',
      description: 'Communication loss between system and master or master and slave expansions',
      correctiveAction: 'Check expansion 73-80 CAN bus wiring',
    },
    {
      code: '279',
      description: 'Communication loss between system and master or master and slave expansions',
      correctiveAction: 'Check expansion 81-88 CAN bus wiring',
    },
    {
      code: '280',
      description: 'Communication loss between system and master or master and slave expansions',
      correctiveAction: 'Check expansion 89-96 CAN bus wiring',
    },
    {
      code: '281',
      description: 'Communication loss between system and master or master and slave expansions',
      correctiveAction: 'Check expansion 97-104 CAN bus wiring',
    },
    {
      code: '282',
      description: 'Communication loss between system and master or master and slave expansions',
      correctiveAction: 'Check expansion 105-112 CAN bus wiring',
    },
    {
      code: '283',
      description: 'Communication loss between system and master or master and slave expansions',
      correctiveAction: 'Check expansion 113-120 CAN bus wiring',
    },
    {
      code: '284',
      description: 'Two or more expansion boards have the same master DIP switch 1 settings.',
      correctiveAction: 'Check if two or more master expansions have master 1 dip settings',
    },
    {
      code: '285',
      description: 'Two or more expansion boards have the same master DIP switch 2 settings.',
      correctiveAction: 'Check if two or more master expansions have master 2 dip settings',
    },
    {
      code: '286',
      description: 'Two or more expansion boards have the same master DIP switch 3 settings.',
      correctiveAction: 'Check if two or more master expansions have master 3 dip settings',
    },
    {
      code: '287',
      description: 'Two or more expansion boards have the same master DIP switch 4 settings.',
      correctiveAction: 'Check if two or more master expansions have master 4 dip settings',
    },
    {
      code: '288',
      description: 'Two or more expansion boards have the same master DIP switch 5 settings.',
      correctiveAction: 'Check if two or more master expansions have master 5 dip settings',
    },
    {
      code: '289',
      description: 'Two or more expansion boards have the same master DIP switch 6 settings.',
      correctiveAction: 'Check if two or more master expansions have master 6 dip settings',
    },
    {
      code: '290',
      description: 'Two or more expansion boards have the same master DIP switch 7 settings.',
      correctiveAction: 'Check if two or more master expansions have master 7 dip settings',
    },
    {
      code: '291',
      description: 'Two or more expansion boards have the same master DIP switch 8 settings.',
      correctiveAction: 'Check if two or more master expansions have master 8 dip settings',
    },
    {
      code: '292',
      description: 'Two or more expansion boards have the same master DIP switch 9 settings.',
      correctiveAction: 'Check if two or more master expansions have master 9 dip settings',
    },
    {
      code: '293',
      description: 'Two or more expansion boards have the same master DIP switch 10 settings.',
      correctiveAction: 'Check if two or more master expansions have master 10 dip settings',
    },
    {
      code: '294',
      description: 'Two or more expansion boards have the same master DIP switch 11 settings.',
      correctiveAction: 'Check if two or more master expansions have master 11 dip settings',
    },
    {
      code: '295',
      description: 'Two or more expansion boards have the same master DIP switch 12 settings.',
      correctiveAction: 'Check if two or more master expansions have master 12 dip settings',
    },
    {
      code: '296',
      description: 'Two or more expansion boards have the same master DIP switch 13 settings.',
      correctiveAction: 'Check if two or more master expansions have master 13 dip settings',
    },
    {
      code: '297',
      description: 'Two or more expansion boards have the same master DIP switch 14 settings.',
      correctiveAction: 'Check if two or more master expansions have master 14 dip settings',
    },
    {
      code: '298',
      description: 'Two or more expansion boards have the same master DIP switch 15 settings.',
      correctiveAction: 'Check if two or more master expansions have master 15 dip settings',
    },
    {
      code: '299',
      description: 'There is overlap between the hall call, medical, and swing masks.',
      correctiveAction: 'NA',
    },
    {
      code: '300',
      description: 'Car has been taken out of service. Triggering source is undefined.',
      correctiveAction: 'Clear OOS by moving to inspection mode.',
    },
    {
      code: '301',
      description: 'Two or more group cars have the same car ID.',
      correctiveAction: 'NA',
    },
    {
      code: '302',
      description: 'After moving to rescue operation, the car waits a minimum of 2 seconds before beginning rescue.',
      correctiveAction: 'NA',
    },
    {
      code: '303',
      description: 'The car has arrived at the nearest opening, opened its doors, and gone out of service.',
      correctiveAction: 'NA',
    },
    {
      code: '304',
      description: 'Auto: No valid recall floor was found. Manual: Invalid run state.',
      correctiveAction: 'Turn off automatic resuce and perform a manual rescue.',
    },
    {
      code: '305',
      description: 'Machine room safety input (SFM) was lost.',
      correctiveAction: 'Check wiring and safety contacts.',
    },
    {
      code: '306',
      description: 'Communication with CEDES channel 1 was lost.',
      correctiveAction: 'Check camera wiring.',
    },
    {
      code: '307',
      description: 'CEDES channel 1 reporting a failure to read error.',
      correctiveAction: 'Clean the tape. Align the tape with the camera.',
    },
    {
      code: '308',
      description: 'CEDES channel 1 reporting the tape is aligned too close relative to the camera.',
      correctiveAction: 'Clean the tape. Align the tape with the camera.',
    },
    {
      code: '309',
      description: 'CEDES channel 1 reporting the tape is aligned too far relative to the camera.',
      correctiveAction: 'Clean the tape. Align the tape with the camera.',
    },
    {
      code: '310',
      description: 'CEDES channel 1 reporting the tape is aligned too left relative to the camera.',
      correctiveAction: 'Clean the tape. Align the tape with the camera.',
    },
    {
      code: '311',
      description: 'CEDES channel 1 reporting the tape is aligned too right relative to the camera.',
      correctiveAction: 'Clean the tape. Align the tape with the camera.',
    },
    {
      code: '312',
      description: 'CEDES channel 1 reporting an internal error.',
      correctiveAction: 'NA',
    },
    {
      code: '313',
      description: 'CEDES channel 1 reporting a communication error.',
      correctiveAction: 'NA',
    },
    {
      code: '314',
      description: 'CEDES channel 1 reporting a position cross check error.',
      correctiveAction: 'NA',
    },
    {
      code: '315',
      description: 'CEDES channel 1 reporting a velocity cross check error.',
      correctiveAction: 'NA',
    },
    {
      code: '316',
      description: 'CEDES channel 1 reporting a cross check error.',
      correctiveAction: 'NA',
    },
    {
      code: '317',
      description: 'CEDES channel 1 reporting a position cross check error.',
      correctiveAction: 'NA',
    },
    {
      code: '318',
      description: 'CEDES channel 1 reporting a velocity cross check error.',
      correctiveAction: 'NA',
    },
    {
      code: '319',
      description: 'CEDES channel 1 reporting a cross check error.',
      correctiveAction: 'NA',
    },
    {
      code: '320',
      description: 'Communication with CEDES channel 2 was lost.',
      correctiveAction: 'Check camera wiring.',
    },
    {
      code: '321',
      description: 'CEDES channel 2 reporting a failure to read error.',
      correctiveAction: 'Clean the tape. Align the tape with the camera.',
    },
    {
      code: '322',
      description: 'CEDES channel 2 reporting the tape is aligned too close relative to the camera.',
      correctiveAction: 'Clean the tape. Align the tape with the camera.',
    },
    {
      code: '323',
      description: 'CEDES channel 2 reporting the tape is aligned too far relative to the camera.',
      correctiveAction: 'Clean the tape. Align the tape with the camera.',
    },
    {
      code: '324',
      description: 'CEDES channel 2 reporting the tape is aligned too left relative to the camera.',
      correctiveAction: 'Clean the tape. Align the tape with the camera.',
    },
    {
      code: '325',
      description: 'CEDES channel 2 reporting the tape is aligned too right relative to the camera.',
      correctiveAction: 'Clean the tape. Align the tape with the camera.',
    },
    {
      code: '326',
      description: 'CEDES channel 2 reporting an internal error.',
      correctiveAction: 'NA',
    },
    {
      code: '327',
      description: 'CEDES channel 2 reporting a communication error.',
      correctiveAction: 'NA',
    },
    {
      code: '328',
      description: 'CEDES channel 2 reporting a position cross check error.',
      correctiveAction: 'NA',
    },
    {
      code: '329',
      description: 'CEDES channel 2 reporting a velocity cross check error.',
      correctiveAction: 'NA',
    },
    {
      code: '330',
      description: 'CEDES channel 2 reporting a cross check error.',
      correctiveAction: 'NA',
    },
    {
      code: '331',
      description: 'CEDES channel 2 reporting a position cross check error.',
      correctiveAction: 'NA',
    },
    {
      code: '332',
      description: 'CEDES channel 2 reporting a velocity cross check error.',
      correctiveAction: 'NA',
    },
    {
      code: '333',
      description: 'CEDES channel 2 reporting a cross check error.',
      correctiveAction: 'NA',
    },
    {
      code: '334',
      description: 'Car is on emergency power and not configured to return to automatic operation.',
      correctiveAction: 'NA',
    },
    {
      code: '335',
      description: 'Parking floor is set to a landing with no openings.',
      correctiveAction: 'NA',
    },
    {
      code: '336',
      description: 'Main fire recall floor and opening are invalid.',
      correctiveAction: 'NA',
    },
    {
      code: '337',
      description: 'Alternate fire recall floor and opening are invalid.',
      correctiveAction: 'NA',
    },
    {
      code: '338',
      description: 'Communication with machine room CPLD lost.',
      correctiveAction: 'NA',
    },
    {
      code: '339',
      description: 'Communication with car top CPLD lost.',
      correctiveAction: 'NA',
    },
    {
      code: '340',
      description: 'Communication with car operating panel CPLD lost.',
      correctiveAction: 'NA',
    },
    {
      code: '341',
      description: 'Car network datagram expired.',
      correctiveAction: 'NA',
    },
    {
      code: '342',
      description: 'Communcation with drive was lost.',
      correctiveAction: 'Check the wiring of the communication lines between the machine room and drive.',
    },
    {
      code: '343',
      description: 'A drive fault exists. Drive is not ready.',
      correctiveAction: 'Refer to the DSD drive manual.',
    },
    {
      code: '344',
      description: 'Drive issuing a tach overspeed fault (see DSD manual F97).',
      correctiveAction: 'Refer to the DSD drive manual.',
    },
    {
      code: '345',
      description: 'Drive issuing a tach loss fault (see DSD manual F98).',
      correctiveAction: 'Refer to the DSD drive manual.',
    },
    {
      code: '346',
      description: 'Drive issuing a reverse tach fault (see DSD manual F99).',
      correctiveAction: 'Refer to the DSD drive manual.',
    },
    {
      code: '347',
      description: 'Drive issuing a motor over-load fault (see DSD manual F400).',
      correctiveAction: 'Refer to the DSD drive manual.',
    },
    {
      code: '348',
      description: 'Drive issuing an excessive field current fault (see DSD manual F401).',
      correctiveAction: 'Refer to the DSD drive manual.',
    },
    {
      code: '349',
      description: 'Drive issuing a contactor failure fault (see DSD manual F402).',
      correctiveAction: 'Refer to the DSD drive manual.',
    },
    {
      code: '350',
      description: 'Drive issuing a CEMF limit fault (see DSD manual F407/F408).',
      correctiveAction: 'Refer to the DSD drive manual.',
    },
    {
      code: '351',
      description: 'Drive issuing an E-Stop circuit fault (see DSD manual).',
      correctiveAction: 'Refer to the DSD drive manual.',
    },
    {
      code: '352',
      description: 'Drive issuing a loop fault (see DSD manual F900).',
      correctiveAction: 'Refer to the DSD drive manual.',
    },
    {
      code: '353',
      description: 'Drive issuing a PCU IST fault (see DSD manual F901).',
      correctiveAction: 'Refer to the DSD drive manual.',
    },
    {
      code: '354',
      description: 'Drive issuing a line sync fault (see DSD manual F903).',
      correctiveAction: 'Refer to the DSD drive manual.',
    },
    {
      code: '355',
      description: 'Drive issuing a low line fault (see DSD manual F904).',
      correctiveAction: 'Refer to the DSD drive manual.',
    },
    {
      code: '356',
      description: 'Drive issuing a field loss fault (see DSD manual F905).',
      correctiveAction: 'Refer to the DSD drive manual.',
    },
    {
      code: '357',
      description: 'Drive issuing a line droop fault (see DSD manual F406).',
      correctiveAction: 'Refer to the DSD drive manual.',
    },
    {
      code: '358',
      description: 'Drive reporting a communcation loss fault (see DSD manual).',
      correctiveAction: 'Check the wiring of the communication lines between the machine room and drive.',
    },
    {
      code: '359',
      description: 'Drive reporting an overvolt fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '360',
      description: 'Drive reporting an undervolt fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '361',
      description: 'Drive reporting an overcurrent fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '362',
      description: 'Drive reporting a fuse fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '363',
      description: 'Drive reporting reverse tach fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '364',
      description: 'Drive reporting a phase loss fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '365',
      description: 'Drive reporting a current regulator fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '366',
      description: 'Drive reporting an overspeed fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '367',
      description: 'Drive reporting a charge fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '368',
      description: 'Drive reporting a drive overload fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '369',
      description: 'Drive reporting an overtemperature fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '370',
      description: 'Drive reporting an encoder fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '371',
      description: 'Drive reporting a ground fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '372',
      description: 'Drive reporting a contactor fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '373',
      description: 'Drive reporting a brake pick fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '374',
      description: 'Drive reporting a brake hold fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '375',
      description: 'Drive reporting an external fault 1.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '376',
      description: 'Drive reporting an external fault 2.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '377',
      description: 'Drive reporting an external fault 3.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '378',
      description: 'Drive reporting a brake fualt.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '379',
      description: 'Drive reporting a cube ID fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '380',
      description: 'Drive reporting a motor ID fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '381',
      description: 'Drive reporting an undefined MAG 23 fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '382',
      description: 'Drive reporting a setup fault 1.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '383',
      description: 'Drive reporting a setup fault 2.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '384',
      description: 'Drive reporting a setup fault 3.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '385',
      description: 'Drive reporting a setup fault 4.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '386',
      description: 'Drive reporting a setup fault 5.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '387',
      description: 'Drive reporting a DCU data fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '388',
      description: 'Drive reporting a PCU data fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '389',
      description: 'Drive reporting a cube data fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '390',
      description: 'Drive reporting a motor data fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '391',
      description: 'Drive reporting a serial comm timeout.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '392',
      description: 'Drive reporting a setup fault 6.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '393',
      description: 'Drive reporting a setup fault 7.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '394',
      description: 'Drive reporting a torque limit fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '395',
      description: 'Drive reporting a setup fault 8.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '396',
      description: 'Drive reporting a V/HZ fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '397',
      description: 'Drive reporting an undefined MAG 39 fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '398',
      description: 'Drive reporting an external fault 4.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '399',
      description: 'Drive reporting an undefined MAG 41 fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '400',
      description: 'Drive reporting an undefined MAG 42 fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '401',
      description: 'Drive reporting rotor not aligned.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '402',
      description: 'Drive reporting encoder CRC error.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '403',
      description: 'Drive reporting an undefined MAG 45 fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '404',
      description: 'Drive reporting a motor phase fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '405',
      description: 'Drive reporting a Z marker lost fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '406',
      description: 'Drive reporting a stall fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '407',
      description: 'Drive reporting an undefined MAG 49 fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '408',
      description: 'Drive reporting an undefined MAG 50 fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '409',
      description: 'Drive reporting ENDAT mismatch.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '410',
      description: 'Drive reporting DB voltage fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '411',
      description: 'Drive reporting a multi-step speed delay fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '412',
      description: 'Drive reporting a short circuit fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '413',
      description: 'Drive reporting a SER2 speed fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '414',
      description: 'Drive reporting a motor overload fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '415',
      description: 'Drive reporting a speed deviation fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '416',
      description: 'Drive reporting a setup fault 9.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '417',
      description: 'Drive reporting a setup fault 10.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '418',
      description: 'Drive reporting a brake open fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '419',
      description: 'Drive reporting an auto tune contactor fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '420',
      description: 'Drive reporting an undefined MAG 62 fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '421',
      description: 'Drive reporting a safe-off open fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '422',
      description: 'Drive reporting a setup fault 11.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '423',
      description: 'Drive reporting a quick start fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '424',
      description: 'Drive reporting a tach loss fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '425',
      description: 'Drive reporting a setup fault 12.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '426',
      description: 'Drive reporting a safe-off setup fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '427',
      description: 'Drive reporting an NTSD speed setup fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '428',
      description: 'Drive reporting an NTSD logical input setup fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '429',
      description: 'Drive reporting an undefined MAG 71 fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '430',
      description: 'Drive reporting an encoder PPR fault.',
      correctiveAction: 'Refer to the HPV drive manual.',
    },
    {
      code: '431',
      description: 'Drive reporting EOP - Error Over Voltage.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '432',
      description: 'Drive reporting EUP - Error Under Voltage.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '433',
      description: 'Drive reporting EUPh - Error Input Phase Failure.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '434',
      description: 'Drive reporting EOC - Error Over Current.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '435',
      description: 'Drive reporting EIPh - Error Output Phase Failure.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '436',
      description: 'Drive reporting EOHI - Error Overheat Internal.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '437',
      description: 'Drive reporting EnOHI - No Error Overheat Internal.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '438',
      description: 'Drive reporting EOH - Error Overheat Power Module.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '439',
      description: 'Drive reporting EdOH - Error Motor Overheat.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '440',
      description: 'Drive reporting an undefined KEB10 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '441',
      description: 'Drive reporting EndOH - No Error Motor Overheat.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '442',
      description: 'Drive reporting EPU - Error Power Unit.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '443',
      description: 'Drive reporting no_PU - Power Unit Not Ready.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '444',
      description: 'Drive reporting an undefined KEB14 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '445',
      description: 'Drive reporting ELSF - Error Charge Relay Fault.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '446',
      description: 'Drive reporting EOL - Error Overload.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '447',
      description: 'Drive reporting EnOL - No Error Overload.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '448',
      description: 'Drive reporting EbuS - HSP5 Serial Comm.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '449',
      description: 'Drive reporting EOL2 - Error Overload Low Speed.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '450',
      description: 'Drive reporting EnOL2 - No Error Overload Low Speed.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '451',
      description: 'Drive reporting an undefined KEB21 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '452',
      description: 'Drive reporting an undefined KEB22 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '453',
      description: 'Drive reporting ESbuS - Error Bus Synchronization.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '454',
      description: 'Drive reporting EACC - Error Maximum Acceleration.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '455',
      description: 'Drive reporting ESCL - Error Speed Control Limit.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '456',
      description: 'Drive reporting an undefined KEB26 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '457',
      description: 'Drive reporting an undefined KEB27 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '458',
      description: 'Drive reporting an undefined KEB28 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '459',
      description: 'Drive reporting an undefined KEB29 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '460',
      description: 'Drive reporting EOH2 - Error Motor Protection.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '461',
      description: 'Drive reporting EEF - Error External Fault.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '462',
      description: 'Drive reporting EEnC1 - Error Encoder 1.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '463',
      description: 'Drive reporting an undefined KEB33 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '464',
      description: 'Drive reporting EEnC2 - Error Encoder 2.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '465',
      description: 'Drive reporting EEnCC - Error Encoder Interface.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '466',
      description: 'Drive reporting EnOH - No Error Overheat Power Module.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '467',
      description: 'Drive reporting an undefined KEB37 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '468',
      description: 'Drive reporting an undefined KEB38 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '469',
      description: 'Drive reporting ESEt - Error Set.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '470',
      description: 'Drive reporting an undefined KEB40 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '471',
      description: 'Drive reporting an undefined KEB41 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '472',
      description: 'Drive reporting an undefined KEB42 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '473',
      description: 'Drive reporting an undefined KEB43 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '474',
      description: 'Drive reporting ESLF - Error Software Limit Forward.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '475',
      description: 'Drive reporting ESLr - Error Software Limit Reverse.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '476',
      description: 'Drive reporting EPrF - Error Protection Rotation Forward.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '477',
      description: 'Drive reporting EPrr - Error Protection Rotation Reverse.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '478',
      description: 'Drive reporting an undefined KEB48 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '479',
      description: 'Drive reporting EPuci - Error Power Unit Code Invalid.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '480',
      description: 'Drive reporting EPuch - Power Unit Changed.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '481',
      description: 'Drive reporting Edri - Error Driver Relay.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '482',
      description: 'Drive reporting EHyb - Error Encoder Card.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '483',
      description: 'Drive reporting EiEd - Input Error Detection.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '484',
      description: 'Drive reporting Eco1 - Error Counter Overrun 1.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '485',
      description: 'Drive reporting Eco2 - Error Counter Overrun 2.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '486',
      description: 'Drive reporting Ebr - Error Low Motor Current.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '487',
      description: 'Drive reporting Eini - Error Initialization MFC.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '488',
      description: 'Drive reporting EOS - Error Overspeed.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '489',
      description: 'Drive reporting EHybC - Error Encoder Card Changed.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '490',
      description: 'Drive reporting ECdd - Error Calculating Motor Data.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '491',
      description: 'Drive reporting an undefined KEB61 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '492',
      description: 'Drive reporting an undefined KEB62 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '493',
      description: 'Drive reporting an undefined KEB63 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '494',
      description: 'Drive reporting Up Acceleration.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '495',
      description: 'Drive reporting Up Deceleration.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '496',
      description: 'Drive reporting Up Constant Speed.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '497',
      description: 'Drive reporting Down Acceleration.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '498',
      description: 'Drive reporting Down Deceleration.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '499',
      description: 'Drive reporting Down Constant Speed.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '500',
      description: 'Drive reporting No Direction Selected.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '501',
      description: 'Drive reporting Stall.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '502',
      description: 'Drive reporting LA Stop.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '503',
      description: 'Drive reporting Ld Stop.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '504',
      description: 'Drive reporting Speed Search.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '505',
      description: 'Drive reporting DC Brake.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '506',
      description: 'Drive reporting Base Block.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '507',
      description: 'Drive reporting Low Speed / DC Brake.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '508',
      description: 'Drive reporting Power Off.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '509',
      description: 'Drive reporting Quick Stop.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '510',
      description: 'Drive reporting Hardware Current Limit.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '511',
      description: 'Drive reporting Search for Reference Active.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '512',
      description: 'Drive reporting Calculate Motor Data.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '513',
      description: 'Drive reporting Positioning.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '514',
      description: 'Drive reporting Low Speed / Power Off.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '515',
      description: 'Drive reporting Closing Brake.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '516',
      description: 'Drive reporting Opening Brake.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '517',
      description: 'Drive reporting Abnormal Stop Overheat Interior.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '518',
      description: 'Drive reporting No Alarm Overheat Power Module.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '519',
      description: 'Drive reporting Abnormal Stop Overheat Power Module.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '520',
      description: 'Drive reporting Abnormal Stop External Fault.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '521',
      description: 'Drive reporting No Alarm Drive Overheat.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '522',
      description: 'Drive reporting No Alarm Stop Overheat Interior.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '523',
      description: 'Drive reporting Abnormal Stop Bus.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '524',
      description: 'Drive reporting Abnormal Stop Protection Rotation Forward.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '525',
      description: 'Drive reporting Abnormal Stop Protection Rotation Reverse.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '526',
      description: 'Drive reporting Abnormal Stop Drive Overheat.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '527',
      description: 'Drive reporting Abnormal Stop Motor Protection.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '528',
      description: 'Drive reporting No Abnormal Stop Overload.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '529',
      description: 'Drive reporting Abnormal Stop Overload.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '530',
      description: 'Drive reporting Abnormal Stop Overload 2.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '531',
      description: 'Drive reporting No Abnormal Stop Overload 2.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '532',
      description: 'Drive reporting Abnormal Stop Set.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '533',
      description: 'Drive reporting Abnormal Stop Bus Synchronization.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '534',
      description: 'Drive reporting Abnormal Stop Software Limit Forward.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '535',
      description: 'Drive reporting Abnormal Stop Software Limit Reverse.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '536',
      description: 'Drive reporting Abnormal Stop Maximum Acceleration.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '537',
      description: 'Drive reporting Abnormal Stop Speed Control Limit.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '538',
      description: 'Drive reporting an undefined KEB108 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '539',
      description: 'Drive reporting an undefined KEB109 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '540',
      description: 'Drive reporting an undefined KEB110 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '541',
      description: 'Drive reporting an undefined KEB111 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '542',
      description: 'Drive reporting an undefined KEB112 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '543',
      description: 'Drive reporting an undefined KEB113 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '544',
      description: 'Drive reporting an undefined KEB114 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '545',
      description: 'Drive reporting an undefined KEB115 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '546',
      description: 'Drive reporting an undefined KEB116 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '547',
      description: 'Drive reporting an undefined KEB117 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '548',
      description: 'Drive reporting an undefined KEB118 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '549',
      description: 'Drive reporting an undefined KEB119 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '550',
      description: 'Drive reporting an undefined KEB120 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '551',
      description: 'Drive reporting Ready for Positioning.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '552',
      description: 'Drive reporting Positioning Active.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '553',
      description: 'Drive reporting Position Not Accessible.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '554',
      description: 'Drive reporting Protection Rotation Forward.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '555',
      description: 'Drive reporting Protection Rotation Reverse.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '556',
      description: 'Drive reporting Position Not Accessible Ignored.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '557',
      description: 'Drive reporting Calculate Motor Data Complete.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '558',
      description: 'Drive reporting Reference Found.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '559',
      description: 'Drive reporting an undefined KEB129 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '560',
      description: 'Drive reporting an undefined KEB130 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '561',
      description: 'Drive reporting an undefined KEB131 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '562',
      description: 'Drive reporting an undefined KEB132 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '563',
      description: 'Drive reporting an undefined KEB133 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '564',
      description: 'Drive reporting an undefined KEB134 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '565',
      description: 'Drive reporting an undefined KEB135 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '566',
      description: 'Drive reporting an undefined KEB136 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '567',
      description: 'Drive reporting an undefined KEB137 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '568',
      description: 'Drive reporting an undefined KEB138 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '569',
      description: 'Drive reporting an undefined KEB139 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '570',
      description: 'Drive reporting an undefined KEB140 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '571',
      description: 'Drive reporting an undefined KEB141 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '572',
      description: 'Drive reporting an undefined KEB142 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '573',
      description: 'Drive reporting an undefined KEB143 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '574',
      description: 'Drive reporting an undefined KEB144 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '575',
      description: 'Drive reporting an undefined KEB145 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '576',
      description: 'Drive reporting an undefined KEB146 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '577',
      description: 'Drive reporting an undefined KEB147 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '578',
      description: 'Drive reporting an undefined KEB148 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '579',
      description: 'Drive reporting an undefined KEB149 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '580',
      description: 'Drive reporting Main Contact Failure.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '581',
      description: 'Drive reporting Brake Switch Failure.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '582',
      description: 'Drive reporting Speed Following Error.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '583',
      description: 'Drive reporting Speed Selection Error.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '584',
      description: 'Drive reporting ETS Input Failure.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '585',
      description: 'Drive reporting ETS Overspeed.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '586',
      description: 'Drive reporting NTS Input Failure.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '587',
      description: 'Drive reporting Analog Signal Failure.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '588',
      description: 'Drive reporting Unintended Movement.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '589',
      description: 'Drive reporting Secure Fault Reset.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '590',
      description: 'Drive reporting ESD Input Failure.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '591',
      description: 'Drive reporting Direction Selection Failure.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '592',
      description: 'Drive reporting Drive Enabled Switched Off.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '593',
      description: 'Drive reporting Error Field Bus Watchdog.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '594',
      description: 'Drive reporting Error Commutation Position.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '595',
      description: 'Drive reporting Error Excessive Acceleration.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '596',
      description: 'Drive reporting Error Serial Command Speed.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '597',
      description: 'Drive reporting an undefined KEB167 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '598',
      description: 'Drive reporting an undefined KEB168 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '599',
      description: 'Drive reporting an undefined KEB169 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '600',
      description: 'Drive reporting UPS Mode.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '601',
      description: 'Drive reporting Reduced Torque.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '602',
      description: 'Drive reporting Emergency Profile.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '603',
      description: 'Drive reporting Emergency Generator Speed.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '604',
      description: 'Drive reporting Earthquake Speed.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '605',
      description: 'Drive reporting Emergency Slowdown.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '606',
      description: 'Drive reporting an undefined KEB176 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '607',
      description: 'Drive reporting an undefined KEB177 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '608',
      description: 'Drive reporting an undefined KEB178 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '609',
      description: 'Drive reporting an undefined KEB179 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '610',
      description: 'Drive reporting an undefined KEB180 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '611',
      description: 'Drive reporting an undefined KEB181 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '612',
      description: 'Drive reporting an undefined KEB182 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '613',
      description: 'Drive reporting an undefined KEB183 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '614',
      description: 'Drive reporting an undefined KEB184 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '615',
      description: 'Drive reporting an undefined KEB185 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '616',
      description: 'Drive reporting an undefined KEB186 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '617',
      description: 'Drive reporting an undefined KEB187 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '618',
      description: 'Drive reporting an undefined KEB188 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '619',
      description: 'Drive reporting an undefined KEB189 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '620',
      description: 'Drive reporting an undefined KEB190 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '621',
      description: 'Drive reporting an undefined KEB191 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '622',
      description: 'Drive reporting an undefined KEB192 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '623',
      description: 'Drive reporting an undefined KEB193 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '624',
      description: 'Drive reporting an undefined KEB194 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '625',
      description: 'Drive reporting an undefined KEB195 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '626',
      description: 'Drive reporting an undefined KEB196 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '627',
      description: 'Drive reporting an undefined KEB197 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '628',
      description: 'Drive reporting an undefined KEB198 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '629',
      description: 'Drive reporting an undefined KEB199 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '630',
      description: 'Drive reporting No Communication to Encoder Card.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '631',
      description: 'Drive reporting Encoder Communication OK.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '632',
      description: 'Drive reporting Encoder Not Defined.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '633',
      description: 'Drive reporting an undefined KEB203 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '634',
      description: 'Drive reporting an undefined KEB204 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '635',
      description: 'Drive reporting an undefined KEB205 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '636',
      description: 'Drive reporting No Communication to Encoder.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '637',
      description: 'Drive reporting Incremental Count Deviation.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '638',
      description: 'Drive reporting Encoder PPR does not match LE01.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '639',
      description: 'Drive reporting Interface ID is wrong.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '640',
      description: 'Drive reporting an undefined KEB210 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '641',
      description: 'Drive reporting an undefined KEB211 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '642',
      description: 'Drive reporting an undefined KEB212 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '643',
      description: 'Drive reporting Encoder Overtemperature.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '644',
      description: 'Drive reporting Encoder Overspeed.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '645',
      description: 'Drive reporting Encoder Supply Voltage Too Low.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '646',
      description: 'Drive reporting Internal Encoder Error.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '647',
      description: 'Drive reporting Formatting Encoder.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '648',
      description: 'Drive reporting an undefined KEB218 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '649',
      description: 'Drive reporting an undefined KEB219 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '650',
      description: 'Drive reporting an undefined KEB220 status.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '651',
      description: 'Drive reporting New Encoder Identifi ed.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '652',
      description: 'Drive reporting Undefined Encoder Error.',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '653',
      description: 'Drive reporting Encoder Interface Busy',
      correctiveAction: 'Refer to the KEB drive manual.',
    },
    {
      code: '654',
      description: 'Group landing offset setting it outside valid range.',
      correctiveAction: 'The sum of the landing offset and the car\'s number of floors should be less than the max supported landings (typically 64). Currently this offset is also bounded to less than 32.',
    },
    {
      code: '655',
      description: 'Enter payment passcode under SETUP | MISC | PAYMENT PASSCODE.',
      correctiveAction: 'Submit payment and receive payment passcode from Smartrise Engineering.',
    },
    {
      code: '656',
      description: 'Battery lowering device is reporting a fault state. (Hydro Only): If Battery Test Time is set under SETUP | Hydro | Battery Test Time.The BLD reported 3 or more battery faults within 3 days.',
      correctiveAction: 'Check backup battery(Hydro Only): If fault occurred from BLD reporting 3 or more faults within 3 days check backup battery and toggle DIP A1.',
    },
    {
      code: '657',
      description: 'Normal profile ETSL points are not of increasing in position/speed value or a trip speed exceeds contract speed.',
      correctiveAction: 'Cycle power to the system or edit an S-Curve parameter to trigger a ETSL point recalculation.',
    },
    {
      code: '658',
      description: 'Inspection profile ETSL points are not of increasing in position/speed value or a trip speed exceeds contract speed.',
      correctiveAction: 'Cycle power to the system or edit an S-Curve parameter to trigger a ETSL point recalculation.',
    },
    {
      code: '659',
      description: 'Emergency profile ETSL points are not of increasing in position/speed value or a trip speed exceeds contract speed.',
      correctiveAction: 'Cycle power to the system or edit an S-Curve parameter to trigger a ETSL point recalculation.',
    },
    {
      code: '660',
      description: 'Short profile ETSL points are not of increasing in position/speed value or a trip speed exceeds contract speed.',
      correctiveAction: 'Cycle power to the system or edit an S-Curve parameter to trigger a ETSL point recalculation.',
    },
    {
      code: '661',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '662',
      description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '663',
      description: 'Communication with ETSL CEDES channel 2 was lost.',
      correctiveAction: 'Check camera wiring.',
    },
    {
      code: '664',
      description: 'ETSL CEDES channel 2 reporting a failure to read error.',
      correctiveAction: 'Clean the tape. Align the tape with the camera.',
    },
    {
      code: '665',
      description: 'ETSL CEDES channel 2 reporting the tape is aligned too close relative to the camera.',
      correctiveAction: 'Clean the tape. Align the tape with the camera.',
    },
    {
      code: '666',
      description: 'ETSL CEDES channel 2 reporting the tape is aligned too far relative to the camera.',
      correctiveAction: 'Clean the tape. Align the tape with the camera.',
    },
    {
      code: '667',
      description: 'ETSL CEDES channel 2 reporting the tape is aligned too left relative to the camera.',
      correctiveAction: 'Clean the tape. Align the tape with the camera.',
    },
    {
      code: '668',
      description: 'ETSL CEDES channel 2 reporting the tape is aligned too right relative to the camera.',
      correctiveAction: 'Clean the tape. Align the tape with the camera.',
    },
    {
      code: '669',
      description: 'ETSL CEDES channel 2 reporting an internal error.',
      correctiveAction: 'NA',
    },
    {
      code: '670',
      description: 'ETSL CEDES channel 2 reporting a communication error.',
      correctiveAction: 'NA',
    },
    {
      code: '671',
      description: 'ETSL CEDES channel 2 reporting a position cross check error.',
      correctiveAction: 'NA',
    },
    {
      code: '672',
      description: 'ETSL CEDES channel 2 reporting a velocity cross check error.',
      correctiveAction: 'NA',
    },
    {
      code: '673',
      description: 'ETSL CEDES channel 2 reporting a cross check error.',
      correctiveAction: 'NA',
    },
    {
      code: '674',
      description: 'ETSL CEDES channel 2 reporting a position cross check error.',
      correctiveAction: 'NA',
    },
    {
      code: '675',
      description: 'ETSL CEDES channel 2 reporting a velocity cross check error.',
      correctiveAction: 'NA',
    },
    {
      code: '676',
      description: 'ETSL CEDES channel 2 reporting a cross check error.',
      correctiveAction: 'NA',
    },
    {
      code: '677',
      description: 'S-curve normal profile decel exceeds limit for reduced speed buffer.',
      correctiveAction: 'Lower the s-curve decel parameters until the fault clears.',
    },
    {
      code: '678',
      description: 'S-curve inspection profile decel exceeds limit for reduced speed buffer.',
      correctiveAction: 'Lower the s-curve decel parameters until the fault clears.',
    },
    {
      code: '679',
      description: 'S-curve e-power profile decel exceeds limit for reduced speed buffer.',
      correctiveAction: 'Lower the s-curve decel parameters until the fault clears.',
    },
    {
      code: '680',
      description: 'S-curve short profile decel exceeds limit for reduced speed buffer.',
      correctiveAction: 'Lower the s-curve decel parameters until the fault clears.',
    },
    {
      code: '681',
      description: 'Car speed exceeded the top terminal speed limit.',
      correctiveAction: 'Lower your deceleration curve parameters or increase the ETS debounce limit.',
    },
    {
      code: '682',
      description: 'Car speed exceeded the top terminal speed limit.',
      correctiveAction: 'Lower your deceleration curve parameters or increase the ETS debounce limit.',
    },
    {
      code: '683',
      description: 'Car speed exceeded the top terminal speed limit.',
      correctiveAction: 'Lower your deceleration curve parameters or increase the ETS debounce limit.',
    },
    {
      code: '684',
      description: 'Car speed exceeded the top terminal speed limit.',
      correctiveAction: 'Lower your deceleration curve parameters or increase the ETS debounce limit.',
    },
    {
      code: '685',
      description: 'Car speed exceeded the top terminal speed limit.',
      correctiveAction: 'Lower your deceleration curve parameters or increase the ETS debounce limit.',
    },
    {
      code: '686',
      description: 'Car speed exceeded the top terminal speed limit.',
      correctiveAction: 'Lower your deceleration curve parameters or increase the ETS debounce limit.',
    },
    {
      code: '687',
      description: 'Car speed exceeded the top terminal speed limit.',
      correctiveAction: 'Lower your deceleration curve parameters or increase the ETS debounce limit.',
    },
    {
      code: '688',
      description: 'Car speed exceeded the top terminal speed limit.',
      correctiveAction: 'Lower your deceleration curve parameters or increase the ETS debounce limit.',
    },
    {
      code: '689',
      description: 'Car speed exceeded the bottom terminal speed limit.',
      correctiveAction: 'Lower your deceleration curve parameters or increase the ETS debounce limit.',
    },
    {
      code: '690',
      description: 'Car speed exceeded the bottom terminal speed limit.',
      correctiveAction: 'Lower your deceleration curve parameters or increase the ETS debounce limit.',
    },
    {
      code: '691',
      description: 'Car speed exceeded the bottom terminal speed limit.',
      correctiveAction: 'Lower your deceleration curve parameters or increase the ETS debounce limit.',
    },
    {
      code: '692',
      description: 'Car speed exceeded the bottom terminal speed limit.',
      correctiveAction: 'Lower your deceleration curve parameters or increase the ETS debounce limit.',
    },
    {
      code: '693',
      description: 'Car speed exceeded the bottom terminal speed limit.',
      correctiveAction: 'Lower your deceleration curve parameters or increase the ETS debounce limit.',
    },
    {
      code: '694',
      description: 'Car speed exceeded the bottom terminal speed limit.',
      correctiveAction: 'Lower your deceleration curve parameters or increase the ETS debounce limit.',
    },
    {
      code: '695',
      description: 'Car speed exceeded the bottom terminal speed limit.',
      correctiveAction: 'Lower your deceleration curve parameters or increase the ETS debounce limit.',
    },
    {
      code: '696',
      description: 'Car speed exceeded the bottom terminal speed limit.',
      correctiveAction: 'Lower your deceleration curve parameters or increase the ETS debounce limit.',
    },
    {
      code: '697',
      description: 'Car speed exceeded the top terminal speed limit.',
      correctiveAction: 'Lower your deceleration curve parameters or increase the ETSL debounce limit.',
    },
    {
      code: '698',
      description: 'Car speed exceeded the top terminal speed limit.',
      correctiveAction: 'Lower your deceleration curve parameters or increase the ETSL debounce limit.',
    },
    {
      code: '699',
      description: 'Car speed exceeded the top terminal speed limit.',
      correctiveAction: 'Lower your deceleration curve parameters or increase the ETSL debounce limit.',
    },
    {
      code: '700',
      description: 'Car speed exceeded the top terminal speed limit.',
      correctiveAction: 'Lower your deceleration curve parameters or increase the ETSL debounce limit.',
    },
    {
      code: '701',
      description: 'Car speed exceeded the top terminal speed limit.',
      correctiveAction: 'Lower your deceleration curve parameters or increase the ETSL debounce limit.',
    },
    {
      code: '702',
      description: 'Car speed exceeded the top terminal speed limit.',
      correctiveAction: 'Lower your deceleration curve parameters or increase the ETSL debounce limit.',
    },
    {
      code: '703',
      description: 'Car speed exceeded the top terminal speed limit.',
      correctiveAction: 'Lower your deceleration curve parameters or increase the ETSL debounce limit.',
    },
    {
      code: '704',
      description: 'Car speed exceeded the top terminal speed limit.',
      correctiveAction: 'Lower your deceleration curve parameters or increase the ETSL debounce limit.',
    },
    {
      code: '705',
      description: 'Car speed exceeded the bottom terminal speed limit.',
      correctiveAction: 'Lower your deceleration curve parameters or increase the ETSL debounce limit.',
    },
    {
      code: '706',
      description: 'Car speed exceeded the bottom terminal speed limit.',
      correctiveAction: 'Lower your deceleration curve parameters or increase the ETSL debounce limit.',
    },
    {
      code: '707',
      description: 'Car speed exceeded the bottom terminal speed limit.',
      correctiveAction: 'Lower your deceleration curve parameters or increase the ETSL debounce limit.',
    },
    {
      code: '708',
      description: 'Car speed exceeded the bottom terminal speed limit.',
      correctiveAction: 'Lower your deceleration curve parameters or increase the ETSL debounce limit.',
    },
    {
      code: '709',
      description: 'Car speed exceeded the bottom terminal speed limit.',
      correctiveAction: 'Lower your deceleration curve parameters or increase the ETSL debounce limit.',
    },
    {
      code: '710',
      description: 'Car speed exceeded the bottom terminal speed limit.',
      correctiveAction: 'Lower your deceleration curve parameters or increase the ETSL debounce limit.',
    },
    {
      code: '711',
      description: 'Car speed exceeded the bottom terminal speed limit.',
      correctiveAction: 'Lower your deceleration curve parameters or increase the ETSL debounce limit.',
    },
    {
      code: '712',
      description: 'Car speed exceeded the bottom terminal speed limit.',
      correctiveAction: 'Lower your deceleration curve parameters or increase the ETSL debounce limit.',
    },
    {
      code: '713',
      description: 'Discrete fault input has been high for 200ms.',
      correctiveAction: 'Check IO configuration & wiring.',
    },
    {
      code: '714',
      description: 'Drive reporting a fault that is out of the C4 system\'s defined range.',
      correctiveAction: 'Check the drive fault log. Note, for KEB this signals that the drive ready output is either low or the output is misconfigured on the drive.',
    },
    {
      code: '715',
      description: 'FRAM data redundancy check has failed and data was not recovered.',
      correctiveAction: 'Contact support.',
    },
    {
      code: '716',
      description: 'Car exceeding max number of runs per minute. ',
      correctiveAction: 'Check that car is not repeatedly releveling for a floor.',
    },
    {
      code: '717',
      description: 'A system configuration parameter was changed. The system must be power cycled.',
      correctiveAction: 'Cycle power to the system.',
    },
    {
      code: '718',
      description: 'A system configuration parameter was changed. The system must be power cycled.',
      correctiveAction: 'Cycle power to the system.',
    },
    {
      code: '719',
      description: 'Front top closed interlock is open',
      correctiveAction: 'Check wiring of TCL, GSW and DZ signals. This fault is flagged when outside of DZ and and TCL is open. It is also flagged when GSW is closed and TCL is open.',
    },
    {
      code: '720',
      description: 'Front middle closed interlock is open',
      correctiveAction: 'Check wiring of MCL, GSW and DZ signals. This fault is flagged when outside of DZ and and MCL is open. It is also flagged when GSW is closed and MCL is open.',
    },
    {
      code: '721',
      description: 'Front bottom closed interlock is open',
      correctiveAction: 'Check wiring of BCL, GSW and DZ signals. This fault is flagged when outside of DZ and and BCL is open. It is also flagged when GSW is closed and BCL is open.',
    },
    {
      code: '722',
      description: 'Rear top closed interlock is open',
      correctiveAction: 'Check wiring of TCL, GSW and DZ signals. This fault is flagged when outside of DZ and and TCL is open. It is also flagged when GSW is closed and TCL is open.',
    },
    {
      code: '723',
      description: 'Rear middle closed interlock is open',
      correctiveAction: 'Check wiring of MCL, GSW and DZ signals. This fault is flagged when outside of DZ and and MCL is open. It is also flagged when GSW is closed and MCL is open.',
    },
    {
      code: '724',
      description: 'Rear bottom closed interlick is open',
      correctiveAction: 'Check wiring of BCL, GSW and DZ signals. This fault is flagged when outside of DZ and and BCL is open. It is also flagged when GSW is closed and BCL is open.',
    },
    {
      code: '725',
      description: 'Emergency power speed setting is outside the valid range.',
      correctiveAction: 'Set epower speed to a value from 10 to the configured contract speed.',
    },
    {
      code: '726',
      description: 'Access speed setting is outside the valid range.',
      correctiveAction: 'Set access speed to a value from 0 to 150.',
    },
    {
      code: '727',
      description: 'A GSW and Lock is open and the car is more than two and a half inches from the nearest learned floor position. The movement direction agrees with the commanded.',
      correctiveAction: 'Check wiring and safety contacts.',
    },
    {
      code: '728',
      description: 'Front DPM Open',
      correctiveAction: 'Check wiring and safety contacts.',
    },
    {
      code: '729',
      description: 'Rear DPM Open',
      correctiveAction: 'Check wiring and safety contacts.',
    },
    {
      code: '730',
      description: 'CPLD reporting a startup state.',
      correctiveAction: 'NA',
    },
    {
      code: '731',
      description: 'CPLD reporting a startup state.',
      correctiveAction: 'NA',
    },
    {
      code: '732',
      description: 'CPLD reporting a startup state.',
      correctiveAction: 'NA',
    },
    {
      code: '733',
      description: 'CPLD reporting unintended movement.',
      correctiveAction: 'Press the EBRK RST button to clear.',
    },
    {
      code: '734',
      description: 'MR CPLD reporting loss of communication with CT CPLD.',
      correctiveAction: 'Check for miswiring on the CN2 network. Check CT/COP toggle switch.',
    },
    {
      code: '735',
      description: 'CT CPLD reporting loss of communication with COP CPLD.',
      correctiveAction: 'Check for miswiring on the CN2 network. Check CT/COP toggle switch.',
    },
    {
      code: '736',
      description: 'CPLD reporting loss of 120 AC supply.',
      correctiveAction: 'NA',
    },
    {
      code: '737',
      description: 'CPLD reporting loss of machine room governor input.',
      correctiveAction: 'Press the EBRK RST button to clear.',
    },
    {
      code: '738',
      description: 'CPLD reporting invalid activation of machine room car door bypass switch.',
      correctiveAction: 'NA',
    },
    {
      code: '739',
      description: 'CPLD reporting invalid activation of machine room hall door bypass switch.',
      correctiveAction: 'NA',
    },
    {
      code: '740',
      description: 'CPLD reporting loss of machine room SFM input.',
      correctiveAction: 'NA',
    },
    {
      code: '741',
      description: 'CPLD reporting loss of machine room SFH input.',
      correctiveAction: 'NA',
    },
    {
      code: '742',
      description: 'CPLD reporting loss of machine room PIT input.',
      correctiveAction: 'NA',
    },
    {
      code: '743',
      description: 'CPLD reporting loss of machine room BUF input.',
      correctiveAction: 'NA',
    },
    {
      code: '744',
      description: 'CPLD reporting loss of machine room TFL input.',
      correctiveAction: 'NA',
    },
    {
      code: '745',
      description: 'CPLD reporting loss of machine room BFL input.',
      correctiveAction: 'NA',
    },
    {
      code: '746',
      description: 'CPLD reporting loss of car top switch (CT-SF1) input.',
      correctiveAction: 'NA',
    },
    {
      code: '747',
      description: 'CPLD reporting loss of escape hatch (CT-SF2) input.',
      correctiveAction: 'NA',
    },
    {
      code: '748',
      description: 'CPLD reporting loss of car safeties (CT-SF3) input.',
      correctiveAction: 'NA',
    },
    {
      code: '749',
      description: 'CPLD reporting loss of in car stop switch (COP-SF2) input.',
      correctiveAction: 'NA',
    },
    {
      code: '750',
      description: 'CPLD reporting loss of fire stop switch (COP-SF3) input.',
      correctiveAction: 'NA',
    },
    {
      code: '751',
      description: 'CPLD reporting invalid inspection mode.',
      correctiveAction: 'NA',
    },
    {
      code: '752',
      description: 'CPLD reporting invalid hoistway access move request.',
      correctiveAction: 'NA',
    },
    {
      code: '753',
      description: 'CPLD reporting multiple locks are open or a lock is open outside of door zone.',
      correctiveAction: 'NA',
    },
    {
      code: '754',
      description: 'CPLD reporting multiple locks are open or a lock is open outside of door zone.',
      correctiveAction: 'NA',
    },
    {
      code: '755',
      description: 'CPLD reporting multiple locks are open or a lock is open outside of door zone.',
      correctiveAction: 'NA',
    },
    {
      code: '756',
      description: 'CPLD reporting multiple locks are open or a lock is open outside of door zone.',
      correctiveAction: 'NA',
    },
    {
      code: '757',
      description: 'CPLD reporting multiple locks are open or a lock is open outside of door zone.',
      correctiveAction: 'NA',
    },
    {
      code: '758',
      description: 'CPLD reporting multiple locks are open or a lock is open outside of door zone.',
      correctiveAction: 'NA',
    },
    {
      code: '759',
      description: 'CPLD reporting gateswitch is open outside of door zone.',
      correctiveAction: 'NA',
    },
    {
      code: '760',
      description: 'CPLD reporting gateswitch is open outside of door zone.',
      correctiveAction: 'NA',
    },
    {
      code: '761',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '762',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '763',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '764',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '765',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '766',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '767',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '768',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '769',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '770',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '771',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '772',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '773',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '774',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '775',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '776',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '777',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '778',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '779',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '780',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '781',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '782',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '783',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '784',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '785',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '786',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '787',
      description: 'CPLD reporting out of range error.',
      correctiveAction: 'NA',
    },
    {
      code: '788',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '789',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '790',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '791',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '792',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '793',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '794',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '795',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '796',
      description: 'CPLD reporting out of range error.',
      correctiveAction: 'NA',
    },
    {
      code: '797',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '798',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '799',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '800',
      description: 'CPLD reporting preflight check failed.',
      correctiveAction: 'NA',
    },
    {
      code: '801',
      description: 'CPLD reporting out of range error.',
      correctiveAction: 'NA',
    },
    {
      code: '802',
      description: 'Brake board has over heated.',
      correctiveAction: 'NA',
    },
    {
      code: '803',
      description: 'Secondary brake board has over heated.',
      correctiveAction: 'NA',
    },
    {
      code: '804',
      description: 'Motion start sequence aborted due to missing B contactor feedback.',
      correctiveAction: 'NA',
    },
    {
      code: '805',
      description: 'Car speed exceeded 150 fpm with front door position monitor open.',
      correctiveAction: 'Confirm system and drive contract speed match. Check door contacts and wiring.',
    },
    {
      code: '806',
      description: 'Car speed exceeded 150 fpm with rear door position monitor open.',
      correctiveAction: 'Confirm system and drive contract speed match. Check door contacts and wiring.',
    },
    {
      code: '807',
      description: 'Seismic input is high',
      correctiveAction: 'Check the Seismic input',
    },
    {
      code: '808',
      description: 'Freight door photoeye test has failed.',
      correctiveAction: 'Check light curtain hardware.',
    },
    {
      code: '809',
      description: 'Motion start sequence aborted due to incorrect GSWF state.',
      correctiveAction: 'Check the GSWF contact.',
    },
    {
      code: '810',
      description: 'Motion start sequence aborted due to incorrect LFT state.',
      correctiveAction: 'Check the LFT contact.',
    },
    {
      code: '811',
      description: 'Motion start sequence aborted due to incorrect LFM state. ',
      correctiveAction: 'Check the LFM contact.',
    },
    {
      code: '812',
      description: 'Motion start sequence aborted due to incorrect DPM F state. ',
      correctiveAction: 'Check the DPM F contact',
    },
    {
      code: '813',
      description: 'Motion start sequence aborted due to incorrect LFB state. ',
      correctiveAction: 'Check the LFB contact.',
    },
    {
      code: '814',
      description: 'Motion start sequence aborted due to incorrect GSWR state. ',
      correctiveAction: 'Check the GSWR contact.',
    },
    {
      code: '815',
      description: 'Motion start sequence aborted due to incorrect LRT state. ',
      correctiveAction: 'Check the LRT contact.',
    },
    {
      code: '816',
      description: 'Motion start sequence aborted due to incorrect LRM state. ',
      correctiveAction: 'Check the LRM contact.',
    },
    {
      code: '817',
      description: 'Motion start sequence aborted due to incorrect LRB state. ',
      correctiveAction: 'Check the LRB contact.',
    },
    {
      code: '818',
      description: 'Motion start sequence aborted due to incorrect DPM R state.',
      correctiveAction: 'Check the DPM R contact. ',
    },
    {
      code: '819',
      description: 'Motion start sequence aborted due to missing GSWF.',
      correctiveAction: 'Check the GSWF contact.',
    },
    {
      code: '820',
      description: 'Motion start sequence aborted due to missing LFT .',
      correctiveAction: 'Check the LFT contact.',
    },
    {
      code: '821',
      description: 'Motion start sequence aborted due to missing LFM. ',
      correctiveAction: 'Check the LFM contact.',
    },
    {
      code: '822',
      description: 'Motion start sequence aborted due to missing LFB. ',
      correctiveAction: 'Check the LFB contact.',
    },
    {
      code: '823',
      description: 'Motion start sequence aborted due to missing DPM F. ',
      correctiveAction: 'Check the DPM F contact. ',
    },
    {
      code: '824',
      description: 'Motion start sequence aborted due to missing GSWR. ',
      correctiveAction: 'Check the GSWR contact.',
    },
    {
      code: '825',
      description: 'Motion start sequence aborted due to missing LRT.',
      correctiveAction: 'Check the LRT contact.',
    },
    {
      code: '826',
      description: 'Motion start sequence aborted due to missing LRM. ',
      correctiveAction: 'Check the LRM contact.',
    },
    {
      code: '827',
      description: 'Motion start sequence aborted due to missing LRB. ',
      correctiveAction: 'Check the LRB contact.',
    },
    {
      code: '828',
      description: 'Motion start sequence aborted due to missing DPM R. ',
      correctiveAction: 'Check the DPM R contact. ',
    },
    {
      code: '829',
      description: 'Motion start sequence aborted due to incorrect DCL F state.',
      correctiveAction: 'Check the DCL F contact. ',
    },
    {
      code: '830',
      description: 'Motion start sequence aborted due to incorrect DCL R state.',
      correctiveAction: 'Check the DCL R contact. ',
    },
    {
      code: '831',
      description: 'Motion start sequence aborted due to incorrect DOL F state.',
      correctiveAction: 'Check the DOL F contact. ',
    },
    {
      code: '832',
      description: 'Motion start sequence aborted due to incorrect DOL R state.',
      correctiveAction: 'Check the DOL R contact. ',
    },
    {
      code: '833',
      description: 'Motion start sequence aborted due to missing DCL F.',
      correctiveAction: 'Check the DCL F contact. ',
    },
    {
      code: '834',
      description: 'Motion start sequence aborted due to missing DCL R.',
      correctiveAction: 'Check the DCL R contact. ',
    },
    {
      code: '835',
      description: 'Motion start sequence aborted due to incorrect DOL F state. ',
      correctiveAction: 'Check the DOL F contact. ',
    },
    {
      code: '836',
      description: 'Motion start sequence aborted due to incorrect DOL R state. ',
      correctiveAction: 'Check the DOL R contact. ',
    },
    {
      code: '837',
      description: 'Primary primary valve board reporting an unknown fault.',
      correctiveAction: 'Check primary valve board and wiring.',
    },
    {
      code: '838',
      description: 'Primary primary valve board recovering from a reset due to power off.',
      correctiveAction: 'Check primary valve board and wiring.',
    },
    {
      code: '839',
      description: 'Primary primary valve board recovering from reset due to watchdog.',
      correctiveAction: 'Check primary valve board and wiring.',
    },
    {
      code: '840',
      description: 'Primary primary valve board recovering from reset due to voltage dip.',
      correctiveAction: 'Check primary valve board and wiring.',
    },
    {
      code: '841',
      description: 'Primary primary valve board reporting loss of comunication with elevator controller.',
      correctiveAction: 'Check primary valve board and wiring.',
    },
    {
      code: '842',
      description: 'Primary primary valve board reporting mismatch between valve control and status signals of level speed down output.',
      correctiveAction: 'Check primary valve board and wiring.',
    },
    {
      code: '843',
      description: 'Primary primary valve board reporting mismatch between valve control and status signals of level speed up output.',
      correctiveAction: 'Check primary valve board and wiring.',
    },
    {
      code: '844',
      description: 'Primary primary valve board reporting mismatch between valve control and status signals of high speed down output.',
      correctiveAction: 'Check primary valve board and wiring.',
    },
    {
      code: '845',
      description: 'Primary primary valve board reporting mismatch between valve control and status signals of high speed up output.',
      correctiveAction: 'Check primary valve board and wiring.',
    },
    {
      code: '846',
      description: 'Primary primary valve board reporting mismatch between control and status signals of the start motor output.',
      correctiveAction: 'Check primary valve board and wiring.',
    },
    {
      code: '847',
      description: 'Primary primary valve board reporting both up and down commands issued at the same time.',
      correctiveAction: 'Check primary valve board and wiring.',
    },
    {
      code: '848',
      description: 'Primary primary valve board reporting a CAN bus reset.',
      correctiveAction: 'Check primary valve board and wiring.',
    },
    {
      code: '849',
      description: 'Primary soft starter reporting an unknown fault.',
      correctiveAction: '(Hydro Only) Check primary soft starter board and wiring.',
    },
    {
      code: '850',
      description: 'Primary soft starter recovering from a reset due to power off.',
      correctiveAction: '(Hydro Only) Check primary soft starter board and wiring.',
    },
    {
      code: '851',
      description: 'Primary soft starter recovering from reset due to watchdog.',
      correctiveAction: '(Hydro Only) Check primary soft starter board and wiring.',
    },
    {
      code: '852',
      description: 'Primary soft starter recovering from reset due to voltage dip.',
      correctiveAction: '(Hydro Only) Check primary soft starter board and wiring.',
    },
    {
      code: '853',
      description: 'Primary soft starter reporting loss of communication with the elevator controller.',
      correctiveAction: '(Hydro Only) Check primary soft starter board and wiring.',
    },
    {
      code: '854',
      description: 'Primary soft starter reporting an overcurrent error.',
      correctiveAction: '(Hydro Only) Check primary soft starter board and wiring.',
    },
    {
      code: '855',
      description: 'Primary soft starter reporting an overvoltage error.',
      correctiveAction: '(Hydro Only) Check primary soft starter board and wiring.',
    },
    {
      code: '856',
      description: 'Primary soft starter reporting an undervoltage error.',
      correctiveAction: '(Hydro Only) Check primary soft starter board and wiring.',
    },
    {
      code: '857',
      description: 'Primary soft starter reporting a missing phase.',
      correctiveAction: '(Hydro Only) Check primary soft starter board and wiring.',
    },
    {
      code: '858',
      description: 'Primary soft starter reporting phase sequence error.',
      correctiveAction: '(Hydro Only) Check primary soft starter board and wiring.',
    },
    {
      code: '859',
      description: 'Primary soft starter reporting a CAN bus reset.',
      correctiveAction: '(Hydro Only) Check primary soft starter board and wiring.',
    },
    {
      code: '860',
      description: 'Communiation lost with primary valve board.',
      correctiveAction: 'Check primary valve board and wiring.',
    },
    {
      code: '861',
      description: 'Communication lost with primary soft starter.',
      correctiveAction: 'Check primary soft starter board and wiring.',
    },
    {
      code: '862',
      description: 'The Motor Overheat input has been triggered. The motor is overheated.',
      correctiveAction: 'Check the Motor Overheat input. Check the state of the motor. ',
    },
    {
      code: '863',
      description: 'Secondary valve board reporting an unknown fault.',
      correctiveAction: 'Check secondary valve board and wiring.',
    },
    {
      code: '864',
      description: 'Secondary valve board recovering from a reset due to power off.',
      correctiveAction: 'Check secondary valve board and wiring.',
    },
    {
      code: '865',
      description: 'Secondary valve board recovering from reset due to watchdog.',
      correctiveAction: 'Check secondary valve board and wiring.',
    },
    {
      code: '866',
      description: 'Secondary valve board recovering from reset due to voltage dip.',
      correctiveAction: 'Check secondary valve board and wiring.',
    },
    {
      code: '867',
      description: 'Secondary valve board reporting loss of comunication with elevator controller.',
      correctiveAction: 'Check secondary valve board and wiring.',
    },
    {
      code: '868',
      description: 'Secondary valve board reporting mismatch between valve control and status signals of level speed down output.',
      correctiveAction: 'Check secondary valve board and wiring.',
    },
    {
      code: '869',
      description: 'Secondary valve board reporting mismatch between valve control and status signals of level speed up output.',
      correctiveAction: 'Check secondary valve board and wiring.',
    },
    {
      code: '870',
      description: 'Secondary valve board reporting mismatch between valve control and status signals of high speed down output.',
      correctiveAction: 'Check secondary valve board and wiring.',
    },
    {
      code: '871',
      description: 'Secondary valve board reporting mismatch between valve control and status signals of high speed up output.',
      correctiveAction: 'Check secondary valve board and wiring.',
    },
    {
      code: '872',
      description: 'Secondary valve board reporting mismatch between control and status signals of the start motor output.',
      correctiveAction: 'Check secondary valve board and wiring.',
    },
    {
      code: '873',
      description: 'Secondary valve board reporting both up and down commands issued at the same time.',
      correctiveAction: 'Check secondary valve board and wiring.',
    },
    {
      code: '874',
      description: 'Secondary valve board reporting a CAN bus reset.',
      correctiveAction: 'Check secondary valve board and wiring.',
    },
    {
      code: '875',
      description: 'Communiation lost with secondary valve board.',
      correctiveAction: 'Check secondary valve board and wiring.',
    },
    {
      code: '876',
      description: 'Two primary valve boards detected on the network.',
      correctiveAction: 'Check valve board addressing.',
    },
    {
      code: '877',
      description: 'Two secondary valve boards detected on the network.',
      correctiveAction: 'Check valve board addressing.',
    },
    {
      code: '878',
      description: 'Car speed exceeded the top terminal speed limit.',
      correctiveAction: '(Hydro Only) Increase the TSRD position offset, increase the TSRD debounce limit, or adjust the learned slowdown points.',
    },
    {
      code: '879',
      description: 'Motion start sequence aborted due to missing DSD output Run Engaged.',
      correctiveAction: 'Check the wiring of the DSD run engaged output to the C4 controller. Confirm that the output is programmed on the DSD drive and the corresponding input is programmed on the C4 controller.',
    },
    {
      code: '880',
      description: 'Low Oil input is active suggesting oil levels are low. ',
      correctiveAction: '(Hydro Only) Check oil levels, Low Oil Input, then reset the latching fault via the reset button. ',
    },
    {
      code: '881',
      description: 'Learned slowdown distances are invalid.',
      correctiveAction: '(Hydro Only) Check learned slowdown distances. To learn slowdown distances, turn ON machine room DIP A5, and turn ON Learn_Slowdowns (01-253) parameter. Then position the car at the bottom landing and follow on screen instructions to learn slowdowns in the up direction. Then position the car at the top landing and follow on screen instructions to learn slowdowns in the down direction.',
    },
    {
      code: '882',
      description: 'Low Pressure input is active suggesting there is low pressure.',
      correctiveAction: '(Hydro Only) Check Pump Low Pressure Sensor, Check Low Pressure input.',
    },
    {
      code: '883',
      description: 'Car pump motor stayed consistently ON during one run and exceeded the run time limit.',
      correctiveAction: '(Hydro Only) Check pump Oil levels',
    },
    {
      code: '884',
      description: 'Communication lost with secondary soft starter.',
      correctiveAction: '(Hydro Only) Check secondary soft starter board and wiring.',
    },
    {
      code: '885',
      description: 'Secondary soft starter reporting an unknown fault.',
      correctiveAction: '(Hydro Only) Check secondary soft starter board and wiring.',
    },
    {
      code: '886',
      description: 'Secondary soft starter recovering from a reset due to power off.',
      correctiveAction: '(Hydro Only) Check secondary soft starter board and wiring.',
    },
    {
      code: '887',
      description: 'Secondary soft starter recovering from reset due to watchdog.',
      correctiveAction: '(Hydro Only) Check secondary soft starter board and wiring.',
    },
    {
      code: '888',
      description: 'Secondary soft starter recovering from reset due to voltage dip.',
      correctiveAction: '(Hydro Only) Check secondary soft starter board and wiring.',
    },
    {
      code: '889',
      description: 'Secondary soft starter reporting loss of communication with the elevator controller.',
      correctiveAction: '(Hydro Only) Check secondary soft starter board and wiring.',
    },
    {
      code: '890',
      description: 'Secondary soft starter reporting an overcurrent error.',
      correctiveAction: '(Hydro Only) Check secondary soft starter board and wiring.',
    },
    {
      code: '891',
      description: 'Secondary soft starter reporting an overvoltage error.',
      correctiveAction: '(Hydro Only) Check secondary soft starter board and wiring.',
    },
    {
      code: '892',
      description: 'Secondary soft starter reporting an undervoltage error.',
      correctiveAction: '(Hydro Only) Check secondary soft starter board and wiring.',
    },
    {
      code: '893',
      description: 'Secondary soft starter reporting a missing phase.',
      correctiveAction: '(Hydro Only) Check secondary soft starter board and wiring.',
    },
    {
      code: '894',
      description: 'Secondary soft starter reporting phase sequence error.',
      correctiveAction: '(Hydro Only) Check secondary soft starter board and wiring.',
    },
    {
      code: '895',
      description: 'Secondary soft starter reporting a CAN bus reset.',
      correctiveAction: '(Hydro Only) Check secondary soft starter board and wiring.',
    },
    {
      code: '896',
      description: 'Viscosity Operation reached its maximum number of cycles',
      correctiveAction: '(Hydro Only) Check Viscosity sensor and input, then reset the latching fault via Dip A1.',
    },
    {
      code: '897',
      description: 'Discrete input fault 1 from the Soft Starter has been activated',
      correctiveAction: '(Hydro Only) Check the SS Input fault and the contact feeding the input from the drive.',
    },
    {
      code: '898',
      description: 'Discrete input fault 2 from the Soft Starter has been actived.',
      correctiveAction: '(Hydro Only) Check the SS 2 Input fault, and the contact feeding the input from the drive.',
    },
    {
      code: '899',
      description: 'Line monitoring hardware has detected voltage lines are out of phase or missing. Only checked if programmed.',
      correctiveAction: '(Hydro Only) Check line monitoring hardware and wiring.',
    },
    {
      code: '900',
      description: 'Parameters are syncronizing.',
      correctiveAction: 'NA',
    },
    {
      code: '901',
      description: 'Parameters are syncronizing.',
      correctiveAction: 'NA',
    },
    {
      code: '902',
      description: 'Primary soft starter reporting another board on the network has the same address.',
      correctiveAction: '(Hydro Only) Check primary soft starter address DIP switches.',
    },
    {
      code: '903',
      description: 'Secondary soft starter reporting another board on the network has the same address.',
      correctiveAction: '(Hydro Only) Check secondary soft starter address DIP switches.',
    },
    {
      code: '904',
      description: '(Hydro Only) Monitoring of safety relay for cutting the up high valve\'s neutral side showing an invalid state. Valid only for bucher and blain valve type configurations.',
      correctiveAction: 'Check the wiring of the UPH VALVE MON input.',
    },
    {
      code: '905',
      description: '(Hydro Only) Monitoring of safety relay for cutting the down high valve\'s neutral side showing an invalid state. Valid only for bucher and blain valve type configurations.',
      correctiveAction: 'Check the wiring of the DNH VALVE MON input.',
    },
    {
      code: '906',
      description: '(Hydro Only) Monitoring of safety relay for cutting the inspection valve\'s neutral side showing an invalid state. Valid only for bucher and blain valve type configurations.',
      correctiveAction: 'Check the wiring of the INSP VALVE MON input.',
    },
    {
      code: '907',
      description: 'Restore the drive parameters after Acceptance test completion or if the acceptance test is interrupted( If the FRAM values for drive parameter is nonzero )',
      correctiveAction: 'Turn On A1 dip switch and hit reset, this will make the FRAM values for the drive parameters 0',
    },
    {
      code: '908',
      description: 'Car has flagged the same fault 3 times in a row and has been taken out of service.',
      correctiveAction: 'This fault does not auto clear. Controller must be power cycled to clear this state.',
    },
    {
      code: '909',
      description: 'The car has flagged more than X faults within an hour and the car has been taken out of service. This hour is not aligned with the real time clock. This OOS state will auto reset after the hour passes. X is HourlyFaultLimit (08-160).',
      correctiveAction: 'Investigate the faults logged within an hour of this fault. Reset the controller or move to inspection to clear the fault immediately, otherwise this fault auto clears after an hour.',
    },
    {
      code: '910',
      description: 'The car has flagged more than X door faults within an hour and the car has been taken out of service. This hour is not aligned with the real time clock. This OOS state will auto reset after the hour passes. X is DoorHourlyFaultLimit (08-148).',
      correctiveAction: 'Investigate the door faults logged within an hour of this fault. Reset the controller or move to inspection to clear the fault immediately, otherwise this fault auto clears after an hour.',
    },
    {
      code: '911',
      description: 'The car has attempted to run more than X times within a minute. This minute is not aligned with the real time clock. This OOS state will auto reset after the minute passes. X is MaxStartsPerMinute (08-196).',
      correctiveAction: 'Check if the car is repeatedly correcting or releveling trying to make floor level. Check if the car is repeatedly trying and failing to start a run. Reset the controller or move to inspection to clear the fault immediately. Otherwise the fault auto clears after 1 minute.',
    },
    {
      code: '912',
      description: 'The car has been taken out of service by the OOS keyswitch input.',
      correctiveAction: 'Check the status of the OOS keyswitch input.',
    },
    {
      code: '913',
      description: 'The car has been taken out of service by the DL20 fixture.',
      correctiveAction: 'Check the fault status of the DL20 fixture.',
    },
    {
      code: '914',
      description: 'The Delta relay\'s feedback signal shows the relay is active, when the Delta output driving the relay is inactive. Valid for hydro controllers with wye delta style starters.',
      correctiveAction: '(Hydro Only) Check the status of the delta relay.',
    },
    {
      code: '915',
      description: 'The Delta relay\'s feedback signal shows the relay is inactive, when the Delta output driving the relay is active. Valid for hydro controllers with wye delta style starters.',
      correctiveAction: '(Hydro Only) Check the status of the delta relay.',
    },
    {
      code: '916',
      description: 'Starter overload relay used for contactor based starters is active.',
      correctiveAction: '(Hydro Only) Check the status of the starter overload relay.',
    },
    {
      code: '917',
      description: 'EB1 relay which is controlled by the redundant safety processor (and should normally follow the EB2 relay) is currently dropped when it should be picked.',
      correctiveAction: '(Hydro Only) Check the status of the EB1 and EB2 relays.',
    },
    {
      code: '918',
      description: 'If Low Oil, MLT, or Motor Overheat is active in the background, the controller is prevent from running up in all modes of operation. ',
      correctiveAction: '(Hydro Only) Verify that Low Oil, MLT, or Motor Overheat is not active. Clear them via Dip A1 reset. ',
    },
    {
      code: '919',
      description: 'The car has moved since its original destination assessment. The new destination request is no longer achievable.',
      correctiveAction: 'Depending on the amount of movement that occurs when the run drops, and the car\'s configured SETUP | SCURVE | DEST. OFFSET UP, DEST. OFFSET DOWN, RELEVEL OFFSET UP, RELEVEL OFFSET DOWN, the car may not be able to make the requested run. Reducing the amount of car movement at the end of run will reduce the likelyhood of this occuring.',
    },
    {
      code: '920',
      description: 'Drive is reporting a Endat fault. ',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '921',
      description: 'Drive is reporting a OLA ENDT FLT',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '922',
      description: 'Drive is reporting a OLA ENC FLT',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '923',
      description: 'Drive is reporting a SETUP FAULT 9',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '924',
      description: 'Drive is reporting an undefined fault 49',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '925',
      description: 'Drive is reporting an undefined fault 50',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '926',
      description: 'Drive is reporint a HW/SW MISMATCH',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '927',
      description: 'Drive is reporting an undefined fault 52',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '928',
      description: 'Drive is reporting a MSPD TMR FLT',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '929',
      description: 'Drive is reporting an undefined fault 54',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '930',
      description: 'Drive is reporting a SER2 SPD FLT',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '931',
      description: 'Drive is reporting a MTR OVERLD FLT',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '932',
      description: 'Drive is reporting a FIELD LOSS',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '933',
      description: 'Drive is reporting a MODULE A IGBT ',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '934',
      description: 'Drive is reporting a MODULE B IGBT',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '935',
      description: 'Drive is reporting a OPEN ARMATURE ',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '936',
      description: 'Drive is reporting a MODULE C IGBT',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '937',
      description: 'Drive is reporting a LS TEMP FLT',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '938',
      description: 'Drive is reporting a SFT CN OPENED',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '939',
      description: 'Drive is reporting a SFT CN NOT CL',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '940',
      description: 'Drive is reporting an undefined fault 65',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '941',
      description: 'Drive is reporting an undefined fault 66',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '942',
      description: 'Drive is reporintg an undefined fault 67',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '943',
      description: 'Drive is reporting a CHECK SETUP ',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '944',
      description: 'Drive is reporting a REVERSE TACH',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '945',
      description: 'Drive is reporting a IP COMM',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '946',
      description: 'Drive is reporting a MS-LS MISMTCH',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '947',
      description: 'Drive is reporting a MONITOR REV',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '948',
      description: 'Drive is reporting UTIL DATA SUM ',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '949',
      description: 'Drive is reporting an undefined fault 74',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '950',
      description: 'Drive is reporting an undefined fault 75',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '951',
      description: 'Drive is reporting an undefined fault 76',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '952',
      description: 'Drive is reporting an undefined fault 77',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '953',
      description: 'Drive is reporting an undefined fault 78',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '954',
      description: 'Drive is reporting a MS SIZE',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '955',
      description: 'Drive is reporting an undefined fault 80',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '956',
      description: 'Drive is reporting a POWER ON',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '957',
      description: 'Drive is reporting a FLD PWM SET HI',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '958',
      description: 'Drive is reporting an undefined fault 83',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '959',
      description: 'Drive is reporting an undefined fault 84',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '960',
      description: 'Drive is reporting a GATE PWR ENA',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '961',
      description: 'Drive is reporting a GATE ALARM',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '962',
      description: 'Drive is reporting an undefined fault 87',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '963',
      description: 'Drive is reporting an undefined fault 88',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '964',
      description: 'Drive is reporting an undefined fault 89',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '965',
      description: 'Drive is reporting a NTSD LOGIC IN',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '966',
      description: 'Drive is reporting a NTSD SPEED',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '967',
      description: 'Drive is reporting a TORQ LIM 2HI FLT',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '968',
      description: 'Drive is reporting a CONNECTOR OFF',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '969',
      description: 'Drive is reporting an undefined fault 94',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '970',
      description: 'Drive is reporting an undefined fault 95',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '971',
      description: 'Drive is reporting a SPD DEV',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '972',
      description: 'Drive is reporting a NO OPTION CRD',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '973',
      description: 'Drive is reporting a BRAKE IS OPEN',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '974',
      description: 'Drive is reporting a AT CNTACTR FLT',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '975',
      description: 'Drive is reporting a LS PHASE',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '976',
      description: 'Drive is reporting a LS CURR REG',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '977',
      description: 'Drive is reporting a LS OVERVOLT',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '978',
      description: 'Drive is reporting a LS UNDRVOLT',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '979',
      description: 'Drive is reporting a LS CHARGE',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '980',
      description: 'Drive is reporting a LS OVERLOAD',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '981',
      description: 'Drive is reporting a LS CUBE ID',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '982',
      description: 'Drive is reporting a LS DCU DATA',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '983',
      description: 'Drive is reporting a LS CUBE DATA',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '984',
      description: 'Drive is reporting a LS PCU DATA',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '985',
      description: 'Drive is reporting an undefined fault 110',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '986',
      description: 'Drive is reporting a LS OVERTEMP',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '987',
      description: 'Drive is reporting a LS BRDG GND',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '988',
      description: 'Drive is reporting a LS OVERCURR',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '989',
      description: 'Drive is reporting a LS CONN OFF',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '990',
      description: 'Drive is reporting a LS IP COMM',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '991',
      description: 'Drive is reporting a LS HW/SW',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '992',

      description: 'Drive is reporting a LS IGBT 1',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '993',

      description: 'Drive is reporting a LS IGBT 2',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '994',

      description: 'Drive is reporting a LS IGBT 3',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '995',

      description: 'Drive is reporting a LS AC CNTCR',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '996',

      description: 'Drive is reporting a LS CHK SETUP',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '997',

      description: 'Drive is reporting a LINE HI VOLTS',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '998',
      description: 'Drive is reporting a LS SIZE',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '999',
      description: 'Drive is reporting a LS SW BUS OV',
      correctiveAction: 'Refer to the Quattro drive manual. ',
    },
    {
      code: '1000',
      description: 'The controller CW Derail was triggered. ',
      correctiveAction: 'Verify is the CW derail was activated. ',
    },
  ];
  possiblePartTypes = [];
  vendors = [];
  alarms = [
    {
      code: '0', description: 'No Alarm',
      correctiveAction: 'NA',
    },
    {
      code: '1', description: 'NTS point 1 has been tripped in the up direction for the normal motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '2', description: 'NTS point 2 has been tripped in the up direction for the normal motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '3', description: 'NTS point 3 has been tripped in the up direction for the normal motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '4', description: 'NTS point 4 has been tripped in the up direction for the normal motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '5', description: 'NTS point 5 has been tripped in the up direction for the normal motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '6', description: 'NTS point 6 has been tripped in the up direction for the normal motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '7', description: 'NTS point 7 has been tripped in the up direction for the normal motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '8', description: 'NTS point 8 has been tripped in the up direction for the normal motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '9', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '10', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '11', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '12', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '13', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '14', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '15', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '16', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '17', description: 'NTS point 1 has been tripped in the up direction for the E-Power motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '18', description: 'NTS point 2 has been tripped in the up direction for the E-Power motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '19', description: 'NTS point 3 has been tripped in the up direction for the E-Power motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '20', description: 'NTS point 4 has been tripped in the up direction for the E-Power motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '21', description: 'NTS point 5 has been tripped in the up direction for the E-Power motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '22', description: 'NTS point 6 has been tripped in the up direction for the E-Power motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '23', description: 'NTS point 7 has been tripped in the up direction for the E-Power motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '24', description: 'NTS point 8 has been tripped in the up direction for the E-Power motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '25', description: 'NTS point 1 has been tripped in the up direction for the Short motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '26', description: 'NTS point 2 has been tripped in the up direction for the Short motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '27', description: 'NTS point 3 has been tripped in the up direction for the Short motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '28', description: 'NTS point 4 has been tripped in the up direction for the Short motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '29', description: 'NTS point 5 has been tripped in the up direction for the Short motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '30', description: 'NTS point 6 has been tripped in the up direction for the Short motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '31', description: 'NTS point 7 has been tripped in the up direction for the Short motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '32', description: 'NTS point 8 has been tripped in the up direction for the Short motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '33', description: 'NTS point 1 has been tripped in the down direction for the normal motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '34', description: 'NTS point 2 has been tripped in the down direction for the normal motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '35', description: 'NTS point 3 has been tripped in the down direction for the normal motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '36', description: 'NTS point 4 has been tripped in the down direction for the normal motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '37', description: 'NTS point 5 has been tripped in the down direction for the normal motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '38', description: 'NTS point 6 has been tripped in the down direction for the normal motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '39', description: 'NTS point 7 has been tripped in the down direction for the normal motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '40', description: 'NTS point 8 has been tripped in the down direction for the normal motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '41', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '42', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '43', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '44', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '45', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '46', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '47', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '48', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '49', description: 'NTS point 1 has been tripped in the down direction for the E-Power motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '50', description: 'NTS point 2 has been tripped in the down direction for the E-Power motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '51', description: 'NTS point 3 has been tripped in the down direction for the E-Power motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '52', description: 'NTS point 4 has been tripped in the down direction for the E-Power motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '53', description: 'NTS point 5 has been tripped in the down direction for the E-Power motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '54', description: 'NTS point 6 has been tripped in the down direction for the E-Power motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '55', description: 'NTS point 7 has been tripped in the down direction for the E-Power motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '56', description: 'NTS point 8 has been tripped in the down direction for the E-Power motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '57', description: 'NTS point 1 has been tripped in the down direction for the Short motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '58', description: 'NTS point 2 has been tripped in the down direction for the Short motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '59', description: 'NTS point 3 has been tripped in the down direction for the Short motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '60', description: 'NTS point 4 has been tripped in the down direction for the Short motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '61', description: 'NTS point 5 has been tripped in the down direction for the Short motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '62', description: 'NTS point 6 has been tripped in the down direction for the Short motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '63', description: 'NTS point 7 has been tripped in the down direction for the Short motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '64', description: 'NTS point 8 has been tripped in the down direction for the Short motion profile. The lowest point is closest to the terminal.',
      correctiveAction: 'NA',
    },
    {
      code: '65', description: 'Normal profile NTS points are not of increasing in position/speed value or a trip speed exceeds contract speed.',
      correctiveAction: 'Cycle power to the system or edit an S-Curve parameter to trigger a NTS point recalculation.',
    },
    {
      code: '66', description: 'Inspection profile NTS points are not of increasing in position/speed value or a trip speed exceeds contract speed.',
      correctiveAction: 'Cycle power to the system or edit an S-Curve parameter to trigger a NTS point recalculation.',
    },
    {
      code: '67', description: 'Emergency profile NTS points are not of increasing in position/speed value or a trip speed exceeds contract speed.',
      correctiveAction: 'Cycle power to the system or edit an S-Curve parameter to trigger a NTS point recalculation.',
    },
    {
      code: '68', description: 'Short profile NTS points are not of increasing in position/speed value or a trip speed exceeds contract speed.',
      correctiveAction: 'Cycle power to the system or edit an S-Curve parameter to trigger a NTS point recalculation.',
    },
    {
      code: '69', description: 'When 01-150 is set to ON, this debugging alarm will signal when an ESTOP is commanded due to class of operation change.',
      correctiveAction: 'NA',
    },
    {
      code: '70', description: 'When 01-150 is set to ON, this debugging alarm will signal when an ESTOP is commanded due to run flag failing to drop.',
      correctiveAction: 'NA',
    },
    {
      code: '71', description: 'When 01-150 is set to ON, this debugging alarm will signal when an ESTOP is commanded due to failing to start a run.',
      correctiveAction: 'NA',
    },
    {
      code: '72', description: 'When 01-150 is set to ON, this debugging alarm will signal when an ESTOP is commanded due to invalid inspection mode.',
      correctiveAction: 'NA',
    },
    {
      code: '73', description: 'When 01-150 is set to ON, this debugging alarm will signal when an ESTOP is commanded due to invalid recall destination.',
      correctiveAction: 'NA',
    },
    {
      code: '74', description: 'When 01-130 is set to ON, this debugging alarm will signal when the car is commanded to stop at next available floor.',
      correctiveAction: 'NA',
    },
    {
      code: '75', description: 'When 01-150 is set to ON, this debugging alarm will signal when an ESTOP is during EQ operation.',
      correctiveAction: 'NA',
    },
    {
      code: '76', description: 'When 01-150 is set to ON, this debugging alarm will signal when an ESTOP is during flood operation.',
      correctiveAction: 'NA',
    },
    {
      code: '77', description: 'Car is stopped outside of a door zone.',
      correctiveAction: 'NA',
    },
    {
      code: '78', description: 'Car is performing releveling.',
      correctiveAction: 'NA',
    },
    {
      code: '79', description: 'Defaulting 1-bit parameters.',
      correctiveAction: 'NA',
    },
    {
      code: '80', description: 'Defaulting 8-bit parameters.',
      correctiveAction: 'NA',
    },
    {
      code: '81', description: 'Defaulting 16-bit parameters.',
      correctiveAction: 'NA',
    },
    {
      code: '82', description: 'Defaulting 24-bit parameters.',
      correctiveAction: 'NA',
    },
    {
      code: '83', description: 'Defaulting 32-bit parameters.',
      correctiveAction: 'NA',
    },
    {
      code: '84', description: 'Requested recall destination has an invalid door configuration.',
      correctiveAction: 'NA',
    },
    {
      code: '85', description: 'Requested recall destination is an invalid floor.',
      correctiveAction: 'NA',
    },
    {
      code: '86', description: 'Requested recall destination is not a valid opening.',
      correctiveAction: 'NA',
    },
    {
      code: '87', description: 'Processor has started up with watchdog disabled.',
      correctiveAction: 'Remove the WD jumper and restart the board to reenable.',
    },
    {
      code: '88', description: 'Processor has started up with watchdog disabled.',
      correctiveAction: 'Remove the WD jumper and restart the board to reenable.',
    },
    {
      code: '89', description: 'Processor has started up with watchdog disabled.',
      correctiveAction: 'Remove the WD jumper and restart the board to reenable.',
    },
    {
      code: '90', description: 'Processor has started up with watchdog disabled.',
      correctiveAction: 'Remove the WD jumper and restart the board to reenable.',
    },
    {
      code: '91', description: 'Processor has started up with watchdog disabled.',
      correctiveAction: 'Remove the WD jumper and restart the board to reenable.',
    },
    {
      code: '92', description: 'Processor has started up with watchdog disabled.',
      correctiveAction: 'Remove the WD jumper and restart the board to reenable.',
    },
    {
      code: '93', description: 'Machine room SRU CAN1 tranciever has self reset due to excessive bus errors.',
      correctiveAction: 'Verify bus wiring. If problem perists, remove boards from the network to isolate the board with the problem tranceiver.',
    },
    {
      code: '94', description: 'Machine room SRU CAN2 tranciever has self reset due to excessive bus errors.',
      correctiveAction: 'Verify bus wiring. If problem perists, remove boards from the network to isolate the board with the problem tranceiver.',
    },
    {
      code: '95', description: 'Machine room SRU CAN3 tranciever has self reset due to excessive bus errors.',
      correctiveAction: 'Verify bus wiring. If problem perists, remove boards from the network to isolate the board with the problem tranceiver.',
    },
    {
      code: '96', description: 'Machine room SRU CAN4 tranciever has self reset due to excessive bus errors.',
      correctiveAction: 'Verify bus wiring. If problem perists, remove boards from the network to isolate the board with the problem tranceiver.',
    },
    {
      code: '97', description: 'Car top SRU CAN1 tranciever has self reset due to excessive bus errors.',
      correctiveAction: 'Verify bus wiring. If problem perists, remove boards from the network to isolate the board with the problem tranceiver.',
    },
    {
      code: '98', description: 'Car top SRU CAN2 tranciever has self reset due to excessive bus errors.',
      correctiveAction: 'Verify bus wiring. If problem perists, remove boards from the network to isolate the board with the problem tranceiver.',
    },
    {
      code: '99', description: 'Car top SRU CAN3 tranciever has self reset due to excessive bus errors.',
      correctiveAction: 'Verify bus wiring. If problem perists, remove boards from the network to isolate the board with the problem tranceiver.',
    },
    {
      code: '100', description: 'Car top SRU CAN4 tranciever has self reset due to excessive bus errors.',
      correctiveAction: 'Verify bus wiring. If problem perists, remove boards from the network to isolate the board with the problem tranceiver.',
    },
    {
      code: '101', description: 'Car operating panel SRU CAN1 tranciever has self reset due to excessive bus errors.',
      correctiveAction: 'Verify bus wiring. If problem perists, remove boards from the network to isolate the board with the problem tranceiver.',
    },
    {
      code: '102', description: 'Car operating panel SRU CAN2 tranciever has self reset due to excessive bus errors.',
      correctiveAction: 'Verify bus wiring. If problem perists, remove boards from the network to isolate the board with the problem tranceiver.',
    },
    {
      code: '103', description: 'Car operating panel SRU CAN3 tranciever has self reset due to excessive bus errors.',
      correctiveAction: 'Verify bus wiring. If problem perists, remove boards from the network to isolate the board with the problem tranceiver.',
    },
    {
      code: '104', description: 'Car operating panel SRU CAN4 tranciever has self reset due to excessive bus errors.',
      correctiveAction: 'Verify bus wiring. If problem perists, remove boards from the network to isolate the board with the problem tranceiver.',
    },
    {
      code: '105', description: 'Car is triggering a drive fault reset.',
      correctiveAction: 'NA',
    },
    {
      code: '106', description: 'Drive reset limit has been reached.  The controller will no longer reset drive faults.',
      correctiveAction: 'NA',
    },
    {
      code: '107', description: 'The car is fully loaded and will no longer take hall calls.',
      correctiveAction: 'NA',
    },
    {
      code: '108', description: 'The car has received a remote request to change a 1-bit parameter.',
      correctiveAction: 'NA',
    },
    {
      code: '109', description: 'The car has received a remote request to change a 8-bit parameter.',
      correctiveAction: 'NA',
    },
    {
      code: '110', description: 'The car has received a remote request to change a 16-bit parameter.',
      correctiveAction: 'NA',
    },
    {
      code: '111', description: 'The car has received a remote request to change a 24-bit parameter.',
      correctiveAction: 'NA',
    },
    {
      code: '112', description: 'The car has received a remote request to change a 32-bit parameter.',
      correctiveAction: 'NA',
    },
    {
      code: '113', description: 'The car has received a remote request to change a magnetek drive parameter.',
      correctiveAction: 'NA',
    },
    {
      code: '114', description: 'The car has received a remote request to change a KEB drive parameter.',
      correctiveAction: 'NA',
    },
    {
      code: '115', description: 'Manual run request rejected due to invalid car door state.',
      correctiveAction: 'NA',
    },
    {
      code: '116', description: 'Manual run request rejected due to invalid hall lock state.',
      correctiveAction: 'NA',
    },
    {
      code: '117', description: 'Manual run request rejected due to disarmed direction inputs. This may occur if car enters inspection with its direction inputs active.',
      correctiveAction: 'NA',
    },
    {
      code: '118', description: 'This alarm is unused but is kept as a placeholder for older versions of software.',
      correctiveAction: 'NA',
    },
    {
      code: '119', description: 'This alarm is unused but is kept as a placeholder for older versions of software.',
      correctiveAction: 'NA',
    },
    {
      code: '120', description: 'Manual run request rejected due to front door open button request.',
      correctiveAction: 'NA',
    },
    {
      code: '121', description: 'Manual run request rejected due to rear door open button request.',
      correctiveAction: 'NA',
    },
    {
      code: '122', description: 'Manual run request rejected due to invalid hoistway access floor or opening configuration.',
      correctiveAction: 'NA',
    },
    {
      code: '123', description: 'Manual run request rejected due to missing CT enable signal.',
      correctiveAction: 'NA',
    },
    {
      code: '124', description: 'Car has been idle with a valid destination for the user configured timeout (08-202), and has been forced to change direction.',
      correctiveAction: 'NA',
    },
    {
      code: '125', description: 'Debugging communication timer with MR CPLD elapsed.',
      correctiveAction: 'NA',
    },
    {
      code: '126', description: 'Debugging communication timer with CT CPLD elapsed.',
      correctiveAction: 'NA',
    },
    {
      code: '127', description: 'Debugging communication timer with COP CPLD elapsed.',
      correctiveAction: 'NA',
    },
    {
      code: '128', description: 'The car is in motion but its destination has been canceled. There are no reachable alternative destinations. It will ramp down at the next available landing and reassess. This can occur in cases where a hall call is reassigned to a closer car. This will not occur if 01-00196 is ON.',
      correctiveAction: 'NA',
    },
    {
      code: '129', description: 'The flood switch has been activated.',
      correctiveAction: 'NA',
    },
    {
      code: '130', description: 'The car has received a remote request to change parameters in a bulk parameter restore format.',
      correctiveAction: 'NA',
    },
    {
      code: '131', description: 'A Duplicate Group Priority was Detected',
      correctiveAction: 'NA',
    },
    {
      code: '132', description: 'Connection was lost for Inter Group 1',
      correctiveAction: 'NA',
    },
    {
      code: '133', description: 'Connection was lost for Inter Group 2',
      correctiveAction: 'NA',
    },
    {
      code: '134', description: 'Connection was lost for Inter Group 3',
      correctiveAction: 'NA',
    },
    {
      code: '135', description: 'Connection was lost for Inter Group 4',
      correctiveAction: 'NA',
    },
    {
      code: '136', description: 'Connection was lost for Inter Group 5',
      correctiveAction: 'NA',
    },
    {
      code: '137', description: 'Connection was lost for Inter Group 6',
      correctiveAction: 'NA',
    },
    {
      code: '138', description: 'Connection was lost for Inter Group 7',
      correctiveAction: 'NA',
    },
    {
      code: '139', description: 'Connection was lost for Inter Group 8',
      correctiveAction: 'NA',
    },
    {
      code: '140', description: 'Intergroup status packet received by group with priority 0.',
      correctiveAction: 'NA',
    },
    {
      code: '141', description: 'Pressed Car Call Button is secured. ',
      correctiveAction: 'Check security options to verify if the CCB should or should not be secured. ',
    },
    {
      code: '142', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '143', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '144', description: 'C4 load weighing device is performing a load learn at each landing.',
      correctiveAction: 'NA',
    },
    {
      code: '145', description: 'C4 load weighing device is performing an empty car learn at each landing.',
      correctiveAction: 'NA',
    },
    {
      code: '146', description: 'When 01-129 is ON, this debug alarm will be set when the mode of operation changes.',
      correctiveAction: 'NA',
    },
    {
      code: '147', description: 'Riser1 marked as offline after 30 seconds without communication.',
      correctiveAction: 'NA',
    },
    {
      code: '148', description: 'Riser1 reporting an unknown error.',
      correctiveAction: 'NA',
    },
    {
      code: '149', description: 'Riser1 reporting a power-on reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '150', description: 'Riser1 reporting a watchdog reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '151', description: 'Riser1 reporting a brown-out reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '152', description: 'Riser1 reporting a group network communication loss error.',
      correctiveAction: 'NA',
    },
    {
      code: '153', description: 'Riser1 reporting a hall network communication loss error.',
      correctiveAction: 'NA',
    },
    {
      code: '154', description: 'Riser1 reporting an invalid error.',
      correctiveAction: 'NA',
    },
    {
      code: '155', description: 'Riser1 reporting an invalid error.',
      correctiveAction: 'NA',
    },
    {
      code: '156', description: 'Riser1 reporting an invalid error.',
      correctiveAction: 'NA',
    },
    {
      code: '157', description: 'Riser1 has detected another board with the same address.',
      correctiveAction: 'NA',
    },
    {
      code: '158', description: 'Riser1 reporting a CAN1 bus reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '159', description: 'Riser1 reporting a CAN2 bus reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '160', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '161', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '162', description: 'Riser2 marked as offline after 30 seconds without communication.',
      correctiveAction: 'NA',
    },
    {
      code: '163', description: 'Riser2 reporting an unknown error.',
      correctiveAction: 'NA',
    },
    {
      code: '164', description: 'Riser2 reporting a power-on reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '165', description: 'Riser2 reporting a watchdog reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '166', description: 'Riser2 reporting a brown-out reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '167', description: 'Riser2 reporting a group network communication loss error.',
      correctiveAction: 'NA',
    },
    {
      code: '168', description: 'Riser2 reporting a hall network communication loss error.',
      correctiveAction: 'NA',
    },
    {
      code: '169', description: 'Riser2 reporting an invalid error.',
      correctiveAction: 'NA',
    },
    {
      code: '170', description: 'Riser2 reporting an invalid error.',
      correctiveAction: 'NA',
    },
    {
      code: '171', description: 'Riser2 reporting an invalid error.',
      correctiveAction: 'NA',
    },
    {
      code: '172', description: 'Riser2 has detected another board with the same address.',
      correctiveAction: 'NA',
    },
    {
      code: '173', description: 'Riser2 reporting a CAN1 bus reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '174', description: 'Riser2 reporting a CAN2 bus reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '175', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '176', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '177', description: 'Riser3 marked as offline after 30 seconds without communication.',
      correctiveAction: 'NA',
    },
    {
      code: '178', description: 'Riser3 reporting an unknown error.',
      correctiveAction: 'NA',
    },
    {
      code: '179', description: 'Riser3 reporting a power-on reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '180', description: 'Riser3 reporting a watchdog reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '181', description: 'Riser3 reporting a brown-out reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '182', description: 'Riser3 reporting a group network communication loss error.',
      correctiveAction: 'NA',
    },
    {
      code: '183', description: 'Riser3 reporting a hall network communication loss error.',
      correctiveAction: 'NA',
    },
    {
      code: '184', description: 'Riser3 reporting an invalid error.',
      correctiveAction: 'NA',
    },
    {
      code: '185', description: 'Riser3 reporting an invalid error.',
      correctiveAction: 'NA',
    },
    {
      code: '186', description: 'Riser3 reporting an invalid error.',
      correctiveAction: 'NA',
    },
    {
      code: '187', description: 'Riser3 has detected another board with the same address.',
      correctiveAction: 'NA',
    },
    {
      code: '188', description: 'Riser3 reporting a CAN1 bus reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '189', description: 'Riser3 reporting a CAN2 bus reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '190', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '191', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '192', description: 'Riser4 marked as offline after 30 seconds without communication.',
      correctiveAction: 'NA',
    },
    {
      code: '193', description: 'Riser4 reporting an unknown error.',
      correctiveAction: 'NA',
    },
    {
      code: '194', description: 'Riser4 reporting a power-on reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '195', description: 'Riser4 reporting a watchdog reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '196', description: 'Riser4 reporting a brown-out reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '197', description: 'Riser4 reporting a group network communication loss error.',
      correctiveAction: 'NA',
    },
    {
      code: '198', description: 'Riser4 reporting a hall network communication loss error.',
      correctiveAction: 'NA',
    },
    {
      code: '199', description: 'Riser4 reporting an invalid error.',
      correctiveAction: 'NA',
    },
    {
      code: '200', description: 'Riser4 reporting an invalid error.',
      correctiveAction: 'NA',
    },
    {
      code: '201', description: 'Riser4 reporting an invalid error.',
      correctiveAction: 'NA',
    },
    {
      code: '202', description: 'Riser4 has detected another board with the same address.',
      correctiveAction: 'NA',
    },
    {
      code: '203', description: 'Riser4 reporting a CAN1 bus reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '204', description: 'Riser4 reporting a CAN2 bus reset error.',
      correctiveAction: 'NA',
    },
    {
      code: '205', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '206', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '207', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '208', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '209', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '210', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '211', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '212', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '213', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '214', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '215', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '216', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '217', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '218', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '219', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '220', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '221', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '222', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '223', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '224', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '225', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '226', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '227', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '228', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '229', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '230', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '231', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '232', description: 'Module runtime limit exceeded for module index 1.',
      correctiveAction: 'NA',
    },
    {
      code: '233', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '234', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '235', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '236', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '237', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '238', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '239', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '240', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '241', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '242', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '243', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '244', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '245', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '246', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '247', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '248', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '249', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '250', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '251', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '252', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '253', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '254', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '255', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '256', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '257', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '258', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '259', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '260', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '261', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '262', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '263', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '264', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '265', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '266', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '267', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '268', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '269', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '270', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '271', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '272', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '273', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '274', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '275', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '276', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '277', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '278', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '279', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '280', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '281', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '282', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '283', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '284', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '285', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '286', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '287', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '288', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '289', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '290', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '291', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '292', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '293', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '294', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '295', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '296', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '297', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '298', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '299', description: 'Module runtime limit exceeded for module index 1.',
      correctiveAction: 'NA',
    },
    {
      code: '300', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '301', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '302', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '303', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '304', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '305', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '306', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '307', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '308', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '309', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '310', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '311', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '312', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '313', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '314', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '315', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '316', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '317', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '318', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '319', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '320', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '321', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '322', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '323', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '324', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '325', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '326', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '327', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '328', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '329', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '330', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '331', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '332', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '333', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '334', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '335', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '336', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '337', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '338', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '339', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '340', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '341', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '342', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '343', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '344', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '345', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '346', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '347', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '348', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '349', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '350', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '351', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '352', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '353', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '354', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '355', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '356', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '357', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '358', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '359', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '360', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '361', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '362', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '363', description: 'Module runtime limit exceeded for module index 1.',
      correctiveAction: 'NA',
    },
    {
      code: '364', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '365', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '366', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '367', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '368', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '369', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '370', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '371', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '372', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '373', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '374', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '375', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '376', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '377', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '378', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '379', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '380', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '381', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '382', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '383', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '384', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '385', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '386', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '387', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '388', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '389', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '390', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '391', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '392', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '393', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '394', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '395', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '396', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '397', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '398', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '399', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '400', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '401', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '402', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '403', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '404', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '405', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '406', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '407', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '408', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '409', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '410', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '411', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '412', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '413', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '414', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '415', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '416', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '417', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '418', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '419', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '420', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '421', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '422', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '423', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '424', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '425', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '426', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '427', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '428', description: 'Module runtime limit exceeded for module index 1.',
      correctiveAction: 'NA',
    },
    {
      code: '429', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '430', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '431', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '432', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '433', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '434', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '435', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '436', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '437', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '438', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '439', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '440', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '441', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '442', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '443', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '444', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '445', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '446', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '447', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '448', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '449', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '450', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '451', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '452', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '453', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '454', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '455', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '456', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '457', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '458', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '459', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '460', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '461', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '462', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '463', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '464', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '465', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '466', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '467', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '468', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '469', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '470', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '471', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '472', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '473', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '474', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '475', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '476', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '477', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '478', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '479', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '480', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '481', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '482', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '483', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '484', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '485', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '486', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '487', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '488', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '489', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '490', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '491', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '492', description: 'Module runtime limit exceeded for module index 1.',
      correctiveAction: 'NA',
    },
    {
      code: '493', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '494', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '495', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '496', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '497', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '498', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '499', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '500', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '501', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '502', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '503', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '504', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '505', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '506', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '507', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '508', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '509', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '510', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '511', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '512', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '513', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '514', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '515', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '516', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '517', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '518', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '519', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '520', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '521', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '522', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '523', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '524', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '525', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '526', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '527', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '528', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '529', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '530', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '531', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '532', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '533', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '534', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '535', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '536', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '537', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '538', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '539', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '540', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '541', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '542', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '543', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '544', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '545', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '546', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '547', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '548', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '549', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '550', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '551', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '552', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '553', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '554', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '555', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '556', description: 'Module runtime limit exceeded for module index 1.',
      correctiveAction: 'NA',
    },
    {
      code: '557', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '558', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '559', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '560', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '561', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '562', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '563', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '564', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '565', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '566', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '567', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '568', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '569', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '570', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '571', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '572', description: 'NA',
      correctiveAction: 'N/A',
    },
    {
      code: '573', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '574', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '575', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '576', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '577', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '578', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '579', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '580', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '581', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '582', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '583', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '584', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '585', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '586', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '587', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '588', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '589', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '590', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '591', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '592', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '593', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '594', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '595', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '596', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '597', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '598', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '599', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '600', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '601', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '602', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '603', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '604', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '605', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '606', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '607', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '608', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '609', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '610', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '611', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '612', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '613', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '614', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '615', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '616', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '617', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '618', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '619', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '620', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '621', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '622', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '623', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '624', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '625', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '626', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '627', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '628', description: 'DD Panel manager board has gone offline.',
      correctiveAction: 'Check DD manager board wiring.',
    },
    {
      code: '629', description: 'Test alarm signaling that both locks and gsw are open while in motion. Enabled with 01-159.',
      correctiveAction: 'NA',
    },
    {
      code: '630', description: 'FRAM\'s data redundancy check has failed, but the data was recovered.',
      correctiveAction: 'NA',
    },
    {
      code: '631', description: 'Debugging alarm signalling that DO output asserted during a run. Will not flag if decelerating, in stop sequence, or releveling.',
      correctiveAction: 'NA',
    },
    {
      code: '632', description: 'Debugging alarm signalling that the flag preventing DO is being lost during a run. Will not flag if decelerating, in stop sequence, or releveling.',
      correctiveAction: 'NA',
    },
    {
      code: '633', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '634', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '635', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '636', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '637', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '638', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '639', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '640', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '641', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '642', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '643', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '644', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '645', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '646', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '647', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '648', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '649', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '650', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '651', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '652', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '653', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '654', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '655', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '656', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '657', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '658', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '659', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '660', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '661', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '662', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '663', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '664', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '665', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '666', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '667', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '668', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '669', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '670', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '671', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '672', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '673', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '674', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '675', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '676', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '677', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '678', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '679', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '680', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '681', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '682', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '683', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '684', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '685', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '686', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '687', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '688', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '689', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '690', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '691', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '692', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '693', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '694', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '695', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '696', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '697', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '698', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '699', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '700', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '701', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '702', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '703', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '704', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '705', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '706', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '707', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '708', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '709', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '710', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '711', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '712', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '713', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '714', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '715', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '716', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '717', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '718', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '719', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '720', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '721', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '722', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '723', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '724', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '725', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '726', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '727', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '728', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '729', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '730', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '731', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '732', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '733', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '734', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '735', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '736', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '737', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '738', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '739', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '740', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '741', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '742', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '743', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '744', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '745', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '746', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '747', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '748', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '749', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '750', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '751', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '752', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '753', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '754', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '755', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '756', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '757', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '758', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '759', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '760', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '761', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '762', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '763', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '764', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '765', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '766', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '767', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '768', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '769', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '770', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '771', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '772', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '773', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '774', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '775', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '776', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '777', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '778', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '779', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '780', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '781', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '782', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '783', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '784', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '785', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '786', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '787', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '788', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '789', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '790', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '791', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '792', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '793', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '794', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '795', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '796', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '797', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '798', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '799', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '800', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '801', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '802', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '803', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '804', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '805', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '806', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '807', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '808', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '809', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '810', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '811', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '812', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '813', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '814', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '815', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '816', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '817', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '818', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '819', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '820', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '821', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '822', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '823', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '824', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '825', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '826', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '827', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '828', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '829', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '830', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '831', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '832', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '833', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '834', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '835', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '836', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '837', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '838', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '839', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '840', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '841', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '842', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '843', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '844', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '845', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '846', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '847', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '848', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '849', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '850', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '851', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '852', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '853', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '854', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '855', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '856', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '857', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '858', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '859', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '860', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '861', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '862', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '863', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '864', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '865', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '866', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '867', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '868', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '869', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '870', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '871', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '872', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '873', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '874', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '875', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '876', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '877', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '878', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '879', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '880', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '881', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '882', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '883', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '884', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '885', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '886', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '887', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '888', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '889', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '890', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '891', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '892', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '893', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '894', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '895', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '896', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '897', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '898', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '899', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '900', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '901', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '902', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '903', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '904', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '905', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '906', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '907', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '908', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '909', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '910', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '911', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '912', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '913', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '914', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '915', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '916', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '917', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '918', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '919', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '920', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '921', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '922', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '923', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '924', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '925', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '926', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '927', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '928', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '929', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '930', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '931', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '932', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '933', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '934', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '935', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '936', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '937', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '938', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '939', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '940', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '941', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '942', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '943', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '944', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '945', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '946', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '947', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '948', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '949', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '950', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '951', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '952', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '953', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '954', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '955', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '956', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '957', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '958', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '959', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '960', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '961', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '962', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '963', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '964', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '965', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '966', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '967', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '968', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '969', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '970', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '971', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '972', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '973', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '974', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '975', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '976', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '977', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '978', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '979', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '980', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '981', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '982', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '983', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '984', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '985', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '986', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '987', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '988', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '989', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '990', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '991', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '992', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '993', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '994', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '995', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '996', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '997', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '998', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '999', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1000', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1001', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1002', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1003', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1004', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1005', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1006', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1007', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1008', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1009', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1010', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1011', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1012', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1013', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1014', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1015', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1016', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1017', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1018', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1019', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1020', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1021', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1022', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1023', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1024', description: 'Specified terminal exceeds the two duplicate limit per input function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1025', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1026', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1027', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1028', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1029', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1030', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1031', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1032', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1033', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1034', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1035', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1036', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1037', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1038', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1039', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1040', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1041', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1042', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1043', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1044', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1045', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1046', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1047', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1048', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1049', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1050', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1051', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1052', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1053', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1054', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1055', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1056', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1057', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1058', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1059', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1060', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1061', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1062', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1063', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1064', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1065', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1066', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1067', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1068', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1069', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1070', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1071', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1072', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1073', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1074', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1075', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1076', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1077', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1078', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1079', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1080', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1081', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1082', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1083', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1084', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1085', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1086', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1087', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1088', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1089', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1090', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1091', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1092', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1093', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1094', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1095', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1096', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1097', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1098', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1099', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1100', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1101', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1102', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1103', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1104', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1105', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1106', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1107', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1108', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1109', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1110', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1111', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1112', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1113', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1114', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1115', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1116', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1117', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1118', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1119', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1120', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1121', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1122', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1123', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1124', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1125', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1126', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1127', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1128', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1129', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1130', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1131', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1132', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1133', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1134', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1135', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1136', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1137', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1138', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1139', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1140', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1141', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1142', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1143', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1144', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1145', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1146', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1147', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1148', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1149', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1150', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1151', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1152', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1153', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1154', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1155', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1156', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1157', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1158', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1159', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1160', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1161', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1162', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1163', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1164', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1165', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1166', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1167', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1168', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1169', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1170', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1171', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1172', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1173', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1174', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1175', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1176', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1177', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1178', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1179', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1180', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1181', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1182', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1183', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1184', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1185', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1186', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1187', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1188', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1189', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1190', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1191', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1192', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1193', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1194', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1195', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1196', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1197', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1198', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1199', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1200', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1201', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1202', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1203', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1204', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1205', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1206', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1207', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1208', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1209', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1210', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1211', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1212', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1213', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1214', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1215', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1216', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1217', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1218', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1219', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1220', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1221', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1222', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1223', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1224', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1225', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1226', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1227', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1228', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1229', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1230', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1231', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1232', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1233', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1234', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1235', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1236', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1237', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1238', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1239', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1240', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1241', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1242', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1243', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1244', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1245', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1246', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1247', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1248', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1249', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1250', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1251', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1252', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1253', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1254', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1255', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1256', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1257', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1258', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1259', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1260', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1261', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1262', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1263', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1264', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1265', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1266', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1267', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1268', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1269', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1270', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1271', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1272', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1273', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1274', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1275', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1276', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1277', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1278', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1279', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1280', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1281', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1282', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1283', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1284', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1285', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1286', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1287', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1288', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1289', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1290', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1291', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1292', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1293', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1294', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1295', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1296', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1297', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1298', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1299', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1300', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1301', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1302', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1303', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1304', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1305', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1306', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1307', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1308', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1309', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1310', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1311', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1312', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1313', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1314', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1315', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1316', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1317', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1318', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1319', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1320', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1321', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1322', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1323', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1324', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1325', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1326', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1327', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1328', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1329', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1330', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1331', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1332', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1333', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1334', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1335', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1336', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1337', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1338', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1339', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1340', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1341', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1342', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1343', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1344', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1345', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1346', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1347', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1348', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1349', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1350', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1351', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1352', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1353', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1354', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1355', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1356', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1357', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1358', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1359', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1360', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1361', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1362', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1363', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1364', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1365', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1366', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1367', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1368', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1369', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1370', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1371', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1372', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1373', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1374', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1375', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1376', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1377', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1378', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1379', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1380', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1381', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1382', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1383', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1384', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1385', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1386', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1387', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1388', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1389', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1390', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1391', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1392', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1393', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1394', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1395', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1396', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1397', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1398', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1399', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1400', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1401', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1402', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1403', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1404', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1405', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1406', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1407', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1408', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1409', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1410', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1411', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1412', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1413', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1414', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1415', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1416', description: 'Specified terminal exceeds the two duplicate limit per output function.',
      correctiveAction: 'Clear the terminal\'s function.',
    },
    {
      code: '1417', description: 'Communication with load weighing device has been lost.',
      correctiveAction: 'Check the status of the smart rise load weigher. If no loadweigher exists, set load weigher select (08-135) to zero.',
    },
    {
      code: '1418', description: 'Communication with DL20 fixture and car top SRU has been lost.',
      correctiveAction: 'Check wiring and power to DL20.',
    },
    {
      code: '1419', description: 'Communication with DL20 fixture and car operating panel SRU has been lost.',
      correctiveAction: 'Check wiring and power to DL20.',
    },
    {
      code: '1420', description: 'CPLD communication buffers have been overrun.',
      correctiveAction: 'Contact smartrise support.',
    },
    {
      code: '1421', description: 'CPLD communication buffers have been overrun.',
      correctiveAction: 'Contact smartrise support.',
    },
    {
      code: '1422', description: 'CPLD communication buffers have been overrun.',
      correctiveAction: 'Contact smartrise support.',
    },
    {
      code: '1423', description: 'Fire phase 1 has been activated by the main fire keyswitch.',
      correctiveAction: 'Check the fire input and riser board status.',
    },
    {
      code: '1424', description: 'Fire phase 1 has been activated by the remote fire keyswitch.',
      correctiveAction: 'Check the fire input and riser board status.',
    },
    {
      code: '1425', description: 'Fire phase 1 has been activated by the main smoke input.',
      correctiveAction: 'Check the fire input and riser board status.',
    },
    {
      code: '1426', description: 'Fire phase 1 has been activated by the alternate smoke input.',
      correctiveAction: 'Check the fire input and riser board status.',
    },
    {
      code: '1427', description: 'Fire phase 1 has been activated by the machine room smoke input.',
      correctiveAction: 'Check the fire input and riser board status.',
    },
    {
      code: '1428', description: 'Fire phase 1 has been activated by the hoistway smoke input.',
      correctiveAction: 'Check the fire input and riser board status.',
    },
    {
      code: '1429', description: 'Fire phase 1 has been activated by a latched fire reclal source following a power loss.',
      correctiveAction: 'Check the fire input and riser board status.',
    },
    {
      code: '1430', description: 'Fire phase 1 has been activated by the pit smoke input.',
      correctiveAction: 'Check the fire input and riser board status.',
    },
    {
      code: '1431', description: 'Fire phase 1 has been activated by the second machine room smoke input.',
      correctiveAction: 'Check the fire input and riser board status.',
    },
    {
      code: '1432', description: 'Fire phase 1 has been activated by the second hoistway smoke input.',
      correctiveAction: 'Check the fire input and riser board status.',
    },
    {
      code: '1433', description: 'Machine room SRU board needs to be reset.',
      correctiveAction: 'Cycle power to the machine room SRU board.',
    },
    {
      code: '1434', description: 'Car top SRU board needs to be reset.',
      correctiveAction: 'Cycle power to the car top SRU board.',
    },
    {
      code: '1435', description: 'Car operating panel SRU board needs to be reset.',
      correctiveAction: 'Cycle power to the car operating panel SRU board.',
    },
    {
      code: '1436', description: 'Unintended movement test feature is active. If not intended, turn OFF MR SRU DIP B8 and parameter 01-0052 to disable the feature.',
      correctiveAction: 'Unintended movement test feature is active. If not intended, turn OFF MR SRU DIP B8 and parameter 01-0052 to disable the feature.',
    },
    {
      code: '1437', description: 'Communication has been lost between Dupar COP and COP SRU.',
      correctiveAction: 'Check wiring between Dupar COP and COP SRU (C3H/C3L)',
    },
    {
      code: '1438', description: 'Riser 1 has reported communication loss with one of its hall boards.',
      correctiveAction: 'Check the hall board status menu for a hall board reporting 0% communcation and check wiring.',
    },
    {
      code: '1439', description: 'Riser 2 has reported communication loss with one of its hall boards.',
      correctiveAction: 'Check the hall board status menu for a hall board reporting 0% communcation and check wiring.',
    },
    {
      code: '1440', description: 'Riser 3 has reported communication loss with one of its hall boards.',
      correctiveAction: 'Check the hall board status menu for a hall board reporting 0% communcation and check wiring.',
    },
    {
      code: '1441', description: 'Riser 4 has reported communication loss with one of its hall boards.',
      correctiveAction: 'Check the hall board status menu for a hall board reporting 0% communcation and check wiring.',
    },
    {
      code: '1442', description: 'Shield error state is unknown.',
      correctiveAction: 'Check wiring of power and network lines.',
    },
    {
      code: '1443', description: 'Shield is starting up after a standard reset event.',
      correctiveAction: 'Check wiring of power and network lines.',
    },
    {
      code: '1444', description: 'Shield is starting up after a brown out reset event.',
      correctiveAction: 'Check wiring of power and network lines.',
    },
    {
      code: '1445', description: 'Shield is starting up after a watchdog timer reset event.',
      correctiveAction: 'Check wiring of power and network lines.',
    },
    {
      code: '1446', description: 'Shield has not see communication from the group network in 5 seconds.',
      correctiveAction: 'Check wiring of power and network lines.',
    },
    {
      code: '1447', description: 'Shield has not seen communication from the RPi in 5 seconds.',
      correctiveAction: 'Check wiring of power and network lines.',
    },
    {
      code: '1448', description: 'Shield RTC has failed.',
      correctiveAction: 'Replace on board battery.',
    },
    {
      code: '1449', description: 'Shield UART transmit buffer has overflowed.',
      correctiveAction: 'Contact smartrise support.',
    },
    {
      code: '1450', description: 'Shield UART receive buffer has overflowed.',
      correctiveAction: 'Contact smartrise support.',
    },
    {
      code: '1451', description: 'Shield CAN transmit buffer has overflowed.',
      correctiveAction: 'Contact smartrise support.',
    },
    {
      code: '1452', description: 'Shield CAN receive buffer has overflowed.',
      correctiveAction: 'Contact smartrise support.',
    },
    {
      code: '1453', description: 'Shield has detected a can bus reset event.',
      correctiveAction: 'Check wiring of power and network lines.',
    },
    {
      code: '1454', description: 'VIP process has been canceled due to excessive wait time.',
      correctiveAction: 'NA',
    },
    {
      code: '1455', description: 'Fire phase 1 has been activated by Virtual Input Fire Remote Recall',
      correctiveAction: 'NA',
    },
    {
      code: '1456', description: 'Car is on EMS phase 2, in a dead zone with doors open, but can\'t exit EMS 2 because it is not at the correct recall floor (the floor it was first called to on EMS phase 1).',
      correctiveAction: 'Either move car to the correct EMS 1 recall floor, or turn ON parameter EMS_ExitPh2AtAnyFloor (01-98) to allow exiting EMS phase 2 at any floor.',
    },
    {
      code: '1457', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '1458', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '1459', description: 'NA',
      correctiveAction: 'NA',
    },
    {
      code: '1460', description: 'While attempting to do the Buffer Test, Buffer speed is 0 or less than Learn Speed.',
      correctiveAction: 'Set the Buffer Speed to a higher FPM ( Contract Speed or above Learn Speed ). ',
    },
    {
      code: '1461', description: 'While attempting to do the Asc/Des Overspeed test, Asc/Des speed is 0 or less than Learn Speed.',
      correctiveAction: 'Set the Asc/Des speed to a higher FPM ( Contract Speed or above Learn Speed ). ',
    },
    {
      code: '1462', description: 'Primary CEDES camera channel 1 reporting a communication error.',
      correctiveAction: 'Check wiring and network termination.',
    },
    {
      code: '1463', description: 'Primary CEDES camera channel 1 reporting a cannot read tape error.',
      correctiveAction: 'Clean camera window, clean tape, check alignment.',
    },
    {
      code: '1464', description: 'Primary CEDES camera channel 1 reporting a tape too close error.',
      correctiveAction: 'Fix tape alignment.',
    },
    {
      code: '1465', description: 'Primary CEDES camera channel 1 reporting a tape too far error.',
      correctiveAction: 'Fix tape alignment.',
    },
    {
      code: '1466', description: 'Primary CEDES camera channel 1 reporting a tape too far left error.',
      correctiveAction: 'Fix tape alignment.',
    },
    {
      code: '1467', description: 'Primary CEDES camera channel 1 reporting a tape too far right error.',
      correctiveAction: 'Fix tape alignment.',
    },
    {
      code: '1468', description: 'Primary CEDES camera channel 1 reporting a contrast - service recommended read status.',
      correctiveAction: 'Clean camera window, clean tape, check alignment.',
    },
    {
      code: '1469', description: 'Primary CEDES camera channel 1 reporting a contrast - warning read status.',
      correctiveAction: 'Clean camera window, clean tape, check alignment.',
    },
    {
      code: '1470', description: 'Primary CEDES camera channel 1 reporting a contrast - stopped read status.',
      correctiveAction: 'Clean camera window, clean tape, check alignment.',
    },
    {
      code: '1471', description: 'Primary CEDES camera channel 1 failed CRC check.',
      correctiveAction: 'Check wiring and network termination.',
    },
    {
      code: '1472', description: 'Primary CEDES camera channel 2 reporting a communication error.',
      correctiveAction: 'Check wiring and network termination.',
    },
    {
      code: '1473', description: 'Primary CEDES camera channel 2 reporting a cannot read tape error.',
      correctiveAction: 'Clean camera window, clean tape, check alignment.',
    },
    {
      code: '1474', description: 'Primary CEDES camera channel 2 reporting a tape too close error.',
      correctiveAction: 'Fix tape alignment.',
    },
    {
      code: '1475', description: 'Primary CEDES camera channel 2 reporting a tape too far error.',
      correctiveAction: 'Fix tape alignment.',
    },
    {
      code: '1476', description: 'Primary CEDES camera channel 2 reporting a tape too far left error.',
      correctiveAction: 'Fix tape alignment.',
    },
    {
      code: '1477', description: 'Primary CEDES camera channel 2 reporting a tape too far right error.',
      correctiveAction: 'Fix tape alignment.',
    },
    {
      code: '1478', description: 'Primary CEDES camera channel 2 reporting a contrast - service recommended read status.',
      correctiveAction: 'Clean camera window, clean tape, check alignment.',
    },
    {
      code: '1479', description: 'Primary CEDES camera channel 2 reporting a contrast - warning read status.',
      correctiveAction: 'Clean camera window, clean tape, check alignment.',
    },
    {
      code: '1480', description: 'Primary CEDES camera channel 2 reporting a contrast - stopped read status.',
      correctiveAction: 'Clean camera window, clean tape, check alignment.',
    },
    {
      code: '1481', description: 'Primary CEDES camera channel 2 failed CRC check.',
      correctiveAction: 'Check wiring and network termination.',
    },
    {
      code: '1482', description: 'ETSL CEDES camera channel 2 reporting a communication error.',
      correctiveAction: 'Check wiring and network termination.',
    },
    {
      code: '1483', description: 'ETSL CEDES camera channel 2 reporting a cannot read tape error.',
      correctiveAction: 'Clean camera window, clean tape, check alignment.',
    },
    {
      code: '1484', description: 'ETSL CEDES camera channel 2 reporting a tape too close error.',
      correctiveAction: 'Fix tape alignment.',
    },
    {
      code: '1485', description: 'ETSL CEDES camera channel 2 reporting a tape too far error.',
      correctiveAction: 'Fix tape alignment.',
    },
    {
      code: '1486', description: 'ETSL CEDES camera channel 2 reporting a tape too far left error.',
      correctiveAction: 'Fix tape alignment.',
    },
    {
      code: '1487', description: 'ETSL CEDES camera channel 2 reporting a tape too far right error.',
      correctiveAction: 'Fix tape alignment.',
    },
    {
      code: '1488', description: 'ETSL CEDES camera channel 2 reporting a contrast - service recommended read status.',
      correctiveAction: 'Clean camera window, clean tape, check alignment.',
    },
    {
      code: '1489', description: 'ETSL CEDES camera channel 2 reporting a contrast - warning read status.',
      correctiveAction: 'Clean camera window, clean tape, check alignment.',
    },
    {
      code: '1490', description: 'ETSL CEDES camera channel 2 reporting a contrast - stopped read status.',
      correctiveAction: 'Clean camera window, clean tape, check alignment.',
    },
    {
      code: '1491', description: 'ETSL CEDES camera channel 2 failed CRC check.',
      correctiveAction: 'Check wiring and network termination.',
    },
    {
      code: '1492', description: 'DAD unit has stopped communicating with the C4 car for 15 seconds.',
      correctiveAction: 'Check group network wiring. Check that power is supplied to the DAD unit.',
    },
    {
      code: '1493', description: 'Communication lost with primary soft starter.',
      correctiveAction: '(Hydro Only) Check primary soft starter board and wiring.',
    },
    {
      code: '1494', description: 'Primary soft starter reporting an unknown fault.',
      correctiveAction: '(Hydro Only) Check primary soft starter board and wiring.',
    },
    {
      code: '1495', description: 'Primary soft starter recovering from a reset due to power off.',
      correctiveAction: '(Hydro Only) Check primary soft starter board and wiring.',
    },
    {
      code: '1496', description: 'Primary soft starter recovering from reset due to watchdog.',
      correctiveAction: '(Hydro Only) Check primary soft starter board and wiring.',
    },
    {
      code: '1497', description: 'Primary soft starter recovering from reset due to voltage dip.',
      correctiveAction: '(Hydro Only) Check primary soft starter board and wiring.',
    },
    {
      code: '1498', description: 'Primary soft starter reporting loss of communication with the elevator controller.',
      correctiveAction: '(Hydro Only) Check primary soft starter board and wiring.',
    },
    {
      code: '1499', description: 'Primary soft starter reporting an overcurrent error.',
      correctiveAction: '(Hydro Only) Check primary soft starter board and wiring.',
    },
    {
      code: '1500', description: 'Primary soft starter reporting an overvoltage error.',
      correctiveAction: '(Hydro Only) Check primary soft starter board and wiring.',
    },
    {
      code: '1501', description: 'Primary soft starter reporting an undervoltage error.',
      correctiveAction: '(Hydro Only) Check primary soft starter board and wiring.',
    },
    {
      code: '1502', description: 'Primary soft starter reporting a missing phase.',
      correctiveAction: '(Hydro Only) Check primary soft starter board and wiring.',
    },
    {
      code: '1503', description: 'Primary soft starter reporting phase sequence error.',
      correctiveAction: '(Hydro Only) Check primary soft starter board and wiring.',
    },
    {
      code: '1504', description: 'Primary soft starter reporting a CAN bus reset.',
      correctiveAction: '(Hydro Only) Check primary soft starter board and wiring.',
    },
    {
      code: '1505', description: 'Discrete input fault 2 from the Soft Starter has been actived.',
      correctiveAction: '(Hydro Only) Check the SS 2 Input fault, and the contact feeding the input from the drive.',
    },
    {
      code: '1506', description: 'Communication lost with secondary soft starter.',
      correctiveAction: '(Hydro Only) Check secondary soft starter board and wiring.',
    },
    {
      code: '1507', description: 'Secondary soft starter reporting an unknown fault.',
      correctiveAction: '(Hydro Only) Check secondary soft starter board and wiring.',
    },
    {
      code: '1508', description: 'Secondary soft starter recovering from a reset due to power off.',
      correctiveAction: '(Hydro Only) Check secondary soft starter board and wiring.',
    },
    {
      code: '1509', description: 'Secondary soft starter recovering from reset due to watchdog.',
      correctiveAction: '(Hydro Only) Check secondary soft starter board and wiring.',
    },
    {
      code: '1510', description: 'Secondary soft starter recovering from reset due to voltage dip.',
      correctiveAction: '(Hydro Only) Check secondary soft starter board and wiring.',
    },
    {
      code: '1511', description: 'Secondary soft starter reporting loss of communication with the elevator controller.',
      correctiveAction: '(Hydro Only) Check secondary soft starter board and wiring.',
    },
    {
      code: '1512', description: 'Secondary soft starter reporting an overcurrent error.',
      correctiveAction: '(Hydro Only) Check secondary soft starter board and wiring.',
    },
    {
      code: '1513', description: 'Secondary soft starter reporting an overvoltage error.',
      correctiveAction: '(Hydro Only) Check secondary soft starter board and wiring.',
    },
    {
      code: '1514', description: 'Secondary soft starter reporting an undervoltage error.',
      correctiveAction: '(Hydro Only) Check secondary soft starter board and wiring.',
    },
    {
      code: '1515', description: 'Secondary soft starter reporting a missing phase.',
      correctiveAction: '(Hydro Only) Check secondary soft starter board and wiring.',
    },
    {
      code: '1516', description: 'Secondary soft starter reporting phase sequence error.',
      correctiveAction: '(Hydro Only) Check secondary soft starter board and wiring.',
    },
    {
      code: '1517', description: 'Secondary soft starter reporting a CAN bus reset.',
      correctiveAction: '(Hydro Only) Check secondary soft starter board and wiring.',
    },
    {
      code: '1518', description: 'Discrete input fault 2 from the Soft Starter has been actived.',
      correctiveAction: '(Hydro Only) Check the SS 2 Input fault, and the contact feeding the input from the drive.',
    },
    {
      code: '1519', description: 'Primary soft starter reporting another board on the network has the same address.',
      correctiveAction: '(Hydro Only) Check primary soft starter address DIP switches.',
    },
    {
      code: '1520', description: 'Secondary soft starter reporting another board on the network has the same address.',
      correctiveAction: '(Hydro Only) Check secondary soft starter address DIP switches.',
    },
    {
      code: '1521', description: 'If the car on fire phase 2 operation, and not at the recall floor. When the in car fire keyswitch is turned to the OFF position, the car will be put in a Fire Phase 2 Hold state if option Fire__Phase2ExitOnlyAtRecallFlr (01-0017) is ON. This alarm informs the user that they should move the car back to the recall floor before attempting to exit phase 2.',
      correctiveAction: 'Return the car to the recall floor before exiting phase 2.',
    },
    {
      code: '1522', description: 'The car has attempted to move to a recall floor but failed to start movement within 5 seconds.',
      correctiveAction: 'This alarm is for diagnostics and does not require immediate smartrise support unless accompanied by other recall related issues.',
    },
    {
      code: '1523', description: 'The car has failed to slowdown to configured leveling speed during a slowdown learn within 10 seconds of cutting the high speed valve. Set the car\'s leveling speed parameter to above the car\'s max leveling valve speed.',
      correctiveAction: 'This alarm is for identifying when the car\'s leveling speed is not set above the car\'s leveling speed.',
    },
    {
      code: '1524', description: 'Serial load weighing device reporting an unknown error.',
      correctiveAction: 'Check wiring of the serial load weighing device.',
    },
    {
      code: '1525', description: 'Serial load weighing device reporting a powering on reset error.',
      correctiveAction: 'Check serial load weighing device\'s power supply.',
    },
    {
      code: '1526', description: 'Serial load weighing device reporting a watchdog reset error.',
      correctiveAction: 'Contact smartrise support.',
    },
    {
      code: '1527', description: 'Serial load weighing device reporting a brown out reset error.',
      correctiveAction: 'Check serial load weighing device\'s power supply.',
    },
    {
      code: '1528', description: 'Serial load weighing device reporting no communciation with the C4 system detected.',
      correctiveAction: 'Check wiring of serial load weighing device\'s CAN H and CAN L.',
    },
    {
      code: '1529', description: 'Serial load weighing device reporting no communication detected with load cell processor.',
      correctiveAction: 'Contact smartrise support.',
    },
    {
      code: '1530', description: 'Serial load weighing device reporting the can bus controller has reset.',
      correctiveAction: 'Check wiring of serial load weighing device\'s CAN H and CAN L.',
    },
    {
      code: '1531', description: 'Serial load weighing device reporting the watchdog is disabled.',
      correctiveAction: 'Check on board watchdog jumper.',
    },
    {
      code: '1532', description: 'The CAN1 buffer on MRA has overflowed. Investigate CN1+/- network issues.',
      correctiveAction: 'Check CN1 +/- network wiring and termination.',
    },
    {
      code: '1533', description: 'The CAN1 buffer on CTA has overflowed. Investigate CN1+/- network issues.',
      correctiveAction: 'Check CN1 +/- network wiring and termination.',
    },
    {
      code: '1534', description: 'The CAN1 buffer on COPA has overflowed. Investigate CN1+/- network issues.',
      correctiveAction: 'Check CN1 +/- network wiring and termination.',
    },
    {
      code: '1535', description: 'The car has reached the normal limits of either the bottom or top doorzone. ',
      correctiveAction: 'Move the car away from the Norma Limit. ',
    },
  ];
  thresholdType: any;
  filteredfaults$: Observable<IFaultLookup[]>;
  filteredalarms$: Observable<IAlarm[]>;

  constructor(private bsRef: BsModalRef,
    baseService: BaseComponentService
    ) {
    super(baseService);
  }

  ngOnInit(): void {
    this.initializeSpecialLists();
    this.initializeEnums();
    this.createForm();
    this.filteredfaults$ = of(this.faults);
    this.filteredalarms$ = of(this.alarms);
  }

  initializeEnums() {

    this.severities = this.populateLookupAsFilterList(Severity);
    this.alertTypes = this.populateLookupAsFilterList(AlertType);

    const countBasedPart = this.alertTypes.find(x => x.value === AlertType.CountBasedPart);
    const timeBasedPart = this.alertTypes.find(x => x.value === AlertType.TimeBasedPart);

    countBasedPart.title = 'Count-based Part';
    timeBasedPart.title = 'Time-based Part';
  }

  onAlertTypeChange(event) {
    this.alertType = event;
    this.alertSettingsForm.patchValue({

      fault: null,
      faultCount: null,
      faultPossibleAffectedParts: null,
      faultThreshold: null,

      alarm: null,
      alarmCount: null,
      alarmPossibleAffectedParts: null,
      alarmThreshold: null,

      countBasedPart: null,
      countBasedVendor: null,
      nbOfLatchesOfTurns: null,
      nbOfLatchesOfTurnsThreshold: null,

      timeBasedPart: null,
      timeBasedVendor: null,
      nbOfDays: null,
      nbOfDaysThreshold: null,
    });
  }

  onChangeThreshold(event) {
    this.thresholdType = event.target.value;
    this.alertSettingsForm.patchValue({
      counter: null,
      numberOfFaults: null,
      periodType: null,
      period: null,
    });
  }

  onCancel() {
    this.bsRef.hide();
  }

  initializeSpecialLists() {
    this.partTypes = [
      {
        name: 'BPS',
        thresholdType: ThresholdType.Counter,
        threshold: 1,
        periodType: null,
        period: null,
        counter: null,
        faultsCount: null
      },
      {
        name: 'Brakes', thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'DZ sensor',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'Contactors',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'Slim line relays when used',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'Roller Guides',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'Guide Shoes',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'Safety String Contacts',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'Door Locks',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'Closed Contacts',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'Gate switch',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'Door restrictor',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'Cam Solenoid / If applicable',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null,
        counter: null, faultsCount: null
      },
      {
        name: 'Contactor Auxiliary Contacts',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null,
        counter: null, faultsCount: null
      },
      {
        name: 'Force guided relays on the MRU board. ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null,
        period: null, counter: null, faultsCount: null
      },
      {
        name: 'CC lamps ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'HC lamps ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'Position Indicators ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'Discrete PI driver board relays ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'Governor Switch ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'Governor Mechanical ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: '(1 Year Test)',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: '(5 Year Test) ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: '(10 Year Test) ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'ERD and Battery Lowering Batteries ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'Time battery ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'Tape Cleaning ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'Load weighing calibration ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'Cab lights ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'Cab fan ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'Controller fan',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'COP backup battery ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'CC security contacts ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'Photo eye/light curtain/ safety edge ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'Door cleaning/ inspection ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'GUI ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'Encoder ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'Ride quality ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'Floor adjustments ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'Oil level ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'Jack packing ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'Cleaning pit ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'Clean car top ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'Clean door sills ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
      {
        name: 'Check valves ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null,
        faultsCount: null
      },
    ];
    this.partTypes = this.partTypes.sort((a, b) => a.name.localeCompare(b.name));
    this.possiblePartTypes = this.partTypes.copyWithin(this.partTypes.length, 0, this.partTypes.length);
    this.vendors = [
      {
        id: 1,
        name: 'Vendor 1',
      },
      {
        id: 2,
        name: 'Vendor 2',
      },
      {
        id: 3,
        name: 'Vendor 3',
      },
    ];
  }

  onSubmit() {
    // this.messageService.showSuccessMessage('Alert setting has been saved successfully');
    // this.bsRef.hide();
  }

  createForm() {
    this.alertSettingsForm = new UntypedFormGroup({
      alertName: new UntypedFormControl('', SmartriseValidators.requiredWithTrim),
      alertDescription: new UntypedFormControl('', [SmartriseValidators.requiredWithTrim]),

      severity: new UntypedFormControl('', [Validators.required]),
      alertType: new UntypedFormControl('', [Validators.required]),

      alertDate: new UntypedFormControl('', [Validators.required]),

      fault: new UntypedFormControl('', [Validators.required]),
      faultCount: new UntypedFormControl('', Validators.required),
      faultPossibleAffectedParts: new UntypedFormControl('', Validators.required),
      faultThreshold: new UntypedFormControl('', Validators.required),

      alarm: new UntypedFormControl('', Validators.required),
      alarmCount: new UntypedFormControl('', Validators.required),
      alarmPossibleAffectedParts: new UntypedFormControl('', Validators.required),
      alarmThreshold: new UntypedFormControl('', Validators.required),

      countBasedPart: new UntypedFormControl('', Validators.required),
      countBasedVendor: new UntypedFormControl('', Validators.required),
      nbOfLatchesOfTurns: new UntypedFormControl('', Validators.required),
      nbOfLatchesOfTurnsThreshold: new UntypedFormControl('', Validators.required),

      timeBasedPart: new UntypedFormControl('', Validators.required),
      timeBasedVendor: new UntypedFormControl('', Validators.required),
      nbOfDays: new UntypedFormControl('', Validators.required),
      nbOfDaysThreshold: new UntypedFormControl('', Validators.required),
    });

    if (this.alert) {
      const _alert = { ...this.alert };
      delete _alert.alertId;
      this.alertType = _alert.alertType;
      this.alertSettingsForm.setValue(_alert);
    }
  }

  getFilteredFaults(value: string): Observable<IFaultLookup[]> {
    return of(value).pipe(
      map(filterString => this.filterFaults(filterString)),
    );
  }

  onFaultChange() {
    this.filteredfaults$ = this.getFilteredFaults(this.autoFaultInput.nativeElement.value);
  }

  onFaultSelectionChange($event) {
    this.filteredfaults$ = this.getFilteredFaults($event);
  }

  getFilteredAlarms(value: string): Observable<IAlarm[]> {
    return of(value).pipe(
      map(filterString => this.filterAlarms(filterString)),
    );
  }

  onAlarmChange() {
    this.filteredalarms$ = this.getFilteredAlarms(this.autoAlarmInput.nativeElement.value);
  }

  onAlarmSelectionChange($event) {
    this.filteredalarms$ = this.getFilteredAlarms($event);
  }

  viewFaultHandle(value: IFaultLookup) {
    return value?.description ? value?.description : value;
  }

  viewAlarmHandle(value: IAlarm) {
    return value?.description ? value?.description : value;
  }

  private filterFaults(value: string): IFaultLookup[] {
    const filterValue = value.toLowerCase();
    return this.faults.filter(optionValue => optionValue.description.toLowerCase().includes(filterValue));
  }

  private filterAlarms(value: string): IAlarm[] {
    const filterValue = value.toLowerCase();
    return this.faults.filter(optionValue => optionValue.description.toLowerCase().includes(filterValue));
  }
}
