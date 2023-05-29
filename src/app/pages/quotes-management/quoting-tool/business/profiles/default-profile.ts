import { QuoteView, CarView, CarTractionFieldView, CarSmartriseFeatureView, CarHydraulicFieldView, CarDoorFeatureView } from "../../../../../_shared/models/quotes/quote-view.model";
import { BuisnessBuilder } from "../builder/business-builder";
import { WorkingMode } from "../types";
import { BusinessContext } from "../business-context";
import { BusinessProfile } from "../business-profile";
import {
    isLessThanToday,
    hoistwayLengthRequired,
    landingSystemLengthOfTravelRequired,
    isBetween1And8,
    validateStopsIfInRangeBasedOnControllerType,
    validateOpeningsIfInRangeBasedOnControllerType,
    isBetween100And600,
    isBetween10And1400, isBetween500And20000, consultantNameRequired, travelerLengthRequired, alwaysRequired, hasSpace, validateMotorHPIfInRangeBasedOnControllerType, validateZeroInCaseOfDCController
} from "../business-core/business-validations";
import { reevaluateMainLineVoltageDependentsOnAssume, canAssumeMotorVolts, canAssumeSpeedFPM, canAssumeCapacity, canAssumeMotorHP, canAssumeHoistwayLength, canAssumeTravelerLength, canAssumeLandingSystemLengthOfTravel, canAssumeFullLoadAmps } from "../event-callbacks/assume-callbacks";
import { reevaluateJobStatusDependents, reevaluateJobLocationDependents, reevaluateUnknownConsultantDependents, reevaluateGroupDependents, reevaluateCarLabelDependents, reevaluateControllerTypeDependents, reevaluateMainLineVoltageDependents, reevaluateMotorLocationDependents, reevaluateMotorTypeDependents, reevaluateMotorVoltsDependents, reevaluateTravelerCableDependents, reevaluateHoistwayCableDependents, reevaluateHydroEvolvedDependents, reevaluateC4Dependents, reevaluateNewMotorProvidedBySmartrise, reevaluateStopsDependents, reevaluateSpeedDependents, reevaluateCapacityDependents, reevaluateMotorHPDependents, reevaluateMotorRPM, reevaluateV2Traction, reevaluateV2HydrualicDependents, reevaluateHoistwayNemaRatingDependents } from "../event-callbacks/change-callbacks";
import { initializeQuoteStatuses } from "../event-callbacks/initialize-callbacks";
import { validateV2TractionPreConditions, validateC4PreConditions, validateV2HydraulicPreConditions, validateHydroEvolvedPreConditions } from "../event-callbacks/changing-callbacks";

export class DefaultProfile extends BusinessProfile {

    constructor(businessBuilder: BuisnessBuilder, businessContext: BusinessContext) {
        super(businessBuilder, businessContext);
    }

    initialize() {
        initializeQuoteStatuses(this.businessContext);
    }

    apply() {
        this.businessBuilder.clear();
        this._buildOnPrecondition();
        this._buildOnChanges();
        this._buildOnValidates();
        this._buildOnAssume();
        return super.apply();
    }

    private _buildOnPrecondition() {
        this.businessBuilder
            .onPrecondition(CarTractionFieldView, 'v2Traction')
            .call(validateV2TractionPreConditions)
            .onPrecondition(CarTractionFieldView, 'c4')
            .call(validateC4PreConditions)
            .onPrecondition(CarHydraulicFieldView, 'v2')
            .call(validateV2HydraulicPreConditions)
            .onPrecondition(CarHydraulicFieldView, 'hydroEvolved')
            .call(validateHydroEvolvedPreConditions);
    }

    private _buildOnChanges() {
        this.businessBuilder
            .onChange(QuoteView, 'jobStatus')
            .call(reevaluateJobStatusDependents)
            .onChange(QuoteView, 'jobLocation')
            .call(reevaluateJobLocationDependents)
            .onChange(QuoteView, 'unknownConsultant')
            .call(reevaluateUnknownConsultantDependents)
            .onChange(CarView, 'group')
            .call(reevaluateGroupDependents)
            .onChange(CarView, 'carLabel')
            .call(reevaluateCarLabelDependents)
            .onChange(CarView, 'controllerType')
            .call(reevaluateControllerTypeDependents)
            .onChange(CarView, 'speedFPM')
            .call(reevaluateSpeedDependents)
            .onChange(CarView, 'capacity')
            .call(reevaluateCapacityDependents)
            .onChange(CarView, 'motorHP')
            .call(reevaluateMotorHPDependents)
            .onChange(CarView, 'stops')
            .call(reevaluateStopsDependents)
            .onChange(CarView, 'mainLineVoltage')
            .call(reevaluateMainLineVoltageDependents)
            .onChange(CarTractionFieldView, 'motorLocation')
            .call(reevaluateMotorLocationDependents)
            .onChange(CarTractionFieldView, 'motorType')
            .call(reevaluateMotorTypeDependents)
            .onChange(CarTractionFieldView, 'newMotorProvidedBySmartrise')
            .call(reevaluateNewMotorProvidedBySmartrise)
            .onChange(CarTractionFieldView, 'motorRPM')
            .call(reevaluateMotorRPM)
            .onChange(CarTractionFieldView, 'v2Traction')
            .call(reevaluateV2Traction)
            .onChange(CarView, 'motorVolts')
            .call(reevaluateMotorVoltsDependents)
            .onChange(CarSmartriseFeatureView, 'travelerCable')
            .call(reevaluateTravelerCableDependents)
            .onChange(CarSmartriseFeatureView, 'hoistwayCable')
            .call(reevaluateHoistwayCableDependents)
            .onChange(CarSmartriseFeatureView, 'hoistwayNemaRating')
            .call(reevaluateHoistwayNemaRatingDependents)
            .onChange(CarTractionFieldView, 'c4')
            .call(reevaluateC4Dependents)
            .onChange(CarHydraulicFieldView, 'hydroEvolved')
            .call(reevaluateHydroEvolvedDependents)
            .onChange(CarHydraulicFieldView, 'v2')
            .call(reevaluateV2HydrualicDependents)
            .onChange(CarHydraulicFieldView, 'v3')
            .call(reevaluateV2HydrualicDependents);
    }

    private _buildOnValidates() {

        this._buildRequireds();

        this.businessBuilder
            .onValidate(QuoteView, 'jobName', WorkingMode.Save)
            .onValidate(QuoteView, 'consultantName', WorkingMode.Save)
            .call(hasSpace)
            .onValidate(QuoteView, 'biddingDate', WorkingMode.Save)
            .call(isLessThanToday)
            .onValidate(CarSmartriseFeatureView, 'hoistwayLength', WorkingMode.Generate)
            .call(hoistwayLengthRequired)
            .onValidate(CarSmartriseFeatureView, 'landingSystemLengthOfTravel', WorkingMode.Generate)
            .call(landingSystemLengthOfTravelRequired)
            .onValidate(CarView, 'numberOfCars', WorkingMode.Generate)
            .call(isBetween1And8)
            .onValidate(CarView, 'stops', WorkingMode.Generate)
            .call(validateStopsIfInRangeBasedOnControllerType)
            .onValidate(CarView, 'openings', WorkingMode.Generate)
            .call(validateOpeningsIfInRangeBasedOnControllerType)
            .onValidate(CarView, 'motorVolts', WorkingMode.Generate)
            .call(isBetween100And600)
            // .onValidate(CarView, 'motorHP', WorkingMode.Generate)
            // .call(validateZeroInCaseOfDCController)
            .onValidate(CarView, 'motorHP', WorkingMode.Generate)
            .call(validateMotorHPIfInRangeBasedOnControllerType)
            // .onValidate(CarView, 'speedFPM', WorkingMode.Generate)
            // .call(validateZeroInCaseOfDCController)
            .onValidate(CarView, 'speedFPM', WorkingMode.Generate)
            .call(isBetween10And1400)
            // .onValidate(CarView, 'capacity', WorkingMode.Generate)
            // .call(validateZeroInCaseOfDCController)
            .onValidate(CarView, 'capacity', WorkingMode.Generate)
            .call(isBetween500And20000)
            .onValidate(QuoteView, 'consultantName', WorkingMode.Save)
            .call(consultantNameRequired)
            .onValidate(CarSmartriseFeatureView, 'travelerLength', WorkingMode.Generate)
            .call(travelerLengthRequired);
    }

    private _buildRequireds() {
        this.businessBuilder
            .onValidate(QuoteView, 'jobName', WorkingMode.Save)
            .onValidate(QuoteView, 'buildingType', WorkingMode.Save)
            .onValidate(QuoteView, 'biddingDate', WorkingMode.Save)
            .onValidate(QuoteView, 'jobStatus', WorkingMode.Save)
            .onValidate(QuoteView, 'jobLocation', WorkingMode.Save)
            .onValidate(QuoteView, 'contact', WorkingMode.Save)
            .onValidate(CarView, 'group', WorkingMode.Generate)
            .onValidate(CarView, 'carLabel', WorkingMode.Generate)
            .onValidate(CarView, 'controllerType', WorkingMode.Generate)
            .onValidate(CarView, 'numberOfRisers', WorkingMode.Generate)
            .onValidate(CarView, 'numberOfRisersAlternative', WorkingMode.Generate)
            .onValidate(CarView, 'stops', WorkingMode.Generate)
            .onValidate(CarView, 'mainLineVoltage', WorkingMode.Generate)
            .onValidate(CarView, 'motorVolts', WorkingMode.Generate)
            .onValidate(CarView, 'speedFPM', WorkingMode.Generate)
            .onValidate(CarView, 'capacity', WorkingMode.Generate)
            .onValidate(CarView, 'motorHP', WorkingMode.Generate)
            .onValidate(CarView, 'numberOfCars', WorkingMode.Generate)
            .onValidate(CarView, 'openings', WorkingMode.Generate)
            .onValidate(CarHydraulicFieldView, 'motorLeads', WorkingMode.Generate)
            .onValidate(CarHydraulicFieldView, 'starter', WorkingMode.Generate)
            .onValidate(CarDoorFeatureView, 'door', WorkingMode.Generate)
            .onValidate(CarSmartriseFeatureView, 'controllerLayout', WorkingMode.Generate)
            .call(alwaysRequired);
    }

    private _buildOnAssume() {
        this.businessBuilder
            .onAssume(CarView, 'mainLineVoltage')
            .call(reevaluateMainLineVoltageDependentsOnAssume)
            .onAssume(CarView, 'motorVolts')
            .call(canAssumeMotorVolts)
            .onAssume(CarView, 'speedFPM')
            .call(canAssumeSpeedFPM)
            .onAssume(CarView, 'fullLoadAmps')
            .call(canAssumeFullLoadAmps)
            .onAssume(CarView, 'capacity')
            .call(canAssumeCapacity)
            .onAssume(CarView, 'motorHP')
            .call(canAssumeMotorHP)
            .onAssume(CarSmartriseFeatureView, 'landingSystemLengthOfTravel')
            .call(canAssumeLandingSystemLengthOfTravel)
            .onAssume(CarSmartriseFeatureView, 'travelerLength')
            .call(canAssumeHoistwayLength)
            .onAssume(CarSmartriseFeatureView, 'hoistwayLength')
            .call(canAssumeTravelerLength);
    }
}
