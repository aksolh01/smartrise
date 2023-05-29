import { EventArg, InstanceView } from "../types";
import { BusinessContext } from "../business-context";
import { updateGroupRedundancy, updateInterfaceToDestinationDispatch, updateV2V3HallCallSecurityCat5, updateMADFixture, updateV2Traction, updateMX, selectDriveModelDatasource, updateC4Availability, updateGovernorResetBox, updateISOTransfer, updateHydroEvolved, updateMotorVolts, updateBiddingDateAvailability, selectCablesDatasource, updateCarTitle, updateHydraulicFieldVisibilityOnQuoteLevel, updateTractionFieldVisibilityOnQuoteLevel, updateC4RiserBoardsVisibilityOnQuoteLevel, updateConsultantNameAvailability, updateTravelerCable, updateHoistwayCable, updateNewMotorFieldsAvailability, updateTravelerLength, updateHoistwayLength, updateLandingSystemLengthOfTravel, updateMotorHP, updateMotorFLA, updateCapacity, updateSpeed, updateEstimatedMotorHP, updateAssumeStatus, updateAIParking, fillCarDefaultValuesBasedOnControllerType, updateV2Hydraulic, updateV3Hydraulic } from "../business-core/business-rules";
import { ICarTractionFieldView, ICarView, IQuoteView } from "../../../../../_shared/models/quotes/quote-view-i.model";

export function reevaluateGroupDependents(ctx: BusinessContext, instance: InstanceView, arg: EventArg) {

    const group = ctx.lookupData.groups.filter(x => x.value === arg.newValue);

    let groupValue = null;
    let groupDescription = null;
    if (group.length > 0) {
        groupValue = group[0].value;
        groupDescription = group[0].description;
    }

    updateGroupRedundancy(instance.carSpecialField);
    updateInterfaceToDestinationDispatch(instance.carProvision);
    updateV2V3HallCallSecurityCat5(instance.carProvision);

    if (groupDescription) {
        if (groupDescription && instance.carLabel) {
            instance.displayName = groupDescription + ' - ' + instance.carLabel;
        } else if (groupDescription && !instance.carLabel) {
            instance.displayName = groupDescription;
        } else if (!groupDescription && instance.carLabel) {
            instance.displayName = instance.carLabel;
        }
    } else {
        instance.displayName = instance.carLabel;
    }

    ctx.actions.updateCar({
        ref: instance.ref,
        displayName: instance.displayName
    });

    ctx.actions.revalidateField(instance.carProvision, 'interfaceToDestinationDispatch');
    ctx.actions.revalidateField(instance.carProvision, 'v2V3HallCallSecurityCat5');
}

export function reevaluateControllerTypeDependents(ctx: BusinessContext, car: ICarView, arg: EventArg) {


    fillCarDefaultValuesBasedOnControllerType(car, ctx.lookupData.defaultCar);
    selectDriveModelDatasource(ctx.lookupData, car.carTractionField);
    selectCablesDatasource(ctx.lookupData, car.carSmartriseFeature);

    updateAIParking(car.carManagementSystem);

    updateMADFixture(car.carTractionField);
    updateV2Traction(car.carTractionField);
    updateMX(car.carTractionField);

    if (!car.hasControllerType()) {
        car.carSmartriseFeature.travelerCable = '';
    }
    updateTravelerCable(car.carSmartriseFeature);

    if (!car.hasControllerType()) {
        car.carSmartriseFeature.hoistwayCable = '';
    }
    updateHoistwayCable(car.carSmartriseFeature);

    car.carTractionField.c4 = car.isTraction() && !car.carTractionField.v2Traction;
    updateC4Availability(car.carTractionField);
    updateGovernorResetBox(car.carTractionField);

    car.carTractionField.isoTransformer = false;
    car.carTractionField.isoTransformerAvailable = true;
    updateISOTransfer(car.carTractionField);
    updateHydroEvolved(car.carHydraulicField);
    updateV2Hydraulic(car.carHydraulicField);
    updateV3Hydraulic(car.carHydraulicField);

    // updateV2V3HallCallSecurityCat5({
    //     c4: instance.carTractionField.c4,
    //     group: instance.group,
    //     controllerType: instance.controllerType,
    //     hydroEvolved: instance.carHydraulicField.hydroEvolved,
    // }, instance.carProvision);

    updateMotorHP(car, ctx.lookupData, ctx);

    updateMotorFLA(car, ctx.lookupData, ctx);

    //should call the function before the if condition.
    //this should be solved after refactorying the updateSpeed method.
    updateSpeed(car);
    if (car.isHydraulic() && car.speedFPMAssume) {
        car.speedFPM = car.speedFPMAssumedValue;
    }

    //should call the function before the if condition.
    //this should be solved after refactorying the updateCapacity method.
    updateCapacity(car);
    if (car.isHydraulic()) {
        if (car.capacityAssume) {
            car.capacity = car.capacityAssumedValue;
        }
    } else {
        car.capacityAssumable = false;
        car.capacityAssume = false;
    }

    updateMotorVolts(car, ctx.lookupData, ctx);

    updateHydraulicFieldVisibilityOnQuoteLevel(ctx);
    updateTractionFieldVisibilityOnQuoteLevel(ctx);
    updateC4RiserBoardsVisibilityOnQuoteLevel(ctx);


    ctx.actions.revalidateField(car.carSmartriseFeature, 'travelerCable');
    ctx.actions.revalidateField(car.carSmartriseFeature, 'hoistwayCable');
    ctx.actions.revalidateField(car.carHydraulicField, 'v3');
    ctx.actions.revalidateField(car.carTractionField, 'c4');
    ctx.actions.revalidateField(car.carTractionField, 'governorResetBox');
    ctx.actions.revalidateField(car.carTractionField, 'isoTransformer');
    ctx.actions.revalidateField(car.carHydraulicField, 'hydroEvolved');
    ctx.actions.revalidateField(car.carProvision, 'v2V3HallCallSecurityCat5');
    ctx.actions.revalidateField(car, 'motorHP');
    ctx.actions.revalidateField(car, 'fullLoadAmps');
}

export function reevaluateMainLineVoltageDependents(ctx: BusinessContext, car: ICarView, arg: EventArg) {
    updateMotorVolts(car, ctx.lookupData, ctx);
    updateMotorHP(car, ctx.lookupData, ctx);
    updateMotorFLA(car, ctx.lookupData, ctx);
    car.carTractionField.isoTransformer = false;
    car.carTractionField.isoTransformerAvailable = true;
    updateISOTransfer(car.carTractionField);

    ctx.actions.revalidateField(car, 'motorVolts');
    ctx.actions.revalidateField(car.carTractionField, 'isoTransformer');
}

export function reevaluateUnknownConsultantDependents(ctx: BusinessContext, quote: IQuoteView, arg: EventArg) {
    quote.consultantName = null;
    updateConsultantNameAvailability(quote);

    ctx.actions.revalidateField(quote, 'consultantName');
}

export function reevaluateTravelerCableDependents(ctx: BusinessContext, instance: InstanceView, arg: EventArg) {
    ctx.actions.revalidateField(instance, 'travelerLength');
}

export function reevaluateJobStatusDependents(ctx: BusinessContext, quote: IQuoteView, arg: EventArg) {

    quote.biddingDate = null;

    updateBiddingDateAvailability(quote);

    ctx.actions.revalidateField(quote, 'biddingDate');
}

export function reevaluateSpeedDependents(ctx: BusinessContext, car: ICarView, arg: EventArg) {

    updateAssumeStatus(car);
    updateMotorHP(car, ctx.lookupData, ctx);

    //should call the function before the if condition.
    //this should be solved after refactorying the updateCapacity method.
    updateCapacity(car);
    if (car.isHydraulic()) {
        if (car.capacityAssume) {
            if (car.capacity !== car.capacityAssumedValue) {
                car.capacity = car.capacityAssumedValue;
                ctx.actions.revalidateField(car, 'capacity');
            }
        }
    } else {
        car.capacityAssumable = false;
        car.capacityAssume = false;
    }

    updateMotorFLA(car, ctx.lookupData, ctx);
    updateMotorVolts(car, ctx.lookupData, ctx);


    ctx.actions.revalidateField(car, 'motorHP');
    ctx.actions.revalidateField(car, 'fullLoadAmps');
    ctx.actions.revalidateField(car, 'motorVolts');
}

export function reevaluateMotorHPDependents(ctx: BusinessContext, car: ICarView, arg: EventArg) {

    updateAssumeStatus(car);

    //should call the function before the if condition.
    //this should be solved after refactorying the updateCapacity method.
    updateCapacity(car);
    if (car.isHydraulic()) {
        if (car.capacityAssume) {
            if (car.capacity != car.capacityAssumedValue) {
                car.capacity = car.capacityAssumedValue;
                ctx.actions.revalidateField(car, 'capacity');
            }
        }
    } else {
        car.capacityAssumable = false;
        car.capacityAssume = false;
    }

    //should call the function before the if condition.
    //this should be solved after refactorying the updateSpeed method.
    updateSpeed(car);
    if (car.isHydraulic() && car.speedFPMAssume) {
        if (car.speedFPM !== car.speedFPMAssumedValue) {
            car.speedFPM = car.speedFPMAssumedValue;
            ctx.actions.revalidateField(car, 'speedFPM');
        }
    }

    updateEstimatedMotorHP(car);

    updateMotorFLA(car, ctx.lookupData, ctx);

    ctx.actions.revalidateField(car, 'fullLoadAmps');
}

export function reevaluateCapacityDependents(ctx: BusinessContext, car: ICarView, arg: EventArg) {

    updateAssumeStatus(car);

    updateMotorHP(car, ctx.lookupData, ctx);

    //should call the function before the if condition.
    //this should be solved after refactorying the updateSpeed method.
    updateSpeed(car);
    if (car.isHydraulic() && car.speedFPMAssume) {
        car.speedFPM = car.speedFPMAssumedValue;
        ctx.actions.revalidateField(car, 'speedFPM');
    }

    updateMotorFLA(car, ctx.lookupData, ctx);
    updateMotorVolts(car, ctx.lookupData, ctx);


    ctx.actions.revalidateField(car, 'motorHP');
    ctx.actions.revalidateField(car, 'fullLoadAmps');
}

export function reevaluateMotorLocationDependents(ctx: BusinessContext, traction: ICarTractionFieldView, arg: EventArg) {
    updateGovernorResetBox(traction);
    updateMX(traction);
    updateMotorHP(traction.car, ctx.lookupData, ctx);
    updateMotorFLA(traction.car, ctx.lookupData, ctx);
    updateMotorVolts(traction.car, ctx.lookupData, ctx);


    ctx.actions.revalidateField(traction, 'governorResetBox');
    ctx.actions.revalidateField(traction, 'mx');
    ctx.actions.revalidateField(traction.car, 'motorHP');
    ctx.actions.revalidateField(traction.car, 'fullLoadAmps');
}

export function reevaluateMotorTypeDependents(ctx: BusinessContext, carTraction: ICarTractionFieldView, arg: EventArg) {
    if (carTraction.isGearless()) {
        carTraction.batteryRescue = 'Manual';
    }

    updateMX(carTraction);

    carTraction.isoTransformer = false;
    carTraction.isoTransformerAvailable = true;
    updateISOTransfer(carTraction);
    updateMotorHP(carTraction.car, ctx.lookupData, ctx);
    updateMotorFLA(carTraction.car, ctx.lookupData, ctx);
    updateMotorVolts(carTraction.car, ctx.lookupData, ctx);

    ctx.actions.revalidateField(carTraction, 'batteryRescue');
    ctx.actions.revalidateField(carTraction, 'mx');
    ctx.actions.revalidateField(carTraction, 'isoTransformer');
    ctx.actions.revalidateField(carTraction.car, 'motorHP');
    ctx.actions.revalidateField(carTraction.car, 'fullLoadAmps');
}

export function reevaluateNewMotorProvidedBySmartrise(ctx: BusinessContext, traction: ICarTractionFieldView, arg: EventArg) {

    if (!traction.newMotorProvidedBySmartrise) {
        traction.motorProvider = '';
        traction.motorMount = '';
        traction.motorRPM = null;
        traction.coupler = false;
        traction.encoder = false;
    }

    updateNewMotorFieldsAvailability(traction);

    ctx.actions.revalidateField(traction, 'motorRPM');
}

export function reevaluateMotorRPM(ctx: BusinessContext, traction: ICarTractionFieldView, arg: EventArg) {

    updateMotorFLA(traction.car, ctx.lookupData, ctx);

}

export function reevaluateV2Traction(ctx: BusinessContext, traction: ICarTractionFieldView, arg: EventArg) {
    selectCablesDatasource(ctx.lookupData, traction.car.carSmartriseFeature);
    updateAIParking(traction.car.carManagementSystem);
}

export function reevaluateMotorVoltsDependents(ctx: BusinessContext, car: ICarView, arg: EventArg) {

    car.carTractionField.isoTransformer = false;
    car.carTractionField.isoTransformerAvailable = true;
    updateISOTransfer(car.carTractionField);

    updateMotorFLA(car, ctx.lookupData, ctx);

    ctx.actions.revalidateField(car.carTractionField, 'isoTransformer');
    ctx.actions.revalidateField(car, 'fullLoadAmps');
}

export function reevaluateHydroEvolvedDependents(ctx: BusinessContext, instance: InstanceView, arg: EventArg) {
    selectCablesDatasource(ctx.lookupData, instance.car.carSmartriseFeature);
    updateC4RiserBoardsVisibilityOnQuoteLevel(ctx);
    updateV2V3HallCallSecurityCat5(instance.car.carProvision);

    if (!instance.car.hasControllerType()) {
        instance.car.carSmartriseFeature.travelerCable = '';
    }
    updateTravelerCable(instance.car.carSmartriseFeature);

    if (!instance.car.hasControllerType()) {
        instance.car.carSmartriseFeature.hoistwayCable = '';
    }
    updateHoistwayCable(instance.car.carSmartriseFeature);
    updateV2V3HallCallSecurityCat5(instance.car.carProvision);

    ctx.actions.revalidateField(instance.car.carSmartriseFeature, 'travelerCable');
    ctx.actions.revalidateField(instance.car.carSmartriseFeature, 'hoistwayCable');
    ctx.actions.revalidateField(instance.car.carProvision, 'v2V3HallCallSecurityCat5');
}

export function reevaluateC4Dependents(ctx: BusinessContext, instance: InstanceView, arg: EventArg) {
    updateV2V3HallCallSecurityCat5(instance.car.carProvision);
    updateC4RiserBoardsVisibilityOnQuoteLevel(ctx);
    selectCablesDatasource(ctx.lookupData, instance.car.carSmartriseFeature);
    ctx.actions.revalidateField(instance.car.carProvision, 'v2V3HallCallSecurityCat5');
    ctx.actions.revalidateField(instance.car.carSmartriseFeature, 'travelerCable');
    ctx.actions.revalidateField(instance.car.carSmartriseFeature, 'hoistwayCable');
}

export function reevaluateV2HydrualicDependents(ctx: BusinessContext, instance: InstanceView, arg: EventArg) {
    updateV2V3HallCallSecurityCat5(instance.car.carProvision)
}

export function reevaluateV3HydrualicDependents(ctx: BusinessContext, instance: InstanceView, arg: EventArg) {
    updateV2V3HallCallSecurityCat5(instance.car.carProvision)
}

export function reevaluateJobLocationDependents(ctx: BusinessContext, instance: InstanceView, arg: EventArg) {
    ctx.quote.cars.forEach(car => {
        updateMADFixture(car.carTractionField);
        updateV2Traction(car.carTractionField);
        updateV2Hydraulic(car.carHydraulicField);
        updateV3Hydraulic(car.carHydraulicField);
        updateHydroEvolved(car.carHydraulicField);
        updateV2V3HallCallSecurityCat5(car.carProvision);
        ctx.actions.revalidateField(car.carTractionField, 'madFixtures');
        ctx.actions.revalidateField(car.carTractionField, 'v2Traction');
        ctx.actions.revalidateField(car.carHydraulicField, 'v3');
        ctx.actions.revalidateField(car.carHydraulicField, 'v2');
    });
}

export function reevaluateCarLabelDependents(ctx: BusinessContext, instance: InstanceView, arg: EventArg) {
    updateCarTitle(ctx.lookupData, instance);
    ctx.actions.updateCar({
        ref: instance.ref,
        displayName: instance.displayName
    });
}

export function reevaluateHoistwayNemaRatingDependents(ctx: BusinessContext, instance: InstanceView, arg: EventArg) {
    ctx.actions.revalidateField(instance, 'landingSystemLengthOfTravel');
}

export function reevaluateHoistwayCableDependents(ctx: BusinessContext, instance: InstanceView, arg: EventArg) {
    instance.hoistwayLengthIsRequired = arg.newValue !== '';
    ctx.actions.revalidateField(instance, 'hoistwayLength');
}

export function reevaluateStopsDependents(ctx: BusinessContext, car: ICarView, arg: EventArg) {
    updateTravelerLength(car.carSmartriseFeature);
    updateHoistwayLength(car.carSmartriseFeature);
    updateLandingSystemLengthOfTravel(car.carSmartriseFeature);

    ctx.actions.revalidateField(car.carSmartriseFeature, 'travelerLength');
    ctx.actions.revalidateField(car.carSmartriseFeature, 'hoistwayLength');
    ctx.actions.revalidateField(car.carSmartriseFeature, 'landingSystemLengthOfTravel');
}
