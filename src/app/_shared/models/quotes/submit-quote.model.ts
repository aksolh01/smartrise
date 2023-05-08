/* eslint-disable */
import { AutoMap } from '@nartc/automapper';
import { ISubmitQuotePayload, ISubmitCarPayload, ISubmitCarManagementSystemPayload, ISubmitCarDoorFeaturePayload, ISubmitCarAdditionalFeaturePayload, ISubmitCarSmartriseFeaturePayload, ISubmitCarHydraulicFieldPayload, ISubmitCarProvisionPayload, ISubmitCarSpecialFieldPayload, ISubmitCarTractionFieldPayload, ISubmitCarAdditionalC4RiserBoardsPayload } from './submit-quote-i.model';

export class SubmitQuotePayload implements ISubmitQuotePayload {
    @AutoMap()
    id?: number;
    @AutoMap()
    name: string;
    @AutoMap()
    creationDate?: Date;
    @AutoMap()
    jobStatus?: string;
    @AutoMap()
    status?: string;
    @AutoMap()
    jobName?: string;
    @AutoMap()
    countryValue?: string;
    @AutoMap()
    stateValue?: string;
    @AutoMap()
    city?: string;
    @AutoMap()
    contactId?: number;
    @AutoMap()
    contact?: string;
    @AutoMap()
    phone?: string;
    @AutoMap()
    email?: string;
    @AutoMap()
    consultantName?: string;
    @AutoMap()
    unknownConsultant: boolean;
    @AutoMap()
    buildingType: string;
    @AutoMap()
    modernization?: string;
    @AutoMap()
    newConstruction: boolean;
    @AutoMap()
    biddingDate?: Date;
    @AutoMap(() => SubmitCarPayload)
    cars: ISubmitCarPayload[];
    customerId: number;
}

export class SubmitCarPayload implements ISubmitCarPayload {
    @AutoMap()
    id?: number;
    @AutoMap()
    carIndex?: number;
    @AutoMap()
    groupNumber?: number;
    @AutoMap()
    controllerType?: string;
    @AutoMap()
    carLabel?: string;
    @AutoMap()
    carLabelAssume: boolean;
    @AutoMap()
    numberOfCars?: number;
    @AutoMap()
    numberOfCarsAssume: boolean;
    @AutoMap()
    displayName?: string;
    @AutoMap()
    group?: string;
    @AutoMap()
    groupAssume: boolean;
    @AutoMap()
    numberOfRisers?: number;
    @AutoMap()
    numberOfRisersAlternative?: number;
    @AutoMap()
    numberOfRisersAssume: boolean;
    @AutoMap()
    stops?: number;
    @AutoMap()
    stopsAssume: boolean;
    @AutoMap()
    openings?: number;
    @AutoMap()
    openingsAssume: boolean;
    @AutoMap()
    motorVolts?: number;
    @AutoMap()
    motorVoltsAssume: boolean;
    @AutoMap()
    speedFPM?: number;
    @AutoMap()
    speedFPMAssume: boolean;
    @AutoMap()
    capacity?: number;
    @AutoMap()
    capacityAssume: boolean;
    @AutoMap()
    mainLineVoltage?: number | string;
    @AutoMap()
    mainLineVoltageAssume: boolean;
    @AutoMap()
    motorHP?: number;
    @AutoMap()
    motorHPAssume: boolean;
    @AutoMap()
    fullLoadAmps?: number;
    @AutoMap()
    fullLoadAmpsAssume: boolean;
    @AutoMap()
    motorRPM?: number;
    @AutoMap()
    motorType?: string;
    @AutoMap()
    motorLocation?: string;
    @AutoMap()
    brandAndModel?: string;
    @AutoMap()
    motor?: string;
    @AutoMap()
    motorProvided?: string;
    @AutoMap()
    motorMounting?: string;
    @AutoMap()
    hoistwayLengthAssume: boolean;
    @AutoMap()
    motorHPWarningMessage: string;

    @AutoMap(() => SubmitCarManagementSystemPayload)
    carManagementSystem: ISubmitCarManagementSystemPayload;
    @AutoMap(() => SubmitCarDoorFeaturePayload)
    carDoorFeature: ISubmitCarDoorFeaturePayload;
    @AutoMap(() => SubmitCarAdditionalFeaturePayload)
    additionalFeature: ISubmitCarAdditionalFeaturePayload;
    @AutoMap(() => SubmitCarSmartriseFeaturePayload)
    carSmartriseFeature: ISubmitCarSmartriseFeaturePayload;
    @AutoMap(() => SubmitCarHydraulicFieldPayload)
    carHydraulicField: ISubmitCarHydraulicFieldPayload;
    @AutoMap(() => SubmitCarProvisionPayload)
    carProvision: ISubmitCarProvisionPayload;
    @AutoMap(() => SubmitCarSpecialFieldPayload)
    carSpecialField: ISubmitCarSpecialFieldPayload;
    @AutoMap(() => SubmitCarTractionFieldPayload)
    carTractionField: ISubmitCarTractionFieldPayload;
    @AutoMap(() => SubmitCarAdditionalC4RiserBoardsPayload)
    carAdditionalC4RiserBoards: ISubmitCarAdditionalC4RiserBoardsPayload;
}

export class SubmitCarManagementSystemPayload implements ISubmitCarManagementSystemPayload {
    @AutoMap()
    id?: number;
    @AutoMap()
    lobbyMonitoring: boolean;
    @AutoMap()
    v2MachineRoomMonitoringInterface: boolean;
    @AutoMap()
    remoteMonitoring: boolean;
    @AutoMap()
    v2LiftNetReady: boolean;
    @AutoMap()
    v2BACnet: boolean;
    @AutoMap()
    aiParking: boolean;
}

export class SubmitCarDoorFeaturePayload implements ISubmitCarDoorFeaturePayload {
    @AutoMap()
    id?: number;
    @AutoMap()
    door?: string;
    @AutoMap()
    doorAssume: boolean;
    @AutoMap()
    rearDoorPresent: boolean;
}

export class SubmitCarAdditionalFeaturePayload implements ISubmitCarAdditionalFeaturePayload {
    @AutoMap()
    id?: number;
    @AutoMap()
    enclosureLight: boolean;
    @AutoMap()
    enclosureGFCI: boolean;
    @AutoMap()
    fanAndFilter: boolean;
    @AutoMap()
    interfaceToEmergencyPower: boolean;
    @AutoMap()
    interfaceToVoiceAnnuciator: boolean;
    @AutoMap()
    brownOutReset: boolean;
    @AutoMap()
    interfaceToEarthquakeOperation: boolean;
}

export class SubmitCarSmartriseFeaturePayload implements ISubmitCarSmartriseFeaturePayload {
    @AutoMap()
    id?: number;
    @AutoMap()
    controllerLayout?: string;
    @AutoMap()
    smartConnect?: string;
    @AutoMap()
    dualCOP: boolean;
    @AutoMap()
    travelerCable?: string;
    @AutoMap()
    travelerLength?: number;
    @AutoMap()
    travelerLengthAssume: boolean;
    @AutoMap()
    travelerLengthInfoMessage?: string;
    @AutoMap()
    travelerLengthAssumedValue?: number;
    @AutoMap()
    hoistwayCable?: string;
    @AutoMap()
    hoistwayLength?: number;
    @AutoMap()
    hoistwayLengthAssume: boolean;
    @AutoMap()
    hoistwayLengthInfoMessage?: string;
    @AutoMap()
    hoistwayLengthAssumedValue?: number;
    @AutoMap()
    nemaRating?: string;
    @AutoMap()
    nemaLocation?: string;
    @AutoMap()
    landingSystemLengthOfTravel?: number;
    @AutoMap()
    landingSystemLengthOfTravelAssume: boolean;
    @AutoMap()
    loadWeighingDeviceTraction: string;
    @AutoMap()
    enclosureLegs: boolean;
    @AutoMap()
    cabinetAirConditioning: boolean;
    @AutoMap()
    arcFlashProtection: boolean;
    @AutoMap()
    batteryLoweringDevice: boolean;
    @AutoMap()
    loadWeighingHydro: boolean;
}

export class SubmitCarHydraulicFieldPayload implements ISubmitCarHydraulicFieldPayload {
    @AutoMap()
    id?: number;
    @AutoMap()
    starter?: string;
    @AutoMap()
    starterAssume: boolean;
    @AutoMap()
    motorLeads?: number | string;
    @AutoMap()
    motorLeadsAssume: boolean;
    @AutoMap()
    ropedHydro: boolean;
    @AutoMap()
    hydroEvolved: boolean;
    @AutoMap()
    dualSoftStarts: boolean;
    @AutoMap()
    v2: boolean;
    @AutoMap()
    v3: boolean;
}

export class SubmitCarTractionFieldPayload implements ISubmitCarTractionFieldPayload {
    @AutoMap()
    id?: number;
    @AutoMap()
    c4: boolean;
    @AutoMap()
    v2Traction: boolean;
    @AutoMap()
    mx: boolean;
    @AutoMap()
    driveModel: string;
    @AutoMap()
    motorType: string;
    @AutoMap()
    motorLocation: string;
    @AutoMap()
    batteryRescue: string;
    @AutoMap()
    isoTransformer: boolean;
    @AutoMap()
    regenKit: boolean;
    @AutoMap()
    governorResetBox: boolean;
    @AutoMap()
    lineReactor: boolean;
    @AutoMap()
    emirfiFilter: boolean;
    @AutoMap()
    harmonicFilter: boolean;
    @AutoMap()
    madFixtures: boolean;
    @AutoMap()
    newMotorProvidedBySmartrise: boolean;
    @AutoMap()
    motorProvider: string;
    @AutoMap()
    motorMount: string;
    @AutoMap()
    motorRPM?: number;
    @AutoMap()
    coupler: boolean;
    @AutoMap()
    encoder: boolean;
}

export class SubmitCarProvisionPayload implements ISubmitCarProvisionPayload {
    @AutoMap()
    id?: number;
    @AutoMap()
    v2V3HallCallSecurityCat5: boolean;
    @AutoMap()
    carCallSecurity: boolean;
    @AutoMap()
    patientSecurity: boolean;
    @AutoMap()
    sabbathOperation: boolean;
    @AutoMap()
    interfaceToDestinationDispatch: boolean;
    @AutoMap()
    hallArrivalLanterns: boolean;
    @AutoMap()
    vipService?: string;
    @AutoMap()
    interfaceToLobbyPanel: boolean;
    @AutoMap()
    hospitalService: boolean;
    @AutoMap()
    emtService: boolean;
}

export class SubmitCarSpecialFieldPayload implements ISubmitCarSpecialFieldPayload {
    @AutoMap()
    id?: number;
    @AutoMap()
    groupRedundancy: boolean;
    @AutoMap()
    crossRegistration: boolean;
    @AutoMap()
    expansionBoard: boolean;
}

export class SubmitCarAdditionalC4RiserBoardsPayload implements ISubmitCarAdditionalC4RiserBoardsPayload {
    @AutoMap()
    id?: number;
    @AutoMap()
    hallCallSecurity: boolean;
    @AutoMap()
    groupInterconnect: boolean;
    @AutoMap()
    emergencyGeneratorPowersOtherGroupsSimplex: boolean;
    @AutoMap()
    moreThanTwoHallNetworks: boolean;
}
