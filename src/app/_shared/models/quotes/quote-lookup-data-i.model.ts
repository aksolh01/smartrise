import { ICarView } from './quote-view-i.model';

export interface IQuoteLookupDataView {
    defaultCar: ICarView;
    hydroTravelerCables: any[];
    c4TravelerCables: any[];
    hydroHoistwayCables: any[];
    c4HoistwayCables: any[];
    customerContacts: any[];
    numberOfRisers: any[];
    mainLineVoltages: any[];
    starters: any[];
    doors: any[];
    controllerLayouts: any[];
    smartConnects: any[];
    nemaRatings: any[];
    nemaLocations: any[];
    jobStatuses: any[];
    groups: any[];
    numberOfRisersAlternatives: any[];
    countries: any[];
    controllerTypes: any[];
    motorLeads: any[];
    motorLocations: any[];
    motorTypes: any[];
    motorMounts: any[];
    motorProviders: any[];
    acTractionDriveModels: any[];
    dcTractionDriveModels: any[];
    batteryRescues: any[];
    buildingTypes: any[];
    loadWeighingDeviceTractionDataSource: any[];
    getAssumedHPFromHorsePowerRatingForOverheadTraction(capacity: number, speed: number): number;
    getAssumedHPFromOverheadHPChart(capacity: number, speed: number): number;
    getAssumedHPFromBasementHPChart(capacity: number, speed: number): number;
    getAssumedHPFromTDI200MiniGearless1stSection(capacity: number, speed: number): number;
    getAssumedHPFromTDI200MiniGearlessOtherSections(capacity: number, speed: number, mainLineVoltage: number): number;
    getAssumedMotorFLAFromHWVVVFHoistMotorDataHPVoltsAndAmps575V(motorHP: number, motorVolts: number): number;
    getAssumedMotorFLAFromHWVVVFHoistMotorDataHPVoltsAndAmps(motorHP: number, motorVolts: number, motorRPM: number): number;
    getAssumedMotorFLAFromTDI200MiniGearlessOtherSections(capacity: number, speed: number, mainLineVoltage: number): number;
    getAssumedMotorFLAFromTDI200MiniGearless1stSection(capacity: number, speed: number): number;
    getAssumedMotorVoltsFromTDI200MiniGearlessOtherSections(capacity: number, speed: number, mainLineVoltage: number): number;
    getAssumedMotorVoltsFromTDI200MiniGearless1stSection(capacity: number, speed: number): number;
}
