export interface ISubmitQuotePayload {
    id?: number;
    name: string;
    creationDate?: Date;
    jobStatus?: string;
    status?: string;
    jobName?: string;
    countryValue?: string;
    stateValue?: string;
    city?: string;
    contactId?: number;
    contact?: string;
    phone?: string;
    email?: string;
    consultantName?: string;
    buildingType: string;
    unknownConsultant: boolean;
    newConstruction: boolean;
    modernization?: string;
    biddingDate?: Date;
    cars: ISubmitCarPayload[];
}

export interface ISubmitCarPayload {
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

    carManagementSystem: ISubmitCarManagementSystemPayload;
    carDoorFeature: ISubmitCarDoorFeaturePayload;
    additionalFeature: ISubmitCarAdditionalFeaturePayload;
    carSmartriseFeature: ISubmitCarSmartriseFeaturePayload;
    carHydraulicField: ISubmitCarHydraulicFieldPayload;
    carProvision: ISubmitCarProvisionPayload;
    carSpecialField: ISubmitCarSpecialFieldPayload;
    carTractionField: ISubmitCarTractionFieldPayload;
    carAdditionalC4RiserBoards: ISubmitCarAdditionalC4RiserBoardsPayload;
}

export interface ISubmitCarManagementSystemPayload {
    id?: number;
    lobbyMonitoring: boolean;
    v2MachineRoomMonitoringInterface: boolean;
    remoteMonitoring: boolean;
    v2LiftNetReady: boolean;
    v2BACnet: boolean;
    aiParking: boolean;
}

export interface ISubmitCarDoorFeaturePayload {
    id?: number;
    door?: string;
    doorAssume: boolean;
    rearDoorPresent: boolean;
}

export interface ISubmitCarAdditionalFeaturePayload {
    id?: number;
    enclosureLight: boolean;
    enclosureGFCI: boolean;
    fanAndFilter: boolean;
    interfaceToEmergencyPower: boolean;
    interfaceToVoiceAnnuciator: boolean;
    brownOutReset: boolean;
    interfaceToEarthquakeOperation: boolean;
}

export interface ISubmitCarSmartriseFeaturePayload {
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

export interface ISubmitCarHydraulicFieldPayload {
    id?: number;
    starter?: string;
    starterAssume: boolean;
    motorLeads?: number | string;
    motorLeadsAssume: boolean;
    ropedHydro: boolean;
    hydroEvolved: boolean;
    dualSoftStarts: boolean;
}

export interface ISubmitCarTractionFieldPayload {
    id?: number;
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

export interface ISubmitCarProvisionPayload {
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

export interface ISubmitCarSpecialFieldPayload {
    id?: number;
    groupRedundancy: boolean;
    crossRegistration: boolean;
    expansionBoard: boolean;
}

export interface ISubmitCarAdditionalC4RiserBoardsPayload {
    id?: number;
    hallCallSecurity: boolean;
    groupInterconnect: boolean;
    emergencyGeneratorPowersOtherGroupsSimplex: boolean;
    moreThanTwoHallNetworks: boolean;
}
