
export interface ISaveQuotePayload {
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
    unknownConsultant: boolean;
    buildingType: string;
    newConstruction: boolean;
    modernization?: string;
    biddingDate?: Date;
    cars: ISaveCarPayload[];
}

export interface ISaveCarPayload {
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

    carManagementSystem: ISaveCarManagementSystemPayload;
    carDoorFeature: ISaveCarDoorFeaturePayload;
    additionalFeature: ISaveCarAdditionalFeaturePayload;
    carSmartriseFeature: ISaveCarSmartriseFeaturePayload;
    carHydraulicField: ISaveCarHydraulicFieldPayload;
    carProvision: ISaveCarProvisionPayload;
    carSpecialField: ISaveCarSpecialFieldPayload;
    carTractionField: ISaveCarTractionFieldPayload;
    carAdditionalC4RiserBoards: ISaveCarAdditionalC4RiserBoardsPayload;
}

export interface ISaveCarManagementSystemPayload {
    id?: number;
    lobbyMonitoring: boolean;
    v2MachineRoomMonitoringInterface: boolean;
    remoteMonitoring: boolean;
    v2LiftNetReady: boolean;
    v2BACnet: boolean;
    aiParking: boolean;
}

export interface ISaveCarDoorFeaturePayload {
    id?: number;
    door?: string;
    doorAssume: boolean;
    rearDoorPresent: boolean;
}

export interface ISaveCarAdditionalFeaturePayload {
    id?: number;
    enclosureLight: boolean;
    enclosureGFCI: boolean;
    fanAndFilter: boolean;
    interfaceToEmergencyPower: boolean;
    interfaceToVoiceAnnuciator: boolean;
    brownOutReset: boolean;
    interfaceToEarthquakeOperation: boolean;
}

export interface ISaveCarSmartriseFeaturePayload {
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
    machineRoomNemaRating?: string;
    hoistwayNemaRating?: string;
    landingSystemLengthOfTravel?: number;
    landingSystemLengthOfTravelAssume: boolean;
    loadWeighingDeviceTraction: string;
    enclosureLegs: boolean;
    cabinetAirConditioning: boolean;
    arcFlashProtection: boolean;
    batteryLoweringDevice: boolean;
    loadWeighingHydro: boolean;
}

export interface ISaveCarHydraulicFieldPayload {
    id?: number;
    starter?: string;
    starterAssume: boolean;
    motorLeads?: number | string;
    motorLeadsAssume: boolean;
    ropedHydro: boolean;
    hydroEvolved: boolean;
    dualSoftStarts: boolean;
    v2: boolean;
    v3: boolean;
}

export interface ISaveCarTractionFieldPayload {
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

export interface ISaveCarProvisionPayload {
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

export interface ISaveCarSpecialFieldPayload {
    id?: number;
    groupRedundancy: boolean;
    crossRegistration: boolean;
    expansionBoard: boolean;
}

export interface ISaveCarAdditionalC4RiserBoardsPayload {
    id?: number;
    hallCallSecurity: boolean;
    groupInterconnect: boolean;
    emergencyGeneratorPowersOtherGroupsSimplex: boolean;
    moreThanTwoHallNetworks: boolean;
}
