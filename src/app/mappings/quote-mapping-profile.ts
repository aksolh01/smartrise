import { AutoMapper, ProfileBase, mapFrom } from "@nartc/automapper";
import { CreateQuotePayload } from "../_shared/models/quotes/create-quote-payload.model";
import { CreateQuoteView } from "../_shared/models/quotes/create-quote-view.model";
import { CarAdditionalC4RiserBoardsResponse, CarAdditionalFeatureResponse, CarDoorFeatureResponse, CarHydraulicFieldResponse, CarManagementSystemResponse, CarProvisionResponse, CarResponse, CarSmartriseFeatureResponse, CarSpecialFieldResponse, CarTractionFieldResponse, JobLocationReponse, QuoteAttachmentResponse, QuoteCustomerResponse, QuoteResponse } from "../_shared/models/quotes/quote-response.model";
import { CarAdditionalC4RiserBoardsView, CarAdditionalFeatureView, CarDoorFeatureView, CarHydraulicFieldView, CarManagementSystemView, CarProvisionView, CarSmartriseFeatureView, CarSpecialFieldView, CarTractionFieldView, CarView, JobLocationView, QuoteAttachmentView, QuoteCustomerView, QuoteView } from "../_shared/models/quotes/quote-view.model";
import { SaveCarAdditionalC4RiserBoardsPayload, SaveCarAdditionalFeaturePayload, SaveCarDoorFeaturePayload, SaveCarHydraulicFieldPayload, SaveCarManagementSystemPayload, SaveCarPayload, SaveCarProvisionPayload, SaveCarSmartriseFeaturePayload, SaveCarSpecialFieldPayload, SaveCarTractionFieldPayload, SaveQuotePayload } from "../_shared/models/quotes/save-qoute.model";
import { SubmitQuotePayload, SubmitCarPayload, SubmitCarManagementSystemPayload, SubmitCarDoorFeaturePayload, SubmitCarAdditionalFeaturePayload, SubmitCarSmartriseFeaturePayload, SubmitCarHydraulicFieldPayload, SubmitCarProvisionPayload, SubmitCarSpecialFieldPayload, SubmitCarTractionFieldPayload, SubmitCarAdditionalC4RiserBoardsPayload } from "../_shared/models/quotes/submit-quote.model";

export class QuoteProfile extends ProfileBase {
    constructor(mapper: AutoMapper) {
        super();
        this._mapResponseToView(mapper);
        this._mapViewToSave(mapper);
        this._mapViewToSubmit(mapper);
        this._mapViewToCreate(mapper);
    }

    private _mapViewToCreate(mapper: AutoMapper) {
        mapper.createMap(CreateQuoteView, CreateQuotePayload)
            .forMember(dst => dst.countryValue, mapFrom(src => src?.jobLocation?.country?.value))
            .forMember(dst => dst.stateValue, mapFrom(src => src?.jobLocation?.state?.value))
            .forMember(dst => dst.city, mapFrom(src => src?.jobLocation?.city));
    }

    private _mapViewToSubmit(mapper: AutoMapper) {
        mapper.createMap(QuoteView, SubmitQuotePayload)
            .forMember(dst => dst.countryValue, mapFrom(src => src?.jobLocation?.country?.value))
            .forMember(dst => dst.stateValue, mapFrom(src => src?.jobLocation?.state?.value))
            .forMember(dst => dst.city, mapFrom(src => src?.jobLocation?.city));

        mapper.createMap(CarView, SubmitCarPayload);
        mapper.createMap(CarManagementSystemView, SubmitCarManagementSystemPayload);
        mapper.createMap(CarDoorFeatureView, SubmitCarDoorFeaturePayload);
        mapper.createMap(CarAdditionalFeatureView, SubmitCarAdditionalFeaturePayload);
        mapper.createMap(CarSmartriseFeatureView, SubmitCarSmartriseFeaturePayload);
        mapper.createMap(CarHydraulicFieldView, SubmitCarHydraulicFieldPayload);
        mapper.createMap(CarTractionFieldView, SubmitCarTractionFieldPayload)
            .forMember(dst => dst.c4, mapFrom(src => Boolean(src.c4)))
            .forMember(dst => dst.v2Traction, mapFrom(src => Boolean(src.v2Traction)))
            .forMember(dst => dst.mx, mapFrom(src => Boolean(src.mx)))
            .forMember(dst => dst.isoTransformer, mapFrom(src => Boolean(src.isoTransformer)))
            .forMember(dst => dst.regenKit, mapFrom(src => Boolean(src.regenKit)))
            .forMember(dst => dst.governorResetBox, mapFrom(src => Boolean(src.governorResetBox)))
            .forMember(dst => dst.lineReactor, mapFrom(src => Boolean(src.lineReactor)))
            .forMember(dst => dst.emirfiFilter, mapFrom(src => Boolean(src.emirfiFilter)))
            .forMember(dst => dst.harmonicFilter, mapFrom(src => Boolean(src.harmonicFilter)))
            .forMember(dst => dst.madFixtures, mapFrom(src => Boolean(src.madFixtures)))
            .forMember(dst => dst.newMotorProvidedBySmartrise, mapFrom(src => Boolean(src.newMotorProvidedBySmartrise)))
            .forMember(dst => dst.coupler, mapFrom(src => Boolean(src.coupler)))
            .forMember(dst => dst.encoder, mapFrom(src => Boolean(src.encoder)));

        mapper.createMap(CarProvisionView, SubmitCarProvisionPayload);
        mapper.createMap(CarSpecialFieldView, SubmitCarSpecialFieldPayload);
        mapper.createMap(CarAdditionalC4RiserBoardsView, SubmitCarAdditionalC4RiserBoardsPayload);
    }

    private _mapViewToSave(mapper: AutoMapper) {
        mapper.createMap(QuoteView, SaveQuotePayload)
            .forMember(dst => dst.countryValue, mapFrom(src => src?.jobLocation?.country?.value))
            .forMember(dst => dst.stateValue, mapFrom(src => src?.jobLocation?.state?.value))
            .forMember(dst => dst.city, mapFrom(src => src?.jobLocation?.city));

        mapper.createMap(CarView, SaveCarPayload);
        mapper.createMap(CarManagementSystemView, SaveCarManagementSystemPayload);
        mapper.createMap(CarDoorFeatureView, SaveCarDoorFeaturePayload);
        mapper.createMap(CarAdditionalFeatureView, SaveCarAdditionalFeaturePayload);
        mapper.createMap(CarSmartriseFeatureView, SaveCarSmartriseFeaturePayload);
        mapper.createMap(CarHydraulicFieldView, SaveCarHydraulicFieldPayload);
        mapper.createMap(CarTractionFieldView, SaveCarTractionFieldPayload)
            .forMember(dst => dst.c4, mapFrom(src => Boolean(src.c4)))
            .forMember(dst => dst.v2Traction, mapFrom(src => Boolean(src.v2Traction)))
            .forMember(dst => dst.mx, mapFrom(src => Boolean(src.mx)))
            .forMember(dst => dst.isoTransformer, mapFrom(src => Boolean(src.isoTransformer)))
            .forMember(dst => dst.regenKit, mapFrom(src => Boolean(src.regenKit)))
            .forMember(dst => dst.governorResetBox, mapFrom(src => Boolean(src.governorResetBox)))
            .forMember(dst => dst.lineReactor, mapFrom(src => Boolean(src.lineReactor)))
            .forMember(dst => dst.emirfiFilter, mapFrom(src => Boolean(src.emirfiFilter)))
            .forMember(dst => dst.harmonicFilter, mapFrom(src => Boolean(src.harmonicFilter)))
            .forMember(dst => dst.madFixtures, mapFrom(src => Boolean(src.madFixtures)))
            .forMember(dst => dst.newMotorProvidedBySmartrise, mapFrom(src => Boolean(src.newMotorProvidedBySmartrise)))
            .forMember(dst => dst.coupler, mapFrom(src => Boolean(src.coupler)))
            .forMember(dst => dst.encoder, mapFrom(src => Boolean(src.encoder)));

        mapper.createMap(CarProvisionView, SaveCarProvisionPayload);
        mapper.createMap(CarSpecialFieldView, SaveCarSpecialFieldPayload);
        mapper.createMap(CarAdditionalC4RiserBoardsView, SaveCarAdditionalC4RiserBoardsPayload)
            .forMember(dst => dst.emergencyGeneratorPowersOtherGroupsSimplex, mapFrom(src => Boolean(src.emergencyGeneratorPowersOtherGroupsSimplex)))
            .forMember(dst => dst.groupInterconnect, mapFrom(src => Boolean(src.groupInterconnect)))
            .forMember(dst => dst.hallCallSecurity, mapFrom(src => Boolean(src.hallCallSecurity)))
            .forMember(dst => dst.id, mapFrom(src => Number(src.id)))
            .forMember(dst => dst.moreThanTwoHallNetworks, mapFrom(src => Boolean(src.moreThanTwoHallNetworks)));
    }

    private _mapResponseToView(mapper: AutoMapper) {
        mapper.createMap(QuoteResponse, QuoteView);
        mapper.createMap(QuoteCustomerResponse, QuoteCustomerView);
        mapper.createMap(CarResponse, CarView);
        mapper.createMap(CarManagementSystemResponse, CarManagementSystemView);
        mapper.createMap(CarDoorFeatureResponse, CarDoorFeatureView);
        mapper.createMap(CarAdditionalFeatureResponse, CarAdditionalFeatureView);
        mapper.createMap(CarSmartriseFeatureResponse, CarSmartriseFeatureView);
        mapper.createMap(CarHydraulicFieldResponse, CarHydraulicFieldView);
        mapper.createMap(CarTractionFieldResponse, CarTractionFieldView);
        mapper.createMap(CarProvisionResponse, CarProvisionView);
        mapper.createMap(CarSpecialFieldResponse, CarSpecialFieldView);
        mapper.createMap(CarAdditionalC4RiserBoardsResponse, CarAdditionalC4RiserBoardsView);
        mapper.createMap(JobLocationReponse, JobLocationView);
        mapper.createMap(QuoteAttachmentResponse, QuoteAttachmentView);
    }
}
