import { ICarView } from '../../../../../_shared/models/quotes/quote-view-i.model';
import { BusinessContext } from '../business-context';
import { updateBiddingDateAvailability, selectCablesDatasource, selectDriveModelDatasource, updateV2Traction, updateC4Availability, updateGovernorResetBox, updateGroupRedundancy, updateMADFixture, updateHydroEvolved, updateISOTransfer, updateMX, updateMotorVolts, updateInterfaceToDestinationDispatch, updateV2V3HallCallSecurityCat5, updateConsultantNameAvailability, updateTravelerCable, updateHoistwayCable, updateCarTitle, updateNewMotorFieldsAvailability, updateHoistwayLength, updateLandingSystemLengthOfTravel, updateTravelerLength, updateC4RiserBoardsVisibilityOnQuoteLevel, updateTractionFieldVisibilityOnQuoteLevel, updateHydraulicFieldVisibilityOnQuoteLevel, updateMotorHP, updateCapacity, updateSpeed, updateAIParking, updateMachineRoomMonitoring, updateMotorFLA } from '../business-core/business-rules';

export function initializeQuoteStatuses(ctx: BusinessContext) {

    const quote = ctx.quote;

    updateBiddingDateAvailability(quote);
    updateConsultantNameAvailability(quote);

    ctx.quote.cars.forEach((car) => initializeCar(car, ctx));
}

export function initializeCar(car: ICarView, ctx: BusinessContext) {

    selectCablesDatasource(ctx.lookupData, car.carSmartriseFeature);
    selectDriveModelDatasource(ctx.lookupData, car.carTractionField);

    updateMotorHP(car, ctx.lookupData, ctx, false);

    updateCapacity(car);

    updateSpeed(car);

    updateTravelerCable(car.carSmartriseFeature);
    updateHoistwayCable(car.carSmartriseFeature);

    updateV2Traction(car.carTractionField);
    updateC4Availability(car.carTractionField);
    updateGovernorResetBox(car.carTractionField);
    updateGroupRedundancy(car.carSpecialField);
    updateMADFixture(car.carTractionField);
    updateHydroEvolved(car.carHydraulicField);
    updateISOTransfer(car.carTractionField);
    updateMX(car.carTractionField);
    updateTravelerLength(car.carSmartriseFeature);
    updateHoistwayLength(car.carSmartriseFeature);
    updateLandingSystemLengthOfTravel(car.carSmartriseFeature);

    updateMotorFLA(car, ctx.lookupData, ctx, false);
    updateMotorVolts(car, ctx.lookupData, ctx, false);
    updateNewMotorFieldsAvailability(car.carTractionField);
    updateInterfaceToDestinationDispatch(car.carProvision);
    updateV2V3HallCallSecurityCat5(car.carProvision);

    updateC4RiserBoardsVisibilityOnQuoteLevel(ctx, false);
    updateTractionFieldVisibilityOnQuoteLevel(ctx, false);
    updateHydraulicFieldVisibilityOnQuoteLevel(ctx, false);

    updateAIParking(car.carManagementSystem);

    updateMachineRoomMonitoring(car.carManagementSystem);

    updateCarTitle(ctx.lookupData, car);
}
