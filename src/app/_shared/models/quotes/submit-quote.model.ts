/* eslint-disable */
import { AutoMap } from '@nartc/automapper';
import { ISubmitQuotePayload, ISubmitCarPayload, ISubmitCarManagementSystemPayload, ISubmitCarDoorFeaturePayload, ISubmitCarAdditionalFeaturePayload, ISubmitCarSmartriseFeaturePayload, ISubmitCarHydraulicFieldPayload, ISubmitCarProvisionPayload, ISubmitCarSpecialFieldPayload, ISubmitCarTractionFieldPayload, ISubmitCarAdditionalC4RiserBoardsPayload } from './submit-quote-i.model';
import { FunctionConstants } from '../../constants';
import { ICarAdditionalC4RiserBoardsView, ICarAdditionalFeatureView, ICarDoorFeatureView, ICarHydraulicFieldView, ICarManagementSystemView, ICarProvisionView, ICarSmartriseFeatureView, ICarSpecialFieldView, ICarTractionFieldView, ICarView, IQuoteView } from './quote-view-i.model';
import { CarAdditionalC4RiserBoardsView, CarAdditionalFeatureView, CarDoorFeatureView, CarHydraulicFieldView, CarManagementSystemView, CarProvisionView, CarSmartriseFeatureView, CarSpecialFieldView, CarTractionFieldView } from './quote-view.model';

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

    static mapFromView(source: IQuoteView) {
        const m = FunctionConstants.map(source, SubmitQuotePayload,
            ['cars']) as SubmitQuotePayload;

        m.countryValue = source?.jobLocation?.country?.value;
        m.stateValue = source?.jobLocation?.state?.value;
        m.city = source?.jobLocation?.city;

        delete m['jobLocation'];
        delete m['customer'];

        m.cars = [];
        source.cars.forEach(car => {
            m.cars.push(SubmitCarPayload.mapFromView(car));
        });

        return m;
    }
}

export class SubmitCarPayload implements ISubmitCarPayload {
    static mapFromView(source: ICarView): SubmitCarPayload {
        const car = FunctionConstants.map(source, SubmitCarPayload, []) as SubmitCarPayload;

        car.additionalFeature = SubmitCarAdditionalFeaturePayload.mapFromView(source.additionalFeature);
        car.carAdditionalC4RiserBoards = SubmitCarAdditionalC4RiserBoardsPayload.mapFromView(source.carAdditionalC4RiserBoards);
        car.carDoorFeature = SubmitCarDoorFeaturePayload.mapFromView(source.carDoorFeature);
        car.carHydraulicField = SubmitCarHydraulicFieldPayload.mapFromView(source.carHydraulicField);
        car.carManagementSystem = SubmitCarManagementSystemPayload.mapFromView(source.carManagementSystem);
        car.carProvision = SubmitCarProvisionPayload.mapFromView(source.carProvision);
        car.carSmartriseFeature = SubmitCarSmartriseFeaturePayload.mapFromView(source.carSmartriseFeature);
        car.carSpecialField = SubmitCarSpecialFieldPayload.mapFromView(source.carSpecialField);
        car.carTractionField = SubmitCarTractionFieldPayload.mapFromView(source.carTractionField);

        delete car['quote'];

        return car;
    }
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
    static mapFromView(source: CarManagementSystemView): SubmitCarManagementSystemPayload {
        const dest = FunctionConstants.map(source, SubmitCarManagementSystemPayload, []) as SubmitCarManagementSystemPayload;
        delete dest['car'];
        return dest;
    }
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
    static mapFromView(source: CarDoorFeatureView): SubmitCarDoorFeaturePayload {
        const dest = FunctionConstants.map(source, SubmitCarDoorFeaturePayload, []) as SubmitCarDoorFeaturePayload;
        delete dest['car'];
        return dest;
    }
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
    static mapFromView(source: CarAdditionalFeatureView): SubmitCarAdditionalFeaturePayload {
        const dest = FunctionConstants.map(source, SubmitCarAdditionalFeaturePayload, []) as SubmitCarAdditionalFeaturePayload;
        delete dest['car'];
        return dest;
    }
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
    static mapFromView(source: CarSmartriseFeatureView): SubmitCarSmartriseFeaturePayload {
        const dest = FunctionConstants.map(source, SubmitCarSmartriseFeaturePayload, []) as SubmitCarSmartriseFeaturePayload;
        delete dest['car'];
        return dest;
    }
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
    machineRoomNemaRating?: string;
    @AutoMap()
    hoistwayNemaRating?: string;
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
    static mapFromView(source: CarHydraulicFieldView): SubmitCarHydraulicFieldPayload {
        const dest = FunctionConstants.map(source, SubmitCarHydraulicFieldPayload, []) as SubmitCarHydraulicFieldPayload;
        delete dest['car'];
        return dest;
    }
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
    static mapFromView(source: CarTractionFieldView): SubmitCarTractionFieldPayload {
        const m = FunctionConstants.map(source, SubmitCarTractionFieldPayload, []) as SubmitCarTractionFieldPayload;

        m.c4 = Boolean(source.c4);
        m.v2Traction = Boolean(source.v2Traction);
        m.mx = Boolean(source.mx);
        m.isoTransformer = Boolean(source.isoTransformer);
        m.regenKit = Boolean(source.regenKit);
        m.governorResetBox = Boolean(source.governorResetBox);
        m.lineReactor = Boolean(source.lineReactor);
        m.emirfiFilter = Boolean(source.emirfiFilter);
        m.harmonicFilter = Boolean(source.harmonicFilter);
        m.madFixtures = Boolean(source.madFixtures);
        m.newMotorProvidedBySmartrise = Boolean(source.newMotorProvidedBySmartrise);
        m.coupler = Boolean(source.coupler);
        m.encoder = Boolean(source.encoder);

        delete m['car'];
        return m;
    }
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
    static mapFromView(source: CarProvisionView): SubmitCarProvisionPayload {
        const dest = FunctionConstants.map(source, SubmitCarProvisionPayload, []) as SubmitCarProvisionPayload;
        delete dest['car'];
        return dest;
    }
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
    static mapFromView(source: CarSpecialFieldView): SubmitCarSpecialFieldPayload {
        const dest = FunctionConstants.map(source, SubmitCarSpecialFieldPayload, []) as SubmitCarSpecialFieldPayload;
        delete dest['car'];
        return dest;
    }
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
    static mapFromView(source: CarAdditionalC4RiserBoardsView): SubmitCarAdditionalC4RiserBoardsPayload {

        const dest = FunctionConstants.map(source, SubmitCarAdditionalC4RiserBoardsPayload, []) as SubmitCarAdditionalC4RiserBoardsPayload;

        dest.emergencyGeneratorPowersOtherGroupsSimplex = Boolean(source.emergencyGeneratorPowersOtherGroupsSimplex);
        dest.groupInterconnect = Boolean(source.groupInterconnect);
        dest.hallCallSecurity = Boolean(source.hallCallSecurity);
        dest.id = Number(source.id);
        dest.moreThanTwoHallNetworks = Boolean(source.moreThanTwoHallNetworks);

        delete dest['car'];
        return dest;
    }
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
