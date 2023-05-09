import { IEnumValueResponse } from '../enumValue.model';

export interface IQuoteResponse {
    id?: number;
    customer: IQuoteCustomerResponse;
    name: string;
    creationDate?: Date;
    jobStatus?: string;
    status?: string;
    jobName?: string;
    contactId?: number;
    contact?: string;
    phone?: string;
    email?: string;
    jobLocation: IJobLocationReponse;
    consultantName?: string;
    unknownConsultant: boolean;
    buildingType: string;
    newConstruction: boolean;
    modernization?: string;
    biddingDate?: Date;
    cars: ICarResponse[];
    attachments: IQuoteAttachmentResponse[];
}

export interface IQuoteCustomerResponse {
    id: number;
    name: string;
}

export interface IJobLocationReponse {
    country?: IEnumValueResponse;
    state?: IEnumValueResponse;
    city?: string;
}

export interface ICarResponse {
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
    motorVolts?: number;
    motorVoltsAssume: boolean;
    speedFPM?: number;
    speedFPMAssume: boolean;
    capacity?: number;
    capacityAssume: boolean;
    mainLineVoltage?: number | string;
    mainLineVoltageAssume: boolean;
    motorHP?: number;
    motorHPAssume: boolean;
    fullLoadAmps?: number;
    fullLoadAmpsAssume: boolean;
    motorRPM?: number;
    motorType?: string;
    motorLocation?: string;
    brandAndModel?: string;
    motor?: string;
    motorProvided?: string;
    motorMounting?: string;
    hoistwayLengthAssume: boolean;
    motorHPWarningMessage: string;

    carManagementSystem: ICarManagementSystemResponse;
    carDoorFeature: ICarDoorFeatureResponse;
    additionalFeature: ICarAdditionalFeatureResponse;
    carSmartriseFeature: ICarSmartriseFeatureResponse;
    carHydraulicField: ICarHydraulicFieldResponse;
    carTractionField: ICarTractionFieldResponse;
    carProvision: ICarProvisionResponse;
    carSpecialField: ICarSpecialFieldResponse;
    carAdditionalC4RiserBoards: ICarAdditionalC4RiserBoardsResponse;
}

export interface ICarManagementSystemResponse {
    id?: number;
    lobbyMonitoring: boolean;
    v2MachineRoomMonitoringInterface: boolean;
    remoteMonitoring: boolean;
    v2LiftNetReady: boolean;
    v2BACnet: boolean;
    aiParking: boolean;
}

export interface ICarDoorFeatureResponse {
    id?: number;
    door?: string;
    doorAssume: boolean;
    rearDoorPresent: boolean;
}

export interface ICarAdditionalFeatureResponse {
    id?: number;
    enclosureLight: boolean;
    enclosureGFCI: boolean;
    fanAndFilter: boolean;
    interfaceToEmergencyPower: boolean;
    interfaceToVoiceAnnuciator: boolean;
    brownOutReset: boolean;
    interfaceToEarthquakeOperation: boolean;
}

export interface ICarSmartriseFeatureResponse {
    id?: number;
    controllerLayout?: string;
    smartConnect?: string;
    dualCOP: boolean;
    travelerCable?: string;
    travelerLength?: number;
    travelerLengthAssume: boolean;
    travelerLengthInfoMessage?: string;
    travelerLengthAssumedValue?: number;
    hoistwayCable?: string;
    hoistwayLength?: number;
    hoistwayLengthAssume: boolean;
    hoistwayLengthInfoMessage?: string;
    hoistwayLengthAssumedValue?: number;
    nemaRating?: string;
    nemaLocation?: string;
    landingSystemLengthOfTravel?: number;
    landingSystemLengthOfTravelAssume: boolean;
    loadWeighingDeviceTraction: string;
    enclosureLegs: boolean;
    cabinetAirConditioning: boolean;
    arcFlashProtection: boolean;
    batteryLoweringDevice: boolean;
    loadWeighingHydro: boolean;
}

export interface ICarHydraulicFieldResponse {
    id?: number;
    starter?: string;
    starterAssume: boolean;
    motorLeads?: number | string;
    motorLeadsAssume: boolean;
    ropedHydro: boolean;
    dualSoftStarts: boolean;
    hydroEvolved: boolean;
    v2: boolean;
    v3: boolean;
}

export interface ICarTractionFieldResponse {
    id: number;
    c4: boolean;
    v2Traction: boolean;
    mx: boolean;
    driveModel: string;
    motorType: string;
    motorLocation: string;
    batteryRescue: string;
    isoTransformer: boolean;
    regenKit: boolean;
    governorResetBox: boolean;
    lineReactor: boolean;
    emirfiFilter: boolean;
    harmonicFilter: boolean;
    madFixtures: boolean;
    newMotorProvidedBySmartrise: boolean;
    motorProvider: string;
    motorMount: string;
    motorRPM?: number;
    coupler: boolean;
    encoder: boolean;
}

export interface ICarProvisionResponse {
    id?: number;
    v2V3HallCallSecurityCat5: boolean;
    carCallSecurity: boolean;
    patientSecurity: boolean;
    sabbathOperation: boolean;
    interfaceToDestinationDispatch: boolean;
    hallArrivalLanterns: boolean;
    vipService?: string;
    interfaceToLobbyPanel: boolean;
    hospitalService: boolean;
    emtService: boolean;
}

export interface ICarSpecialFieldResponse {
    id?: number;
    groupRedundancy: boolean;
    crossRegistration: boolean;
    expansionBoard: boolean;
}

export interface IQuoteAttachmentResponse {
    id: number;
    originalFileName: string;
    physicalFileName: string;
    size: string;
    string1: string;
    string2: string;
}

export interface ICarAdditionalC4RiserBoardsResponse {
    id?: number;
    hallCallSecurity: boolean;
    groupInterconnect: boolean;
    emergencyGeneratorPowersOtherGroupsSimplex: boolean;
    moreThanTwoHallNetworks: boolean;
}
