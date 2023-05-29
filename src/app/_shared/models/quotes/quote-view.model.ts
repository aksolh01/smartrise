import { AutoMap } from "@nartc/automapper";
import { EnumValueView, IEnumValueView } from "../enumValue.model";
import { IQuoteView, ICarView, ICarManagementSystemView, ICarDoorFeatureView, ICarAdditionalFeatureView, ICarSmartriseFeatureView, ICarHydraulicFieldView, ICarProvisionView, ICarSpecialFieldView, IJobLocationView, IQuoteAttachmentView, ICarTractionFieldView, ICarAdditionalC4RiserBoardsView, IQuoteCustomerView } from "./quote-view-i.model";
import { CarAdditionalC4RiserBoardsResponse, CarAdditionalFeatureResponse, CarDoorFeatureResponse, CarHydraulicFieldResponse, CarManagementSystemResponse, CarProvisionResponse, CarResponse, CarSmartriseFeatureResponse, CarSpecialFieldResponse, CarTractionFieldResponse, JobLocationReponse, QuoteCustomerResponse, QuoteResponse } from "./quote-response.model";
import { FunctionConstants } from "../../constants";
import { ICarAdditionalC4RiserBoardsResponse, ICarAdditionalFeatureResponse, ICarDoorFeatureResponse, ICarHydraulicFieldResponse, ICarManagementSystemResponse, ICarProvisionResponse, ICarResponse, ICarSmartriseFeatureResponse, ICarSpecialFieldResponse, ICarTractionFieldResponse, IQuoteCustomerResponse, IQuoteResponse } from "./quote-response-i.model";

export class QuoteView implements IQuoteView {
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
    contactId?: number;
    @AutoMap()
    contact?: string;
    @AutoMap(() => QuoteCustomerView)
    customer: IQuoteCustomerView;
    @AutoMap()
    phone?: string;
    @AutoMap()
    email?: string;
    @AutoMap(() => JobLocationView)
    jobLocation?: IJobLocationView;
    @AutoMap()
    consultantName?: string;
    @AutoMap()
    unknownConsultant: boolean;
    @AutoMap()
    buildingType: string;
    @AutoMap()
    newConstruction: boolean;
    consultantNameAvailable: boolean;
    @AutoMap()
    modernization?: string;
    @AutoMap()
    biddingDate?: Date;
    biddingDateAvailable: boolean;
    @AutoMap(() => CarView)
    cars: ICarView[];
    @AutoMap(() => QuoteAttachmentView)
    attachments: IQuoteAttachmentView[];
    hideTraction: boolean;
    hideHydraulic: boolean;
    hideC4RiserBoards: boolean;
    isCanadaOntario(): boolean {
        return this.jobLocation?.country?.value === 'Canada' && this.jobLocation?.state?.value === 'Ontario';
    }

    static mapFromResponse(source: IQuoteResponse): QuoteView {
        const m = FunctionConstants.map(source, QuoteView,
            ['cars', 'customer', 'attachments', 'jobLocation']) as QuoteView;

        m.customer = QuoteCustomerView.mapFromResponse(source.customer);
        m.jobLocation = JobLocationView.mapFromResponse(source.jobLocation);
        m.cars = [];
        source.cars.forEach(car => {
            m.cars.push(CarView.mapFromResponse(car));
        });

        return m;
    }
}

export class QuoteCustomerView implements IQuoteCustomerView {
    @AutoMap()
    id: number;
    @AutoMap()
    name: string;

    static mapFromResponse(source: QuoteCustomerResponse): QuoteCustomerView {
        return FunctionConstants.map(source, QuoteCustomerView, []);
    }
}

export class JobLocationView implements IJobLocationView {

    static mapFromResponse(source: JobLocationReponse): JobLocationView {
        return FunctionConstants.map(source, JobLocationView, []);
    }

    constructor(props?: Partial<JobLocationView>) {
        if (props) {
            Object.assign(this, props);
            if (props.country) {
                this.country = new EnumValueView(props.country);
            }
            if (props.state) {
                this.state = new EnumValueView(props.state);
            }
        }
    }

    @AutoMap(() => EnumValueView)
    country?: IEnumValueView;
    @AutoMap(() => EnumValueView)
    state?: IEnumValueView;
    @AutoMap()
    city?: string;

    get displayLocation(): string {
        if (this.country?.description && this.state?.description && this.city) {
            return `${this.city}, ${this.state?.description}, ${this.country?.description}`;
        }
        return null;
    }

    set displayLocation(value: string) {
    }
}

export class CarView implements ICarView {

    static mapFromResponse(source: CarResponse): CarView {
        const car = FunctionConstants.map(source, CarView, []) as CarView;

        car.additionalFeature = CarAdditionalFeatureView.mapFromResponse(source.additionalFeature);
        car.carAdditionalC4RiserBoards = CarAdditionalC4RiserBoardsView.mapFromResponse(source.carAdditionalC4RiserBoards);
        car.carDoorFeature = CarDoorFeatureView.mapFromResponse(source.carDoorFeature);
        car.carHydraulicField = CarHydraulicFieldView.mapFromResponse(source.carHydraulicField);
        car.carManagementSystem = CarManagementSystemView.mapFromResponse(source.carManagementSystem);
        car.carProvision = CarProvisionView.mapFromResponse(source.carProvision);
        car.carSmartriseFeature = CarSmartriseFeatureView.mapFromResponse(source.carSmartriseFeature);
        car.carSpecialField = CarSpecialFieldView.mapFromResponse(source.carSpecialField);
        car.carTractionField = CarTractionFieldView.mapFromResponse(source.carTractionField);
        return car;
    }

    ref?: string;
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
    motorVolts?: number | string;
    motorVoltsAssumedValue?: number;
    motorVoltsAssumable: boolean;
    motorVoltsInfoMessage: string;
    @AutoMap()
    motorVoltsAssume: boolean;
    @AutoMap()
    speedFPM?: number;
    @AutoMap()
    speedFPMAssume: boolean;
    speedFPMAssumable: boolean;
    speedFPMAssumedValue: number;
    @AutoMap()
    capacity?: number;
    @AutoMap()
    capacityAssume: boolean;
    capacityAssumable: boolean;
    capacityAssumedValue: number;
    @AutoMap()
    mainLineVoltage?: number | string;
    @AutoMap()
    mainLineVoltageAssume: boolean;
    @AutoMap()
    motorHP?: number;
    @AutoMap()
    motorHPAssume: boolean;
    motorHPAssumable: boolean;
    motorHPAssumedValue?: number;
    @AutoMap()
    fullLoadAmps?: number;
    @AutoMap()
    fullLoadAmpsAssume: boolean;
    fullLoadAmpsAssumedValue?: number;
    fullLoadAmpsAssumable: boolean;
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
    @AutoMap(() => CarManagementSystemView)
    carManagementSystem: ICarManagementSystemView;
    @AutoMap(() => CarDoorFeatureView)
    carDoorFeature: ICarDoorFeatureView;
    @AutoMap(() => CarAdditionalFeatureView)
    additionalFeature: ICarAdditionalFeatureView;
    @AutoMap(() => CarSmartriseFeatureView)
    carSmartriseFeature: ICarSmartriseFeatureView;
    @AutoMap(() => CarHydraulicFieldView)
    carHydraulicField: ICarHydraulicFieldView;
    @AutoMap(() => CarTractionFieldView)
    carTractionField: ICarTractionFieldView;
    @AutoMap(() => CarProvisionView)
    carProvision: ICarProvisionView;
    @AutoMap(() => CarSpecialFieldView)
    carSpecialField: ICarSpecialFieldView;
    @AutoMap(() => CarAdditionalC4RiserBoardsView)
    carAdditionalC4RiserBoards: ICarAdditionalC4RiserBoardsView;

    quote: IQuoteView;
    errors?: any;

    isTraction(): boolean {
        return this.isACTraction() || this.isDCTraction();
    }

    isACTraction(): boolean {
        return this.controllerType === 'ACTraction';
    }

    isDCTraction(): boolean {
        return this.controllerType === 'DCTraction';
    }

    isHydraulic(): boolean {
        return this.controllerType === 'Hydraulic';
    }
    hasControllerType(): boolean {
        return this.controllerType ? true : false;
    }
    unAssumeFullLoadAmps() {
        this.fullLoadAmpsAssume = false;
    }
    unAssumeMotorVolts() {
        this.motorVoltsAssume = false;
    }
    isCapacityOrSpeedEmpty(): boolean {
        return !this.speedFPM || !this.capacity;
    }
    isCapacityOrSpeedOrMainLineVoltageEmpty(): boolean {
        return !this.speedFPM || !this.capacity || !this.mainLineVoltage;
    }
    isMainLineVoltageEmpty(): boolean {
        return !this.mainLineVoltage;
    }
    isMotorHPOrMotorVoltsEmpty(): boolean {
        return !this.motorHP || !this.motorVolts;
    }
    isSimplex(): boolean {
        return this.group === 'Simplex';
    }
    hasGroup(): boolean {
        return this.group ? true : false;
    }
    unAssumeMotorHP() {
        this.motorHPAssume = false;
    }
}

export class CarManagementSystemView implements ICarManagementSystemView {
    static mapFromResponse(source: CarManagementSystemResponse): CarManagementSystemView {
        return FunctionConstants.map(source, CarManagementSystemView, []) as CarManagementSystemView;
    }
    car: ICarView;
    @AutoMap()
    id?: number;
    @AutoMap()
    lobbyMonitoring: boolean;
    @AutoMap()
    v2MachineRoomMonitoringInterface: boolean;
    v2MachineRoomMonitoringInterfaceAvailable: boolean;
    @AutoMap()
    remoteMonitoring: boolean;
    @AutoMap()
    v2LiftNetReady: boolean;
    @AutoMap()
    v2BACnet: boolean;
    @AutoMap()
    aiParking: boolean;
    aiParkingAvailable: boolean;
}

export class CarDoorFeatureView implements ICarDoorFeatureView {
    static mapFromResponse(source: CarDoorFeatureResponse): CarDoorFeatureView {
        return FunctionConstants.map(source, CarDoorFeatureView, []) as CarDoorFeatureView;
    }
    car: ICarView;
    @AutoMap()
    id?: number;
    @AutoMap()
    door?: string;
    @AutoMap()
    doorAssume: boolean;
    @AutoMap()
    rearDoorPresent: boolean;
}

export class CarAdditionalFeatureView implements ICarAdditionalFeatureView {
    static mapFromResponse(source: CarAdditionalFeatureResponse): CarAdditionalFeatureView {
        return FunctionConstants.map(source, CarAdditionalFeatureView, []) as CarAdditionalFeatureView;
    }
    car: ICarView;
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

export class CarSmartriseFeatureView implements ICarSmartriseFeatureView {
    static mapFromResponse(source: CarSmartriseFeatureResponse): CarSmartriseFeatureView {
        return FunctionConstants.map(source, CarSmartriseFeatureView, []) as CarSmartriseFeatureView;
    }
    landingSystemLengthOfTravelIsRequired: boolean;
    nemaLocationIsRequired: boolean;
    hoistwayLengthIsRequired: boolean;
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
    travelerCableAvailable: boolean;
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
    hoistwayCableAvailable: boolean;
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
    landingSystemLengthOfTravelInfoMessage?: string;
    landingSystemLengthOfTravelAssumedValue?: number;
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
    @AutoMap()
    loadWeighingDeviceTraction: string;
    loadWeighingDeviceTractionAvailable: boolean;
    car: ICarView;

    travelerCables: IEnumValueView[];
    hoistwayCables: IEnumValueView[];

    hoistwayCableExistsInHoistwayCablesDatasource(): boolean {
        return this.hoistwayCables.map(c => c.value).indexOf(this.hoistwayCable) > -1;
    }
    travelerCableExistsInTravelerCablesDatasource(): boolean {
        return this.travelerCables.map(c => c.value).indexOf(this.travelerCable) > -1;
    }
}

export class CarHydraulicFieldView implements ICarHydraulicFieldView {
    static mapFromResponse(source: CarHydraulicFieldResponse): CarHydraulicFieldView {
        return FunctionConstants.map(source, CarHydraulicFieldView, []) as CarHydraulicFieldView;
    }
    hide: boolean;
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
    dualSoftStarts: boolean;
    @AutoMap()
    hydroEvolved: boolean;
    hydroEvolvedAvailable: boolean;
    car: ICarView;
    @AutoMap()
    v2: boolean;
    v2Available: boolean;
    @AutoMap()
    v3: boolean;
    v3Available: boolean;
}

export class CarTractionFieldView implements ICarTractionFieldView {
    static mapFromResponse(source: CarTractionFieldResponse): CarTractionFieldView {
        return FunctionConstants.map(source, CarTractionFieldView, []) as CarTractionFieldView;
    }

    motorProviderAvailable: boolean;
    motorMountAvailable: boolean;
    motorRPMAvailable: boolean;
    couplerAvailable: boolean;
    encoderAvailable: boolean;

    hide: boolean;
    @AutoMap()
    id: number;
    driveModels: IEnumValueView[];
    c4Available: boolean;
    v2Available: boolean;
    mxAvailable: boolean;
    madFixturesAvailable: boolean;
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
    isoTransformerAvailable: boolean;
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
    car: ICarView;
    isGearless(): boolean {
        return this.motorType === 'Gearless';
    }
    isGeared(): boolean {
        return this.motorType === 'Geared';
    }
    isOverheadOrBasement(): boolean {
        return this.isOverhead() || this.isBasement();
    }
    isMRL(): boolean {
        return this.motorLocation === 'MachineRoomLess';
    }
    isOverhead(): boolean {
        return this.motorLocation === 'Overhead';
    }
    isV2Traction(): boolean {
        return this.v2Traction;
    }
    isBasement(): boolean {
        return this.motorLocation === 'Basement';
    }
    hasMotorType(): boolean {
        return this.motorType ? true : false;
    }
    hasMotorLocation(): boolean {
        return this.motorLocation ? true : false;
    }
    isMotorLocationOrMotorTypeEmpty(): boolean {
        return !this.hasMotorLocation() || !this.hasMotorType();
    }
}

export class CarProvisionView implements ICarProvisionView {
    static mapFromResponse(source: CarProvisionResponse): CarProvisionView {
        return FunctionConstants.map(source, CarProvisionView, []) as CarProvisionView;
    }
    v2V3HallCallSecurityCat5Available: boolean;
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
    hallCallSecurityGroupOnlyIsClickable: boolean;
    interfaceToDestinationDispatchIsClickable: boolean;
    car: ICarView;
}

export class CarSpecialFieldView implements ICarSpecialFieldView {
    static mapFromResponse(source: CarSpecialFieldResponse): ICarSpecialFieldView {
        return FunctionConstants.map(source, CarSpecialFieldView, []) as CarSpecialFieldView;
    }
    car: ICarView;
    groupRedundancyIsClickable: boolean;
    @AutoMap()
    id?: number;
    @AutoMap()
    groupRedundancy: boolean;
    @AutoMap()
    crossRegistration: boolean;
    @AutoMap()
    expansionBoard: boolean;
}

export class QuoteAttachmentView implements IQuoteAttachmentView {
    @AutoMap()
    id: number;
    @AutoMap()
    originalFileName: string;
    @AutoMap()
    physicalFileName: string;
    @AutoMap()
    size: string;
    @AutoMap()
    string1: string;
    @AutoMap()
    string2: string;
}

export class CarAdditionalC4RiserBoardsView implements ICarAdditionalC4RiserBoardsView {
    static mapFromResponse(source: CarAdditionalC4RiserBoardsResponse): CarAdditionalC4RiserBoardsView {
        return FunctionConstants.map(source, CarAdditionalC4RiserBoardsView, []) as CarAdditionalC4RiserBoardsView;
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
    hide: boolean;
    car: ICarView;
}
