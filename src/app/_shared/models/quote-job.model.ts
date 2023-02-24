import { IEnumValue, IEnumValueView, ITextValue } from './enumValue.model';

export interface ICreateJobQuote {
    id?: number;
    name: string;
    creationDate?: Date;
    neededPriceBy?: Date;
    jobStatus?: string;
    status?: string;
    jobName?: string;
    jobLocation?: string;
    contactId?: number;
    contact?: string;
    phone?: string;
    email?: string;
    consultantName?: string;
    unknownConsultant: boolean;
    modernization?: string;
    biddingDate?: Date;
}

export interface IJobQuote {
    id?: number;
    name: string;
    creationDate?: Date;
    jobStatus?: string;
    status?: string;
    jobName?: string;
    jobLocation?: string;
    countryValue?: string;
    stateValue?: string;
    city?: string;
    contactId?: number;
    contact?: string;
    phone?: string;
    email?: string;
    consultantName?: string;
    unknownConsultant: boolean;
    modernization?: string;
    biddingDate?: Date;
    cars: ICar[];
    attachments: any[];
}

export interface ICar {

    ref: string;
    id?: number;
    carIndex?: number;
    groupNumber?: number;
    controllerType?: string;
    carLabel?: string;
    carLabelAssume?: boolean;
    numberOfCars?: number;
    numberOfCarsAssume?: boolean;
    displayName?: string;
    group?: string;
    groupAssume?: boolean;
    numberOfRisers?: number;
    numberOfRisersAlternative?: number;
    numberOfRisersAssume?: boolean;
    stops?: number;
    stopsAssume?: boolean;
    openings?: number;
    openingsAssume?: boolean;
    motorVolts?: number;
    motorVoltsAssume?: boolean;
    speedFPM?: number;
    speedFPMAssume?: boolean;
    capacity?: number;
    capacityAssume?: boolean;
    mainLineVoltage?: number | string;
    mainLineVoltageAssume?: boolean;
    motorHP?: number;
    motorHPAssume?: boolean;
    fullLoadAmps?: number;
    fullLoadAmpsAssume?: boolean;
    motorRPM?: number;
    motorType?: string;
    motorLocation?: string;
    brandAndModel?: string;
    motor?: string;
    motorProvided?: string;
    motorMounting?: string;
    hoistwayLengthAssume?: boolean;
    motorHPWarningMessage: string;

    carManagementSystem: ICarManagementSystem;
    carDoorFeature: ICarDoorFeature;
    additionalFeature: ICarAdditionalFeature;
    carSmartriseFeature: ICarSmartriseFeature;
    carHydraulicField: ICarHydraulicField;
    carProvision: ICarProvision;
    carSpecialField: ICarSpecialField;

    errors?: any;
}

export interface ICarManagementSystem {
    id?: number;
    lobbyMonitoring?: boolean;
    v2MachineRoomMonitoringInterface?: boolean;
    remoteMonitoring?: boolean;
    v2LiftNetReady?: boolean;
    v2BACnet?: boolean;
    aiParking?: boolean;
}

export interface ICarDoorFeature {
    id?: number;
    door?: string;
    doorAssume?: boolean;
    rearDoorPresent?: boolean;
}

export interface ICarAdditionalFeature {
    id?: number;
    enclosureLight?: boolean;
    enclosureGFCI?: boolean;
    fanAndFilter?: boolean;
    interfaceToEmergencyPower?: boolean;
    interfaceToVoiceAnnuciator?: boolean;
    brownOutReset?: boolean;
    interfaceToEarthquakeOperation?: boolean;
}

export interface ICarSmartriseFeature {
    id?: number;
    controllerLayout?: string;
    smartConnect?: string;
    dualCOP?: boolean;
    travelerCable?: string;
    travelerLength?: number;
    travelerLengthAssume?: boolean;
    travelerLengthInfoMessage?: string;
    travelerLengthAssumedValue?: number;
    hoistwayCable?: string;
    hoistwayLength?: number;
    hoistwayLengthAssume?: boolean;
    hoistwayLengthInfoMessage?: string;
    hoistwayLengthAssumedValue?: number;
    nemaRating?: string;
    nemaLocation?: string;
    landingSystemLengthOfTravel?: number;
    landingSystemLengthOfTravelInfoMessage?: string;
    landingSystemLengthOfTravelAssume?: boolean;
    landingSystemLengthOfTravelAssumedValue?: number;
    enclosureLegs?: boolean;
    cabinetAirConditioning?: boolean;
    arcFlashProtection?: boolean;
    batteryLoweringDevice?: boolean;
    loadWeighingHydro?: boolean;
}

export class ICarHydraulicField {
    id?: number;
    starter?: string;
    starterAssume?: boolean;
    motorLeads?: number | string;
    motorLeadsAssume?: boolean;
    ropedHydro?: boolean;
    dualSoftStarts?: boolean;
}

export interface ICarProvision {
    id?: number;
    v2v3HallCallSecurityCat5?: boolean;
    carCallSecurity?: boolean;
    patientSecurity?: boolean;
    sabbathOperation?: boolean;
    interfaceToDestinationDispatch?: boolean;
    hallArrivalLanterns?: boolean;
    vipService?: string;
    interfaceToLobbyPanel?: boolean;
    hospitalService?: boolean;
    emtService?: boolean;
}

export interface ICarSpecialField {
    id?: number;
    groupRedundancy?: boolean;
    crossRegistration?: boolean;
    expansionBoard?: boolean;
}

export interface IQuoteEnums {
    defaultCar: any;
    tractionTravelerCables: IEnumValue[];
    hydroTravelerCables: IEnumValue[];
    jobStatus: IEnumValue[];
    groups: IEnumValue[];
    quoteStatuses: IEnumValue[];
    starters: IEnumValue[];
    smartConnects: IEnumValue[];
    tractionHoistwayCables: IEnumValue[];
    hydroHoistwayCables: IEnumValue[];
    nemaRatings: IEnumValue[];
    nemaLocations: IEnumValue[];
    loadWeighingDeviceTractions: IEnumValue[];
    controllerLayouts: IEnumValue[];
    doors: IEnumValue[];
    motorProviders: any[];
    motorLeads: ITextValue[];
    motorTypes: IEnumValue[];
    motorMounts: IEnumValue[];
    motorLocations: IEnumValue[];
    batteryRescues: IEnumValue[];
    mainLineVoltages: ITextValue[];
    numberOfRisers: ITextValue[];
    numberOfRisersAlternatives: ITextValue[];
    countries: ITextValue[];
    buildingTypes: ITextValue[];
    controllerTypes: IEnumValue[];
    acTractionDriveModels: IEnumValue[];
    dcTractionDriveModels: IEnumValue[];
}
