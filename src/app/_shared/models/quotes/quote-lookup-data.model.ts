import { HWBasementMachineChart, HorsePowerRatingForOverheadTraction, HWVVVFHoistMotorDataHPVoltsAndAmps, HWVVVFHoistMotorDataHPVoltsAndAmps575V, OverheadChartHPTraction, TDI200MiniGearless1stSection, TDI200MiniGearlessOtherSections } from './matricies-data.model';
import { IQuoteLookupDataView } from './quote-lookup-data-i.model';
import { ICarView } from './quote-view-i.model';

export class QuoteLookupDataView implements IQuoteLookupDataView {
    defaultCar: ICarView;
    motorProviders: any[];
    motorMounts: any[];
    acTractionDriveModels: any[];
    dcTractionDriveModels: any[];
    hydroTravelerCables: any[];
    c4HoistwayCables: any[];
    controllerTypes: any[];
    motorLocations: any[];
    motorTypes: any[];
    batteryRescues: any[];
    customerContacts: any[] = [];
    numberOfRisers: any[];
    mainLineVoltages: any[];
    starters: any[];
    motorLeads: any[];
    doors: any[];
    controllerLayouts: any[];
    smartConnects: any[];
    c4TravelerCables: any[];
    hydroHoistwayCables: any[];
    nemaRatings: any[];
    nemaLocations: any[];
    jobStatuses: any[];
    groups: any[];
    numberOfRisersAlternatives: any[];
    countries: any[];
    loadWeighingDeviceTractionDataSource: any[];
    buildingTypes: any[];

    horsePowerRatingForOverheadTraction = new HorsePowerRatingForOverheadTraction();
    overheadHPChart = new OverheadChartHPTraction();
    basementHPChart = new HWBasementMachineChart();
    tdi200MiniGearless1stSection = new TDI200MiniGearless1stSection();
    tdi200MiniGearlessOtherSections = new TDI200MiniGearlessOtherSections();
    hwVVVFHoistMotorDataHPVoltsAndAmps575V = new HWVVVFHoistMotorDataHPVoltsAndAmps575V();
    hwVVVFHoistMotorDataHPVoltsAndAmps = new HWVVVFHoistMotorDataHPVoltsAndAmps();

    getAssumedHPFromHorsePowerRatingForOverheadTraction(capacity: number, speed: number): number {
        return this.horsePowerRatingForOverheadTraction.getHP(capacity, speed);
    }
    getAssumedHPFromOverheadHPChart(capacity: number, speed: number): number {
        return this.overheadHPChart.getHP(capacity, speed);
    }
    getAssumedHPFromBasementHPChart(capacity: number, speed: number): number {
        return this.basementHPChart.getHP(capacity, speed);
    }
    getAssumedHPFromTDI200MiniGearless1stSection(capacity: number, speed: number): number {
        return this.tdi200MiniGearless1stSection.getHP(capacity, speed);
    }
    getAssumedHPFromTDI200MiniGearlessOtherSections(capacity: number, speed: number, mainLineVoltage: number): number {
        return this.tdi200MiniGearlessOtherSections.getMotorHP(capacity, speed, mainLineVoltage);
    }
    getAssumedMotorFLAFromHWVVVFHoistMotorDataHPVoltsAndAmps575V(motorHP: number, motorVolts: number): number {
        return this.hwVVVFHoistMotorDataHPVoltsAndAmps575V.getFLA(motorHP, motorVolts);
    }
    getAssumedMotorFLAFromHWVVVFHoistMotorDataHPVoltsAndAmps(motorHP: number, motorVolts: number, motorRPM: number): number {
        return this.hwVVVFHoistMotorDataHPVoltsAndAmps.getFLA(motorHP, motorVolts, motorRPM);
    }
    getAssumedMotorFLAFromTDI200MiniGearlessOtherSections(capacity: number, speed: number, mainLineVoltage: number): number {
        return this.tdi200MiniGearlessOtherSections.getFLA(capacity, speed, mainLineVoltage);
    }
    getAssumedMotorFLAFromTDI200MiniGearless1stSection(capacity: number, speed: number): number {
        return this.tdi200MiniGearless1stSection.getFLA(capacity, speed);
    }
    getAssumedMotorVoltsFromTDI200MiniGearlessOtherSections(capacity: number, speed: number, mainLineVoltage: number): number {
        return this.tdi200MiniGearlessOtherSections.getMotorVolts(capacity, speed, mainLineVoltage);
    }
    getAssumedMotorVoltsFromTDI200MiniGearless1stSection(capacity: number, speed: number): number {
        return this.tdi200MiniGearless1stSection.getMotorVolts(capacity, speed);
    }
}
