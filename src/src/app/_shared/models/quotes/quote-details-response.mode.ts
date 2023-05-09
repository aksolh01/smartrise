/* eslint-disable */
import { AutoMap } from '@nartc/automapper';
import { EnumValueResponse, IEnumValue, IEnumValueResponse } from '../enumValue.model';
import { ICarDetailsResponse, IQuoteAttachmentDetailsResponse, ICarManagementSystemDetailsResponse, ICarDoorFeatureDetailsResponse, ICarAdditionalFeatureDetailsResponse, ICarSmartriseFeatureDetailsResponse, ICarHydraulicFieldDetailsResponse, ICarProvisionDetailsResponse, ICarSpecialFieldDetailsResponse, IQuoteDetailsResponse, IQuoteJobLocationReponse, ICarTractionFieldDetailsResponse, ICarAdditionalC4RiserBoardsDetailsResponse } from './quote-details-response-i.mode';

export class QuoteDetailsResponse implements IQuoteDetailsResponse {

    constructor(props?: Partial<QuoteDetailsResponse>) {
        if(props) {
            Object.assign(this, props);
        }
        if (props?.cars) {
            const cars: CarDetailsResponse[] = [];
            props?.cars.forEach(car => {
                cars.push(new CarDetailsResponse(car));
            });
            this.cars = cars;
        }
        if(props?.jobStatus) {
            this.jobStatus = new EnumValueResponse(props.jobStatus);
        }
        if(props?.status) {
            this.status = new EnumValueResponse(props.status);
        }
        if(props?.jobLocation) {
            this.jobLocation = new QuoteJobLocationResponse(props?.jobLocation);
        }
    }

    @AutoMap()
    id?: number;
    @AutoMap()
    name: string;
    createdByAccount: string;
    @AutoMap()
    creationDate?: Date;
    @AutoMap()
    jobStatus?: IEnumValueResponse;
    @AutoMap()
    status?: IEnumValueResponse;
    @AutoMap()
    jobName?: string;
    @AutoMap()
    contactId?: number;
    customerId?: number;
    @AutoMap()
    contact?: string;
    @AutoMap()
    phone?: string;
    @AutoMap()
    email?: string;
    @AutoMap(() => QuoteJobLocationResponse)
    jobLocation: IQuoteJobLocationReponse;
    @AutoMap()
    consultantName?: string;
    @AutoMap()
    unknownConsultant: boolean;
    @AutoMap()
    buildingType: string;
    @AutoMap()
    modernization?: string;
    @AutoMap()
    biddingDate?: Date;
    @AutoMap()
    cars: ICarDetailsResponse[];
    @AutoMap()
    attachments: IQuoteAttachmentDetailsResponse[];
}

export class QuoteJobLocationResponse implements IQuoteJobLocationReponse {

    constructor(props: Partial<QuoteJobLocationResponse>) {
        Object.assign(this, props);
    }

    @AutoMap()
    city: string;
    @AutoMap()
    state: IEnumValue;
    @AutoMap()
    country: IEnumValue;

    get displayLocation(): string {
        if (this.country?.description && this.state?.description && this.city) {
            return `${this.city}, ${this.state?.description}, ${this.country?.description}`;
        }
        return null;
    }
}

export class CarDetailsResponse implements ICarDetailsResponse {

    constructor(props?: Partial<CarDetailsResponse>) {
        if(props) {
            Object.assign(this, props);
        }
        this.carDoorFeature = new CarDoorFeatureDetailsResponse(props.carDoorFeature);
        this.carHydraulicField = new CarHydraulicFieldDetailsResponse(props.carHydraulicField);
        this.carTractionField = new CarTractionFieldDetailsResponse(props.carTractionField);
        this.carManagementSystem = new CarManagementSystemDetailsResponse(props.carManagementSystem);
        this.carProvision = new CarProvisionDetailsResponse(props.carProvision);
        this.carSmartriseFeature = new CarSmartriseFeatureDetailsResponse(props.carSmartriseFeature);
        this.carSpecialField = new CarSpecialFieldDetailsResponse(props.carSpecialField);
        this.additionalFeature = new CarAdditionalFeatureDetailsResponse(props.additionalFeature);
    }

    @AutoMap()
    id?: number;
    @AutoMap()
    carIndex?: number;
    @AutoMap()
    groupNumber?: number;
    @AutoMap()
    controllerType?: IEnumValue;
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

    @AutoMap(() => CarManagementSystemDetailsResponse)
    carManagementSystem: ICarManagementSystemDetailsResponse;
    @AutoMap(() => CarDoorFeatureDetailsResponse)
    carDoorFeature: ICarDoorFeatureDetailsResponse;
    @AutoMap(() => CarAdditionalFeatureDetailsResponse)
    additionalFeature: ICarAdditionalFeatureDetailsResponse;
    @AutoMap(() => CarSmartriseFeatureDetailsResponse)
    carSmartriseFeature: ICarSmartriseFeatureDetailsResponse;
    @AutoMap(() => CarHydraulicFieldDetailsResponse)
    carHydraulicField: ICarHydraulicFieldDetailsResponse;
    @AutoMap(() => CarTractionFieldDetailsResponse)
    carTractionField: ICarTractionFieldDetailsResponse;
    @AutoMap(() => CarProvisionDetailsResponse)
    carProvision: ICarProvisionDetailsResponse;
    @AutoMap(() => CarSpecialFieldDetailsResponse)
    carSpecialField: ICarSpecialFieldDetailsResponse;
    @AutoMap(() => CarAdditionalC4RiserBoardsDetailsResponse)
    carAdditionalC4RiserBoards: ICarAdditionalC4RiserBoardsDetailsResponse;
}

export class CarManagementSystemDetailsResponse implements ICarManagementSystemDetailsResponse {

    constructor(props?: Partial<CarManagementSystemDetailsResponse>) {
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

export class CarDoorFeatureDetailsResponse implements ICarDoorFeatureDetailsResponse {

    constructor(props?: Partial<CarDoorFeatureDetailsResponse>) {
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

export class CarAdditionalFeatureDetailsResponse implements ICarAdditionalFeatureDetailsResponse {

    constructor(props?: Partial<CarAdditionalFeatureDetailsResponse>) {
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

export class CarSmartriseFeatureDetailsResponse implements ICarSmartriseFeatureDetailsResponse {

    constructor(props?: Partial<CarSmartriseFeatureDetailsResponse>) {
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
    @AutoMap()
    loadWeighingDeviceTraction: IEnumValue;
}

export class CarHydraulicFieldDetailsResponse implements ICarHydraulicFieldDetailsResponse {

    constructor(props?: Partial<CarHydraulicFieldDetailsResponse>) {
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
    hydroEvolved: boolean;
    @AutoMap()
    dualSoftStarts: boolean;
    @AutoMap()
    v2: boolean;
    @AutoMap()
    v3: boolean;
}

export class CarTractionFieldDetailsResponse implements ICarTractionFieldDetailsResponse {

    constructor(props: Partial<CarTractionFieldDetailsResponse>) {
        Object.assign(this, props);
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

export class CarProvisionDetailsResponse implements ICarProvisionDetailsResponse {

    constructor(props?: Partial<CarProvisionDetailsResponse>) {
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

export class CarSpecialFieldDetailsResponse implements ICarSpecialFieldDetailsResponse {

    constructor(props?: Partial<CarSpecialFieldDetailsResponse>) {
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

export class QuoteAttachmentDetailsResponse implements IQuoteAttachmentDetailsResponse {

    constructor(props?: Partial<QuoteAttachmentDetailsResponse>) {
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

export class CarAdditionalC4RiserBoardsDetailsResponse implements ICarAdditionalC4RiserBoardsDetailsResponse {
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
