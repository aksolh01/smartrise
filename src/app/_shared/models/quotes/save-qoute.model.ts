/* eslint-disable */
import { AutoMap } from '@nartc/automapper';
import { ISaveQuotePayload, ISaveCarPayload, ISaveCarManagementSystemPayload, ISaveCarDoorFeaturePayload, ISaveCarAdditionalFeaturePayload, ISaveCarSmartriseFeaturePayload, ISaveCarHydraulicFieldPayload, ISaveCarProvisionPayload, ISaveCarSpecialFieldPayload, ISaveCarTractionFieldPayload, ISaveCarAdditionalC4RiserBoardsPayload } from './save-quote-i.model';
import { CarAdditionalC4RiserBoardsView, CarAdditionalFeatureView, CarDoorFeatureView, CarHydraulicFieldView, CarManagementSystemView, CarProvisionView, CarSmartriseFeatureView, CarSpecialFieldView, CarTractionFieldView, CarView, QuoteView } from './quote-view.model';
import { FunctionConstants } from '../../constants';
import { ICarAdditionalC4RiserBoardsView, ICarAdditionalFeatureView, ICarDoorFeatureView, ICarHydraulicFieldView, ICarManagementSystemView, ICarProvisionView, ICarSmartriseFeatureView, ICarSpecialFieldView, ICarTractionFieldView, ICarView, IQuoteView } from './quote-view-i.model';

export class SaveQuotePayload implements ISaveQuotePayload {
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
    newConstruction: boolean;
    @AutoMap()
    modernization?: string;
    @AutoMap()
    biddingDate?: Date;
    @AutoMap(() => SaveCarPayload)
    cars: ISaveCarPayload[];
    customerId: number;

    static mapFromView(source: IQuoteView) {
        const m = FunctionConstants.map(source, SaveQuotePayload,
            ['cars']) as SaveQuotePayload;

        delete m['customer'];
        delete m['jobLocation'];

        m.countryValue = source?.jobLocation?.country?.value;
        m.stateValue = source?.jobLocation?.state?.value;
        m.city = source?.jobLocation?.city;

        m.cars = [];
        source.cars.forEach(car => {
            m.cars.push(SaveCarPayload.mapFromView(car));
        });

        return m;
    }
}

export class SaveCarPayload implements ISaveCarPayload {

    static mapFromView(source: CarView): SaveCarPayload {
        const car = FunctionConstants.map(source, SaveCarPayload, []) as SaveCarPayload;

        delete car['quote'];

        car.additionalFeature = SaveCarAdditionalFeaturePayload.mapFromView(source.additionalFeature);
        car.carAdditionalC4RiserBoards = SaveCarAdditionalC4RiserBoardsPayload.mapFromView(source.carAdditionalC4RiserBoards);
        car.carDoorFeature = SaveCarDoorFeaturePayload.mapFromView(source.carDoorFeature);
        car.carHydraulicField = SaveCarHydraulicFieldPayload.mapFromView(source.carHydraulicField);
        car.carManagementSystem = SaveCarManagementSystemPayload.mapFromView(source.carManagementSystem);
        car.carProvision = SaveCarProvisionPayload.mapFromView(source.carProvision);
        car.carSmartriseFeature = SaveCarSmartriseFeaturePayload.mapFromView(source.carSmartriseFeature);
        car.carSpecialField = SaveCarSpecialFieldPayload.mapFromView(source.carSpecialField);
        car.carTractionField = SaveCarTractionFieldPayload.mapFromView(source.carTractionField);

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

    @AutoMap(() => SaveCarManagementSystemPayload)
    carManagementSystem: ISaveCarManagementSystemPayload;
    @AutoMap(() => SaveCarDoorFeaturePayload)
    carDoorFeature: ISaveCarDoorFeaturePayload;
    @AutoMap(() => SaveCarAdditionalFeaturePayload)
    additionalFeature: ISaveCarAdditionalFeaturePayload;
    @AutoMap(() => SaveCarSmartriseFeaturePayload)
    carSmartriseFeature: ISaveCarSmartriseFeaturePayload;
    @AutoMap(() => SaveCarHydraulicFieldPayload)
    carHydraulicField: ISaveCarHydraulicFieldPayload;
    @AutoMap(() => SaveCarProvisionPayload)
    carProvision: ISaveCarProvisionPayload;
    @AutoMap(() => SaveCarSpecialFieldPayload)
    carSpecialField: ISaveCarSpecialFieldPayload;
    @AutoMap(() => SaveCarTractionFieldPayload)
    carTractionField: ISaveCarTractionFieldPayload;
    @AutoMap(() => SaveCarAdditionalC4RiserBoardsPayload)
    carAdditionalC4RiserBoards: ISaveCarAdditionalC4RiserBoardsPayload;
}

export class SaveCarManagementSystemPayload implements ISaveCarManagementSystemPayload {
    static mapFromView(source: CarManagementSystemView): SaveCarManagementSystemPayload {
        const dest = FunctionConstants.map(source, SaveCarManagementSystemPayload, []) as SaveCarManagementSystemPayload;
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

export class SaveCarDoorFeaturePayload implements ISaveCarDoorFeaturePayload {
    static mapFromView(source: CarDoorFeatureView): SaveCarDoorFeaturePayload {
        const dest = FunctionConstants.map(source, SaveCarDoorFeaturePayload, []) as SaveCarDoorFeaturePayload;
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

export class SaveCarAdditionalFeaturePayload implements ISaveCarAdditionalFeaturePayload {
    static mapFromView(source: CarAdditionalFeatureView): SaveCarAdditionalFeaturePayload {
        const additionalFeature = FunctionConstants.map(source, SaveCarAdditionalFeaturePayload, []) as SaveCarAdditionalFeaturePayload;
        delete additionalFeature['car'];
        return additionalFeature;
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

export class SaveCarSmartriseFeaturePayload implements ISaveCarSmartriseFeaturePayload {
    static mapFromView(source: CarSmartriseFeatureView): SaveCarSmartriseFeaturePayload {
        const dest = FunctionConstants.map(source, SaveCarSmartriseFeaturePayload, []) as SaveCarSmartriseFeaturePayload;
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

export class SaveCarHydraulicFieldPayload implements ISaveCarHydraulicFieldPayload {
    static mapFromView(source: CarHydraulicFieldView): SaveCarHydraulicFieldPayload {
        const dest = FunctionConstants.map(source, SaveCarHydraulicFieldPayload, []) as SaveCarHydraulicFieldPayload;
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

export class SaveCarTractionFieldPayload implements ISaveCarTractionFieldPayload {
    static mapFromView(source: CarTractionFieldView): SaveCarTractionFieldPayload {
        const dest = FunctionConstants.map(source, SaveCarTractionFieldPayload, []) as SaveCarTractionFieldPayload;

        dest.c4 = Boolean(source.c4);
        dest.v2Traction = Boolean(source.v2Traction);
        dest.mx = Boolean(source.mx);
        dest.isoTransformer = Boolean(source.isoTransformer);
        dest.regenKit = Boolean(source.regenKit);
        dest.governorResetBox = Boolean(source.governorResetBox);
        dest.lineReactor = Boolean(source.lineReactor);
        dest.emirfiFilter = Boolean(source.emirfiFilter);
        dest.harmonicFilter = Boolean(source.harmonicFilter);
        dest.madFixtures = Boolean(source.madFixtures);
        dest.newMotorProvidedBySmartrise = Boolean(source.newMotorProvidedBySmartrise);
        dest.coupler = Boolean(source.coupler);
        dest.encoder = Boolean(source.encoder);

        delete dest['car'];

        return dest;
    }

    @AutoMap()
    id?: number;
    @AutoMap()
    c4 = false;
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

export class SaveCarProvisionPayload implements ISaveCarProvisionPayload {
    static mapFromView(source: CarProvisionView): SaveCarProvisionPayload {
        const dest = FunctionConstants.map(source, SaveCarProvisionPayload, []) as SaveCarProvisionPayload;
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

export class SaveCarSpecialFieldPayload implements ISaveCarSpecialFieldPayload {
    static mapFromView(source: CarSpecialFieldView): SaveCarSpecialFieldPayload {
        const dest = FunctionConstants.map(source, SaveCarSpecialFieldPayload, []) as SaveCarSpecialFieldPayload;
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


export class SaveCarAdditionalC4RiserBoardsPayload implements ISaveCarAdditionalC4RiserBoardsPayload {
    static mapFromView(source: CarAdditionalC4RiserBoardsView): SaveCarAdditionalC4RiserBoardsPayload {

        const dest = FunctionConstants.map(source, SaveCarAdditionalC4RiserBoardsPayload, []) as SaveCarAdditionalC4RiserBoardsPayload;

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
