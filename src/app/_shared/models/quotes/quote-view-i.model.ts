import { AutoMap } from "@nartc/automapper";
import { IEnumValueView } from "../enumValue.model";

export interface IQuoteView {
    id?: number;
    name: string;
    creationDate?: Date;
    jobStatus?: string;
    status?: string;
    jobName?: string;
    contactId?: number;
    contact?: string;
    phone?: string;
    email?: string;
    customer: IQuoteCustomerView;
    jobLocation?: IJobLocationView;
    consultantName?: string;
    consultantNameAvailable: boolean;
    unknownConsultant: boolean;
    buildingType: string;
    newConstruction: boolean;
    modernization?: string;
    biddingDate?: Date;
    biddingDateAvailable: boolean;
    hideTraction: boolean;
    hideHydraulic: boolean;
    hideC4RiserBoards: boolean;
    cars: ICarView[];
    isCanadaOntario(): boolean;
}

export interface IQuoteCustomerView {
    id: number;
    name: string;
}

export interface IJobLocationView {
    country?: IEnumValueView;
    state?: IEnumValueView;
    city?: string;
}

export interface ICarView {
    isMainLineVoltageEmpty(): boolean;
    ref?: string;
    id?: number;
    carIndex?: number;
    groupNumber?: number;
    controllerType?: string;
    carLabel?: string;
    carLabelAssume: boolean;
    numberOfCars?: number;
    numberOfCarsAssume: boolean;
    displayName?: string;
    group?: string;
    groupAssume: boolean;
    numberOfRisers?: number;
    numberOfRisersAlternative?: number;
    numberOfRisersAssume: boolean;
    stops?: number;
    stopsAssume: boolean;
    openings?: number;
    openingsAssume: boolean;
    motorVolts?: number | string;
    motorVoltsAssume: boolean;
    motorVoltsAssumable: boolean;
    motorVoltsAssumedValue?: number;
    motorVoltsInfoMessage: string;
    speedFPM?: number;
    speedFPMAssume: boolean;
    speedFPMAssumable: boolean;
    speedFPMAssumedValue: number;
    capacity?: number;
    capacityAssume: boolean;
    capacityAssumable: boolean;
    capacityAssumedValue: number;
    mainLineVoltage?: number | string;
    mainLineVoltageAssume: boolean;
    motorHP?: number;
    motorHPAssume: boolean;
    motorHPAssumable: boolean;
    motorHPAssumedValue?: number;
    fullLoadAmps?: number;
    fullLoadAmpsAssume: boolean;
    fullLoadAmpsAssumedValue?: number;
    fullLoadAmpsAssumable: boolean;
    brandAndModel?: string;
    motor?: string;
    motorProvided?: string;
    motorMounting?: string;
    hoistwayLengthAssume: boolean;
    motorHPWarningMessage: string;

    carManagementSystem: ICarManagementSystemView;
    carDoorFeature: ICarDoorFeatureView;
    additionalFeature: ICarAdditionalFeatureView;
    carSmartriseFeature: ICarSmartriseFeatureView;
    carHydraulicField: ICarHydraulicFieldView;
    carTractionField: ICarTractionFieldView;
    carProvision: ICarProvisionView;
    carAdditionalC4RiserBoards: ICarAdditionalC4RiserBoardsView;
    carSpecialField: ICarSpecialFieldView;

    quote: IQuoteView;
    errors?: any;

    hasControllerType(): boolean;
    isTraction(): boolean;
    isACTraction(): boolean;
    isDCTraction(): boolean;
    isHydraulic(): boolean;
    isSimplex(): boolean;
    hasGroup(): boolean;

    unAssumeFullLoadAmps();
    unAssumeMotorVolts();
    unAssumeMotorHP();
    isCapacityOrSpeedEmpty(): boolean;
    isCapacityOrSpeedOrMainLineVoltageEmpty(): boolean;
    isMotorHPOrMotorVoltsEmpty(): boolean;
}

export interface ICarManagementSystemView {
    id?: number;
    lobbyMonitoring: boolean;
    v2MachineRoomMonitoringInterface: boolean;
    v2MachineRoomMonitoringInterfaceAvailable: boolean;
    remoteMonitoring: boolean;
    v2LiftNetReady: boolean;
    v2BACnet: boolean;
    aiParking: boolean;
    aiParkingAvailable: boolean;
    car: ICarView;
}

export interface ICarDoorFeatureView {
    id?: number;
    door?: string;
    doorAssume: boolean;
    rearDoorPresent: boolean;
    car: ICarView;
}

export interface ICarAdditionalFeatureView {
    id?: number;
    enclosureLight: boolean;
    enclosureGFCI: boolean;
    fanAndFilter: boolean;
    interfaceToEmergencyPower: boolean;
    interfaceToVoiceAnnuciator: boolean;
    brownOutReset: boolean;
    interfaceToEarthquakeOperation: boolean;
    car: ICarView;
}

export interface ICarSmartriseFeatureView {
    id?: number;
    controllerLayout?: string;
    smartConnect?: string;
    dualCOP: boolean;
    travelerCable?: string;
    travelerCableAvailable: boolean;
    travelerLength?: number;
    travelerLengthAssume: boolean;
    travelerLengthInfoMessage?: string;
    travelerLengthAssumedValue?: number;
    hoistwayCable?: string;
    hoistwayCableAvailable: boolean;
    hoistwayLength?: number;
    hoistwayLengthAssume: boolean;
    hoistwayLengthInfoMessage?: string;
    hoistwayLengthAssumedValue?: number;
    machineRoomNemaRating?: string;
    hoistwayNemaRating?: string;
    landingSystemLengthOfTravel?: number;
    landingSystemLengthOfTravelAssume: boolean;
    landingSystemLengthOfTravelInfoMessage?: string;
    landingSystemLengthOfTravelAssumedValue?: number;
    enclosureLegs: boolean;
    cabinetAirConditioning: boolean;
    arcFlashProtection: boolean;
    batteryLoweringDevice: boolean;
    loadWeighingHydro: boolean;
    loadWeighingDeviceTraction: string;
    loadWeighingDeviceTractionAvailable: boolean;
    landingSystemLengthOfTravelIsRequired: boolean;
    nemaLocationIsRequired: boolean;
    hoistwayLengthIsRequired: boolean;
    car: ICarView;

    travelerCables: IEnumValueView[];
    hoistwayCables: IEnumValueView[];
    hoistwayCableExistsInHoistwayCablesDatasource(): boolean;
    travelerCableExistsInTravelerCablesDatasource(): boolean;
}

export class ICarHydraulicFieldView {
    id?: number;
    starter?: string;
    starterAssume: boolean;
    motorLeads?: number | string;
    motorLeadsAssume: boolean;
    ropedHydro: boolean;
    dualSoftStarts: boolean;
    hydroEvolved: boolean;
    hydroEvolvedAvailable: boolean;
    hide: boolean;
    car: ICarView;
    v2: boolean;
    v2Available: boolean;
    v3: boolean;
    v3Available: boolean;
}

export interface ICarTractionFieldView {
    id: number;
    c4: boolean;
    c4Available: boolean;
    v2Traction: boolean;
    v2Available: boolean;
    mx: boolean;
    mxAvailable: boolean;
    driveModel: string;
    motorType: string;
    motorLocation: string;
    batteryRescue: string;
    isoTransformer: boolean;
    isoTransformerAvailable: boolean;
    regenKit: boolean;
    governorResetBox: boolean;
    lineReactor: boolean;
    emirfiFilter: boolean;
    harmonicFilter: boolean;
    madFixtures: boolean;
    madFixturesAvailable: boolean;
    newMotorProvidedBySmartrise: boolean;
    motorProvider: string;
    motorProviderAvailable: boolean;
    motorMount: string;
    motorMountAvailable: boolean;
    motorRPM?: number;
    motorRPMAvailable: boolean;
    coupler: boolean;
    couplerAvailable: boolean;
    encoder: boolean;
    encoderAvailable: boolean;
    car: ICarView;
    hide: boolean;
    driveModels: IEnumValueView[];
    isGearless(): boolean;
    isGeared(): boolean;
    isOverhead(): boolean;
    isOverheadOrBasement(): boolean;
    isBasement(): boolean;
    isMRL(): boolean;
    hasMotorType(): boolean;
    hasMotorLocation(): boolean;
    isMotorLocationOrMotorTypeEmpty(): boolean;
    isV2Traction(): boolean;
}

export interface ICarProvisionView {
    id?: number;
    v2V3HallCallSecurityCat5: boolean;
    v2V3HallCallSecurityCat5Available: boolean;
    carCallSecurity: boolean;
    patientSecurity: boolean;
    sabbathOperation: boolean;
    interfaceToDestinationDispatch: boolean;
    hallArrivalLanterns: boolean;
    vipService?: string;
    interfaceToLobbyPanel: boolean;
    hospitalService: boolean;
    emtService: boolean;
    hallCallSecurityGroupOnlyIsClickable: boolean;
    interfaceToDestinationDispatchIsClickable: boolean;
    car: ICarView;
}

export interface ICarSpecialFieldView {
    id?: number;
    groupRedundancy: boolean;
    crossRegistration: boolean;
    expansionBoard: boolean;
    groupRedundancyIsClickable: boolean;
    car: ICarView;
}

export interface IQuoteAttachmentView {
    id: number;
    originalFileName: string;
    physicalFileName: string;
    size: string;
    string1: string;
    string2: string;
}

export interface ICarAdditionalC4RiserBoardsView {
    id?: number;
    hallCallSecurity: boolean;
    groupInterconnect: boolean;
    emergencyGeneratorPowersOtherGroupsSimplex: boolean;
    moreThanTwoHallNetworks: boolean;
    hide: boolean;
    car: ICarView;
}
