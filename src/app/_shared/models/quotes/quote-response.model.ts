import { AutoMap } from "@nartc/automapper";
import { EnumValueResponse, IEnumValueResponse } from "../enumValue.model";
import { IQuoteResponse, ICarResponse, ICarManagementSystemResponse, ICarDoorFeatureResponse, ICarAdditionalFeatureResponse, ICarSmartriseFeatureResponse, ICarHydraulicFieldResponse, ICarProvisionResponse, ICarSpecialFieldResponse, IQuoteAttachmentResponse, ICarTractionFieldResponse, IJobLocationReponse, ICarAdditionalC4RiserBoardsResponse, IQuoteCustomerResponse } from "./quote-response-i.model";

export class QuoteResponse implements IQuoteResponse {

    constructor(props?: Partial<QuoteResponse>) {
        if (props) {
            Object.assign(this, props);
        }

        if (props?.jobLocation) {
            this.jobLocation = new JobLocationReponse(props.jobLocation);
        }

        if (props?.customer) {
            this.customer = new QuoteCustomerResponse(props.customer);
        }

        if (props?.cars) {
            this.cars = props.cars.map(car => new CarResponse(car));
        }

        if (props?.attachments) {
          this.attachments = props.attachments.map(attachment => new QuoteAttachmentResponse(attachment));
        }
    }


    @AutoMap()
    id?: number;
    @AutoMap(() => QuoteCustomerResponse)
    customer: IQuoteCustomerResponse;
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
    @AutoMap(() => JobLocationReponse)
    jobLocation: IJobLocationReponse;
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
    @AutoMap(() => CarResponse)
    cars: ICarResponse[];
    @AutoMap(() => QuoteAttachmentResponse)
    attachments: IQuoteAttachmentResponse[];
}

export class QuoteCustomerResponse implements IQuoteCustomerResponse {

    constructor(props?: Partial<QuoteCustomerResponse>) {
        if (props) {
            Object.assign(this, props);
        }
    }

    @AutoMap()
    id: number;
    @AutoMap()
    name: string;
}

export class JobLocationReponse implements IJobLocationReponse {

    constructor(props?: Partial<JobLocationReponse>) {
        if (props) {
            Object.assign(this, props);
            if (props.country) {
                this.country = new EnumValueResponse(props?.country);
            }
            if (props.state) {
                this.state = new EnumValueResponse(props?.state);
            }
        }
    }

    @AutoMap(() => EnumValueResponse)
    country?: IEnumValueResponse;
    @AutoMap(() => EnumValueResponse)
    state?: IEnumValueResponse;
    @AutoMap()
    city?: string;
}

export class CarResponse implements ICarResponse {

    constructor(props?: Partial<CarResponse>) {
        if (props) {
            Object.assign(this, props);
        }

        this.carDoorFeature = new CarDoorFeatureResponse(props?.carDoorFeature);
        this.carHydraulicField = new CarHydraulicFieldResponse(props?.carHydraulicField);
        this.carTractionField = new CarTractionFieldReponse(props?.carTractionField);
        this.carManagementSystem = new CarManagementSystemResponse(props?.carManagementSystem);
        this.carProvision = new CarProvisionResponse(props?.carProvision);
        this.carSpecialField = new CarSpecialFieldResponse(props?.carSpecialField);
        this.additionalFeature = new CarAdditionalFeatureResponse(props?.additionalFeature);
        this.carSmartriseFeature = new CarSmartriseFeatureResponse(props?.carSmartriseFeature);
        this.carAdditionalC4RiserBoards = new CarAdditionalC4RiserBoardsResponse(props?.carAdditionalC4RiserBoards);
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

    @AutoMap(() => CarManagementSystemResponse)
    carManagementSystem: ICarManagementSystemResponse;

    @AutoMap(() => CarDoorFeatureResponse)
    carDoorFeature: ICarDoorFeatureResponse;

    @AutoMap(() => CarAdditionalFeatureResponse)
    additionalFeature: ICarAdditionalFeatureResponse;

    @AutoMap(() => CarSmartriseFeatureResponse)
    carSmartriseFeature: ICarSmartriseFeatureResponse;

    @AutoMap(() => CarHydraulicFieldResponse)
    carHydraulicField: ICarHydraulicFieldResponse;

    @AutoMap(() => CarTractionFieldReponse)
    carTractionField: ICarTractionFieldResponse;

    @AutoMap(() => CarProvisionResponse)
    carProvision: ICarProvisionResponse;

    @AutoMap(() => CarSpecialFieldResponse)
    carSpecialField: ICarSpecialFieldResponse;

    @AutoMap(() => CarAdditionalC4RiserBoardsResponse)
    carAdditionalC4RiserBoards: ICarAdditionalC4RiserBoardsResponse;
}

export class CarManagementSystemResponse implements ICarManagementSystemResponse {

    constructor(props?: Partial<CarManagementSystemResponse>) {
        if (props) {
            Object.assign(this, props);
        }
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

export class CarDoorFeatureResponse implements ICarDoorFeatureResponse {

    constructor(props?: Partial<CarDoorFeatureResponse>) {
        if (props) {
            Object.assign(this, props);
        }
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

export class CarAdditionalFeatureResponse implements ICarAdditionalFeatureResponse {

    constructor(props?: Partial<CarAdditionalFeatureResponse>) {
        if (props) {
            Object.assign(this, props);
        }
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

export class CarSmartriseFeatureResponse implements ICarSmartriseFeatureResponse {

    constructor(props?: Partial<CarSmartriseFeatureResponse>) {
        if (props) {
            Object.assign(this, props);
        }
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
    loadWeighingDeviceTraction: string;
    @AutoMap()
    nemaRating?: string;
    @AutoMap()
    nemaLocation?: string;
    @AutoMap()
    landingSystemLengthOfTravel?: number;
    @AutoMap()
    landingSystemLengthOfTravelAssume: boolean;
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

export class CarHydraulicFieldResponse implements ICarHydraulicFieldResponse {

    constructor(props?: Partial<CarHydraulicFieldResponse>) {
        if (props) {
            Object.assign(this, props);
        }
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
    dualSoftStarts: boolean;
    @AutoMap()
    hydroEvolved: boolean;
}

export class CarTractionFieldReponse implements ICarTractionFieldResponse {

    constructor(props?: Partial<CarTractionFieldReponse>) {
        if (props) {
            Object.assign(this, props);
        }
    }

    @AutoMap()
    id: number;
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

export class CarProvisionResponse implements ICarProvisionResponse {

    constructor(props?: Partial<CarProvisionResponse>) {
        if (props) {
            Object.assign(this, props);
        }
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

export class CarSpecialFieldResponse implements ICarSpecialFieldResponse {

    constructor(props?: Partial<CarSpecialFieldResponse>) {
        if (props) {
            Object.assign(this, props);
        }
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

export class QuoteAttachmentResponse implements IQuoteAttachmentResponse {

    constructor(props?: Partial<QuoteAttachmentResponse>) {
        if (props) {
            Object.assign(this, props);
        }
    }

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

export class CarAdditionalC4RiserBoardsResponse implements ICarAdditionalC4RiserBoardsResponse {
    constructor(props?: Partial<CarAdditionalC4RiserBoardsResponse>) {
        if (props) {
            Object.assign(this, props);
        }
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
