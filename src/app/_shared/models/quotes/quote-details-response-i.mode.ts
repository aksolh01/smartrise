import { IEnumValue } from '../enumValue.model';

export interface IQuoteDetailsResponse {
    id?: number;
    name: string;
    creationDate?: Date;
    jobStatus?: IEnumValue;
    status?: IEnumValue;
    jobName?: string;
    contactId?: number;
    customerId?: number;
    contact?: string;
    phone?: string;
    createdByAccount?: string;
    email?: string;
    jobLocation: IQuoteJobLocationReponse;
    consultantName?: string;
    unknownConsultant: boolean;
    buildingType: string;
    modernization?: string;
    biddingDate?: Date;
    cars: ICarDetailsResponse[];
    attachments: IQuoteAttachmentDetailsResponse[];
}

export interface IQuoteJobLocationReponse {
    city: string;
    state: IEnumValue;
    country: IEnumValue;
}

export interface ICarDetailsResponse {
    id?: number;
    carIndex?: number;
    groupNumber?: number;
    controllerType?: IEnumValue;
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

    carManagementSystem: ICarManagementSystemDetailsResponse;
    carDoorFeature: ICarDoorFeatureDetailsResponse;
    additionalFeature: ICarAdditionalFeatureDetailsResponse;
    carSmartriseFeature: ICarSmartriseFeatureDetailsResponse;
    carHydraulicField: ICarHydraulicFieldDetailsResponse;
    carAdditionalC4RiserBoards: ICarAdditionalC4RiserBoardsDetailsResponse;
    carTractionField: ICarTractionFieldDetailsResponse;
    carProvision: ICarProvisionDetailsResponse;
    carSpecialField: ICarSpecialFieldDetailsResponse;
}

export interface ICarManagementSystemDetailsResponse {
    id?: number;
    lobbyMonitoring: boolean;
    v2MachineRoomMonitoringInterface: boolean;
    remoteMonitoring: boolean;
    v2LiftNetReady: boolean;
    v2BACnet: boolean;
    aiParking: boolean;
}

export interface ICarDoorFeatureDetailsResponse {
    id?: number;
    door?: string;
    doorAssume: boolean;
    rearDoorPresent: boolean;
}

export interface ICarAdditionalFeatureDetailsResponse {
    id?: number;
    enclosureLight: boolean;
    enclosureGFCI: boolean;
    fanAndFilter: boolean;
    interfaceToEmergencyPower: boolean;
    interfaceToVoiceAnnuciator: boolean;
    brownOutReset: boolean;
    interfaceToEarthquakeOperation: boolean;
}

export interface ICarSmartriseFeatureDetailsResponse {
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
    loadWeighingDeviceTraction: IEnumValue;
    enclosureLegs: boolean;
    cabinetAirConditioning: boolean;
    arcFlashProtection: boolean;
    batteryLoweringDevice: boolean;
    loadWeighingHydro: boolean;
}

export interface ICarHydraulicFieldDetailsResponse {
    id?: number;
    starter?: string;
    starterAssume: boolean;
    motorLeads?: number | string;
    motorLeadsAssume: boolean;
    ropedHydro: boolean;
    hydroEvolved: boolean;
    dualSoftStarts: boolean;
}

export interface ICarAdditionalC4RiserBoardsDetailsResponse {
    id?: number;
    hallCallSecurity: boolean;
    groupInterconnect: boolean;
    emergencyGeneratorPowersOtherGroupsSimplex: boolean;
    moreThanTwoHallNetworks: boolean;
}

export interface ICarTractionFieldDetailsResponse {
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

export interface ICarProvisionDetailsResponse {
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

export interface ICarSpecialFieldDetailsResponse {
    id?: number;
    groupRedundancy: boolean;
    crossRegistration: boolean;
    expansionBoard: boolean;
}

export interface IQuoteAttachmentDetailsResponse {
    id: number;
    originalFileName: string;
    physicalFileName: string;
    size: string;
    string1: string;
    string2: string;
}
