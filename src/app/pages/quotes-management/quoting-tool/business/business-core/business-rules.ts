/* eslint-disable */
import { replaceWithDefault } from '../../../../../_shared/functions';
import { ICarAdditionalFeature } from '../../../../../_shared/models/quote-job.model';
import { IQuoteLookupDataView } from '../../../../../_shared/models/quotes/quote-lookup-data-i.model';
import { ICarAdditionalC4RiserBoardsView, ICarDoorFeatureView, ICarHydraulicFieldView, ICarManagementSystemView, ICarProvisionView, ICarSmartriseFeatureView, ICarSpecialFieldView, ICarTractionFieldView, ICarView, IJobLocationView, IQuoteView } from '../../../../../_shared/models/quotes/quote-view-i.model';
import { BusinessContext } from '../business-context';
import { isBetween, isEmptyValue } from './business-formulas';

export function updateBiddingDateAvailability(quote: IQuoteView) {
    quote.biddingDateAvailable = quote.jobStatus === 'Bidding';
}

export function updateConsultantNameAvailability(quote: IQuoteView) {
    quote.consultantNameAvailable = !quote.unknownConsultant;
}

export function updateEstimatedMotorHP(car: ICarView) {

    if (!car.isHydraulic()) {
        car.motorHPWarningMessage = null;
        return;
    }

    const speed = car.speedFPM;
    const capacity = car.capacity;
    const hp = car.motorHP;
    const motorHPAssume = car.motorHPAssume;
    const speedFPMAssume = car.speedFPMAssume;
    const capacityAssume = car.capacityAssume;

    let estimatedHP = 0;

    if (motorHPAssume || speedFPMAssume || capacityAssume) {
        car.motorHPWarningMessage = null;
        return;
    }

    if ((speed == null || speed <= 0) || (capacity == null || capacity <= 0)) {
        car.motorHPWarningMessage = null;
        return;
    }

    if (isBetween(speed, 10, 1400)) {
        car.motorHPWarningMessage = null;
        return;
    }

    if (isBetween(capacity, 500, 20000)) {
        car.motorHPWarningMessage = null;
        return;
    }

    estimatedHP = +(speed * capacity / 10000).toFixed(0);

    if (estimatedHP < 5) {
        estimatedHP = 5;
    }

    if (estimatedHP > 100) {
        estimatedHP = 100;
    }

    car.motorHPWarningMessage = null;
    if (hp > 10 && ((hp / estimatedHP > 1.2) || (hp / estimatedHP < 0.8))) {
        car.motorHPWarningMessage = `Differs from the Estimated HP "${estimatedHP}" by more than 20%`;
    }
}

export function updateMADFixture(traction: ICarTractionFieldView) {
    if (traction.car.quote?.jobLocation?.country?.value === 'Canada') {
        traction.madFixturesAvailable = true;
    } else {
        traction.madFixturesAvailable = false;
        traction.madFixtures = false;
    }
}

export function updateMX(traction: ICarTractionFieldView) {
    if (traction.car.isTraction() && traction.isGearless() && traction.isMRL()) {
        traction.mxAvailable = true;
    } else {
        traction.mxAvailable = false;
        traction.mx = false;
    }
}

export function updateHydroEvolved(hydraulic: ICarHydraulicFieldView) {
    if (hydraulic.car.isHydraulic() && hydraulic.car.quote.isCanadaOntario()) {
        hydraulic.hydroEvolved = false;
        hydraulic.hydroEvolvedAvailable = false;
    } else if (hydraulic.car.isHydraulic() && !hydraulic.car.quote.isCanadaOntario()) {
        hydraulic.hydroEvolvedAvailable = true;
    }
}

export function updateV2Hydraulic(hydraulic: ICarHydraulicFieldView) {
    if (hydraulic.car.isHydraulic() && hydraulic.car.quote.isCanadaOntario()) {
        hydraulic.v2 = false;
        hydraulic.v2Available = false;
    } else if (hydraulic.car.isHydraulic() && !hydraulic.car.quote.isCanadaOntario()) {
        hydraulic.v2Available = true;
    }
}

export function updateV3Hydraulic(hydraulic: ICarHydraulicFieldView) {
    if (hydraulic.car.isHydraulic() && hydraulic.car.quote.isCanadaOntario()) {
        hydraulic.v3 = true;
        hydraulic.v3Available = false;
    } else if (hydraulic.car.isHydraulic() && !hydraulic.car.quote.isCanadaOntario()) {
        hydraulic.v3 = false;
        hydraulic.v3Available = false;
    }
}

export function updateV2V3HallCallSecurityCat5(provision: ICarProvisionView) {

    if (provision.car.isSimplex() || !provision.car.hasGroup()) {
        provision.v2V3HallCallSecurityCat5Available = false;
        provision.v2V3HallCallSecurityCat5 = false;
        return;
    }

    if (provision.car.isTraction() && provision.car.carTractionField.c4) {
        provision.v2V3HallCallSecurityCat5Available = true;
        return;
    }

    if (provision.car.isHydraulic() && (
        provision.car.carHydraulicField.hydroEvolved ||
        provision.car.carHydraulicField.v2 ||
        provision.car.carHydraulicField.v3)
    ) {
        provision.v2V3HallCallSecurityCat5Available = true;
        return;
    }

    provision.v2V3HallCallSecurityCat5Available = false;
    provision.v2V3HallCallSecurityCat5 = false;
}

//Do not remove refactor this method parameters, becuase
//the jobLocation is instance
export function updateV2Traction(traction: ICarTractionFieldView) {
    if (!traction.car.hasControllerType()) {
        traction.v2Available = false;
        traction.v2Traction = false;
    } else if (traction.car.isTraction()) {
        traction.v2Available = true;
    }
}

export function updateC4Availability(traction: ICarTractionFieldView) {
    traction.c4Available = traction.car.isTraction();
}

export function updateGovernorResetBox(traction: ICarTractionFieldView) {
    if (traction.isMRL() && traction.car.isTraction()) {
        traction.governorResetBox = true;
    }
}

export function updateISOTransfer(traction: ICarTractionFieldView) {

    const mainLineVoltage = Number(traction.car.mainLineVoltage);
    const motorVolts = Number(traction.car.motorVolts);

    traction.isoTransformerAvailable = true;

    if (traction.car.isDCTraction()) {
        traction.isoTransformer = true;
        traction.isoTransformerAvailable = false;
        return;
    }


    if (traction.isGeared()) {
        const diffBetweenMotorVoltsAndMainLineVoltage = mainLineVoltage - Number(traction.car.motorVolts);
        const diffBetweenMotorVoltsAndMainLineVoltageInPercentage = diffBetweenMotorVoltsAndMainLineVoltage / mainLineVoltage * 100;

        if (Math.abs(diffBetweenMotorVoltsAndMainLineVoltageInPercentage) > 10) {
            traction.isoTransformer = true;
            traction.isoTransformerAvailable = false;
            return;
        }
    }

    if (traction.isGearless() && mainLineVoltage < 200 && motorVolts > 200) {
        traction.isoTransformer = true;
        traction.isoTransformerAvailable = false;
        return;
    }

    if (traction.isGearless() && mainLineVoltage > 200 && motorVolts < 200) {
        traction.isoTransformer = true;
        traction.isoTransformerAvailable = false;
        return;
    }
}

export function updateC4RiserBoardsVisibility(carAdditionalC4RiserBoards: ICarAdditionalC4RiserBoardsView, allowChangeValues: boolean = true) {
    if (
        (carAdditionalC4RiserBoards.car.isHydraulic() && carAdditionalC4RiserBoards.car.carHydraulicField.hydroEvolved)
        || carAdditionalC4RiserBoards.car.carTractionField.c4) {
        carAdditionalC4RiserBoards.hide = false;
    } else {
        carAdditionalC4RiserBoards.hide = true;
        if (allowChangeValues) {
            resetAdditionalC4RiserBoardsFields(carAdditionalC4RiserBoards);
        }
    }

}

function resetAdditionalC4RiserBoardsFields(carAdditionalC4RiserBoards: ICarAdditionalC4RiserBoardsView) {
    carAdditionalC4RiserBoards.emergencyGeneratorPowersOtherGroupsSimplex = false;
    carAdditionalC4RiserBoards.groupInterconnect = false;
    carAdditionalC4RiserBoards.hallCallSecurity = false;
    carAdditionalC4RiserBoards.moreThanTwoHallNetworks = false;
}

export function updateHydraulicFieldVisibility(carHydraulicField: ICarHydraulicFieldView, allowChangeValues: boolean = true) {
    if (carHydraulicField.car.isHydraulic()) {
        carHydraulicField.hide = false;
    } else {
        carHydraulicField.hide = true;
        if (allowChangeValues) {
            resetHydraulicFields(carHydraulicField);
        }
    }
}

function resetHydraulicFields(carHydraulicField: ICarHydraulicFieldView) {
    carHydraulicField.dualSoftStarts = false;
    carHydraulicField.hydroEvolved = false;
    carHydraulicField.motorLeads = '';
    carHydraulicField.motorLeadsAssume = false;
    carHydraulicField.ropedHydro = false;
    carHydraulicField.starter = '';
    carHydraulicField.starterAssume = false;
    carHydraulicField.car.carSmartriseFeature.batteryLoweringDevice = false;
    carHydraulicField.car.carSmartriseFeature.loadWeighingHydro = false;
}

export function updateTractionFieldVisibility(carTractionField: ICarTractionFieldView, allowChangeValues: boolean = true) {

    if (carTractionField.car.isTraction()) {
        carTractionField.hide = false;
    } else {
        carTractionField.hide = true;

        if (allowChangeValues) {
            resetTractionFields(carTractionField);
        }
    }
}


function resetTractionFields(carTractionField: ICarTractionFieldView) {
    carTractionField.newMotorProvidedBySmartrise = false;
    carTractionField.v2Traction = false;
    carTractionField.c4 = false;
    carTractionField.coupler = false;
    carTractionField.emirfiFilter = false;
    carTractionField.governorResetBox = false;
    carTractionField.harmonicFilter = false;
    carTractionField.encoder = false;
    carTractionField.isoTransformer = false;
    carTractionField.regenKit = false;
    carTractionField.lineReactor = false;
    carTractionField.madFixtures = false;
    carTractionField.motorLocation = '';
    carTractionField.motorType = '';
    carTractionField.motorMount = '';
    carTractionField.motorProvider = '';
    carTractionField.motorRPM = null;
    carTractionField.driveModel = '';
    carTractionField.batteryRescue = '';
}

export function updateC4RiserBoardsVisibilityOnQuoteLevel(ctx: BusinessContext, allowChangeValues: boolean = true) {
    let hideC4RiserBoards = true;

    ctx.quote.cars.forEach(car => {
        updateC4RiserBoardsVisibility(car.carAdditionalC4RiserBoards, allowChangeValues);
        hideC4RiserBoards = hideC4RiserBoards && car.carAdditionalC4RiserBoards.hide;
        ctx.actions.updateVisibiltyStatus(car.carAdditionalC4RiserBoards, car.carAdditionalC4RiserBoards.hide);
    });

    ctx.quote.hideC4RiserBoards = hideC4RiserBoards;
}

export function updateHydraulicFieldVisibilityOnQuoteLevel(ctx: BusinessContext, allowChangeValues: boolean = true) {
    let hideHydraulic = true;
    ctx.quote.cars.forEach(car => {
        updateHydraulicFieldVisibility(car.carHydraulicField, allowChangeValues);
        hideHydraulic = hideHydraulic && car.carHydraulicField.hide;
        ctx.actions.updateVisibiltyStatus(car.carHydraulicField, car.carHydraulicField.hide);
    });
    ctx.quote.hideHydraulic = hideHydraulic;
}

export function updateTractionFieldVisibilityOnQuoteLevel(ctx: BusinessContext, allowChangeValues: boolean = true) {
    let hideTraction = true;

    ctx.quote.cars.forEach(car => {
        updateTractionFieldVisibility(car.carTractionField, allowChangeValues);
        hideTraction = hideTraction && car.carTractionField.hide;
        ctx.actions.updateVisibiltyStatus(car.carTractionField, car.carTractionField.hide);
    });

    ctx.quote.hideTraction = hideTraction;
}

export function selectCablesDatasource(lookupData: IQuoteLookupDataView, carSmartriseFeature: ICarSmartriseFeatureView) {
    if (carSmartriseFeature.car.isTraction() && carSmartriseFeature.car.carTractionField.c4) {
        carSmartriseFeature.travelerCables = lookupData.c4TravelerCables;
        carSmartriseFeature.hoistwayCables = lookupData.c4HoistwayCables;
    } else if (carSmartriseFeature.car.isTraction() && carSmartriseFeature.car.carTractionField.v2Traction) {
        carSmartriseFeature.travelerCables = lookupData.hydroTravelerCables;
        carSmartriseFeature.hoistwayCables = lookupData.hydroHoistwayCables;
    } else if (carSmartriseFeature.car.isHydraulic() && carSmartriseFeature.car.carHydraulicField.hydroEvolved) {
        carSmartriseFeature.travelerCables = lookupData.c4TravelerCables;
        carSmartriseFeature.hoistwayCables = lookupData.c4HoistwayCables;
    } else {
        carSmartriseFeature.travelerCables = lookupData.hydroTravelerCables;
        carSmartriseFeature.hoistwayCables = lookupData.hydroHoistwayCables;
    }

    if (!(carSmartriseFeature.travelerCable && carSmartriseFeature.travelerCables?.some(x => x.value === carSmartriseFeature.travelerCable))) {
        carSmartriseFeature.travelerCable = '';
    }

    if (!(carSmartriseFeature.hoistwayCable && carSmartriseFeature.hoistwayCables?.some(x => x.value === carSmartriseFeature.hoistwayCable))) {
        carSmartriseFeature.hoistwayCable = '';
    }
}

export function selectDriveModelDatasource(lookupData: IQuoteLookupDataView, carTractionField: ICarTractionFieldView) {
    if (carTractionField.car.isDCTraction()) {
        carTractionField.driveModels = lookupData.dcTractionDriveModels;
    } else if (carTractionField.car.isACTraction()) {
        carTractionField.driveModels = lookupData.acTractionDriveModels;
    }
    if (!(carTractionField.driveModel && carTractionField.driveModels?.some(x => x.value === carTractionField.driveModel))) {
        carTractionField.driveModel = '';
    }
}

export function updateAssumeStatus(car: ICarView) {
    if (car.controllerType === 'Hydraulic') {
        return;
    }

    if (isEmptyValue(car.speedFPM)
        || isEmptyValue(car.motorHP)
        || isEmptyValue(car.capacity)) {
        car.speedFPMAssume = false;
        car.motorHPAssume = false;
        car.capacityAssume = false;
    }
}

export function updateMotorVolts(
    car: ICarView,
    lookup: IQuoteLookupDataView,
    ctx: BusinessContext,
    allowChangeValues: boolean = true) {

    car.motorVoltsInfoMessage = getMotorVoltsInfoMessage(car);

    updateMotorVoltsAssume(car);
    updateMotorVoltsAssumable(car);

    if (car.isACTraction() && car.carTractionField.isGearless() && car.carTractionField.isMRL()) {
        car.motorVoltsAssumedValue = lookup.getAssumedMotorVoltsFromTDI200MiniGearless1stSection(car.capacity, car.speedFPM);
        if (car.motorVoltsAssume && allowChangeValues) {
            if (car.motorVoltsAssumedValue === null) {
                car.motorVoltsAssume = false;
                ctx.actions.errorMessage('Assumed Motor Volts cannot be found based on the Capacity and Speed values');
                return;
            }
            car.motorVolts = car.motorVoltsAssumedValue;
        }
        return;
    }

    if (
        car.isACTraction() &&
        car.carTractionField.isGearless() &&
        car.carTractionField.isOverhead() &&
        !car.isMainLineVoltageEmpty()
    ) {
        car.motorVoltsAssumedValue = lookup.getAssumedMotorVoltsFromTDI200MiniGearlessOtherSections(car.capacity, car.speedFPM, Number(car.mainLineVoltage));
        if (car.motorVoltsAssume && allowChangeValues) {
            if (car.motorVoltsAssumedValue === null) {
                car.motorVoltsAssume = false;
                ctx.actions.errorMessage('Assumed Motor Volts cannot be found based on the Capacity and Speed values');
                return;
            }
            car.motorVolts = car.motorVoltsAssumedValue;
        }
        return;
    }

    if (car.isHydraulic()) {
        if (car.motorVoltsAssume) {
            if (!car.mainLineVoltage) {
                car.motorVoltsAssume = false;
            } else {
                if (allowChangeValues) {
                    car.motorVoltsAssumedValue = Number(car.mainLineVoltage);
                    if (car.motorVoltsAssume && allowChangeValues) {
                        car.motorVolts = car.motorVoltsAssumedValue;
                    }
                }
            }
        }
        return;
    }

    return;
}

function updateMotorVoltsAssume(car: ICarView) {

    if (car.isACTraction() && car.carTractionField.isGearless()) {
        if (car.carTractionField.isMotorLocationOrMotorTypeEmpty()) {
            car.motorVoltsAssume = false;
            return;
        }

        if (car.isCapacityOrSpeedEmpty()) {
            car.motorVoltsAssume = false;
            return;
        }
    }

    if (car.isACTraction() && car.carTractionField.isGeared()) {
        car.motorVoltsAssume = false;
    }

    if (car.carTractionField.isGearless() && car.carTractionField.isOverhead()) {
        if (car.isMainLineVoltageEmpty()) {
            car.motorVoltsAssume = false;;
            return;
        }
    }
}

function updateMotorVoltsAssumable(car: ICarView) {

    car.motorVoltsAssumable = (
        car.isACTraction() &&
        car.carTractionField.isGearless() &&
        car.carTractionField.isMRL()
    ) || (
            car.isACTraction() &&
            car.carTractionField.isGearless() &&
            car.carTractionField.isOverhead()/* &&
            !car.isMainLineVoltageEmpty()*/
        ) || (
            car.isHydraulic()
        );

    if (!car.motorVoltsAssumable) {
        car.motorVoltsAssume = false;
        return;
    }
}

export function updateMotorHP(
    car: ICarView,
    lookup: IQuoteLookupDataView,
    ctx: BusinessContext,
    allowChangeValues: boolean = true) {

    updateEstimatedMotorHP(car);

    updateMotorHPAssumable(car);

    //TODO: The inner functions to be extracted as functions on class level
    //later on
    const assumeHydraulic = (speed, capacity) => {
        let exHP = null;

        if (speed == null || capacity == null) {
return;
}

        exHP = +(speed * capacity / 10000).toFixed(0);

        if (exHP < 5) {
            exHP = 5;
        }

        if (exHP > 100) {
            exHP = 100;
        }
        return exHP;
    };

    const assumeForHydraulic = () => {
        car.motorHPAssumedValue = assumeHydraulic(car.speedFPM, car.capacity);
        if (car.motorHPAssume && allowChangeValues) {
            if (car.motorHPAssumedValue === null) {
                car.motorHPAssume = false;
                car.motorHPWarningMessage = null;
                ctx.actions.errorMessage('Assumed Motor HP cannot be found based on the Capacity and Speed values');
                return;
            }
            car.motorHP = car.motorHPAssumedValue;
        }
    };

    const assumeForGearedOverhead = () => {
        car.motorHPAssumedValue = lookup.getAssumedHPFromHorsePowerRatingForOverheadTraction(car.capacity, car.speedFPM);
        if (car.motorHPAssume && allowChangeValues) {
            if (car.motorHPAssumedValue === null) {
                car.motorHPAssume = false;
                car.motorHPWarningMessage = null;
                ctx.actions.errorMessage('Assumed Motor HP cannot be found based on the Capacity and Speed values');
            } else {
                car.motorHP = car.motorHPAssumedValue;
            }
        }
    };

    const assumeForGearedBasement = () => {
        car.motorHPAssumedValue = lookup.getAssumedHPFromBasementHPChart(car.capacity, car.speedFPM);
        if (car.motorHPAssume && allowChangeValues) {
            if (car.motorHPAssumedValue === null) {
                car.motorHPAssume = false;
                car.motorHPWarningMessage = null;
                ctx.actions.errorMessage('Assumed Motor HP cannot be found based on the Capacity and Speed values');
            } else {
                car.motorHP = car.motorHPAssumedValue;
            }
        }
    };

    const assumeForGearlessMachineRoomLess = () => {
        car.motorHPAssumedValue = lookup.getAssumedHPFromTDI200MiniGearless1stSection(car.capacity, car.speedFPM);
        if (car.motorHPAssume && allowChangeValues) {
            if (car.motorHPAssumedValue === null) {
                car.motorHPAssume = false;
                car.motorHPWarningMessage = null;
                ctx.actions.errorMessage('Assumed Motor HP cannot be found based on the Capacity and Speed values');
            } else {
                car.motorHP = car.motorHPAssumedValue;
            }
        }
    };

    const assumeForGearlessOverhead = () => {
        car.motorHPAssumedValue = lookup.getAssumedHPFromTDI200MiniGearlessOtherSections(car.capacity, car.speedFPM, Number(car.mainLineVoltage));
        if (car.motorHPAssume && allowChangeValues) {
            if (car.motorHPAssumedValue === null) {
                car.motorHPAssume = false;
                car.motorHPWarningMessage = null;
                ctx.actions.errorMessage('Assumed Motor HP cannot be found based on the Capacity and Speed values');
            } else {
                car.motorHP = car.motorHPAssumedValue;
            }
        }
    };


    if (car.isACTraction() && car.carTractionField.isMotorLocationOrMotorTypeEmpty()) {
        car.unAssumeMotorHP();
        return;
    }

    if (car.isACTraction() && car.isCapacityOrSpeedEmpty()) {
        car.unAssumeMotorHP();
        return;
    }

    if (car.carTractionField.isGearless() && car.carTractionField.isOverhead()) {
        if (car.isMainLineVoltageEmpty()) {
            car.unAssumeMotorHP();
            return;
        }
    }

    if (car.isHydraulic()) {
        assumeForHydraulic();
    }

    if (
        car.isACTraction() &&
        car.carTractionField.isGeared() &&
        car.carTractionField.isOverhead()
    ) {
        assumeForGearedOverhead();
    }

    if (
        car.isACTraction() &&
        car.carTractionField.isGeared() &&
        car.carTractionField.isBasement()
    ) {
        assumeForGearedBasement();
    }

    if (
        car.isACTraction() &&
        car.carTractionField.isGearless() &&
        car.carTractionField.isMRL()
    ) {
        assumeForGearlessMachineRoomLess();
    }

    if (
        car.isACTraction() &&
        car.carTractionField.isGearless() &&
        car.carTractionField.isOverhead() &&
        !car.isMainLineVoltageEmpty()
    ) {
        assumeForGearlessOverhead();
    }
}

export function updateMotorHPAssumable(car: ICarView) {

    car.motorHPAssumable = (
        car.isHydraulic()
    ) || (
            car.isACTraction() &&
            car.carTractionField.isGeared() &&
            car.carTractionField.isOverhead()
        ) || (
            car.isACTraction() &&
            car.carTractionField.isGeared() &&
            car.carTractionField.isBasement()
        ) || (
            car.isACTraction() &&
            car.carTractionField.isGearless() &&
            car.carTractionField.isMRL()
        ) || (
            car.isACTraction() &&
            car.carTractionField.isGearless() &&
            car.carTractionField.isOverhead() /*&&
            !car.isMainLineVoltageEmpty()*/
        );

    if (!car.motorHPAssumable) {
        car.motorHPAssume = false;
    }
}

export function updateSpeed(car: ICarView) {

    if (car.isHydraulic()) {
        car.speedFPMAssumable = true;

        if (car.motorHP == null || car.capacity == null) {
return null;
}

        let exFpm = +(car.motorHP / car.capacity * 10000).toFixed(0);

        if (exFpm < 10) {
            exFpm = 10;
        }

        if (exFpm > 1400) {
            exFpm = 1400;
        }

        car.speedFPMAssumedValue = exFpm;
    } else {
        car.speedFPMAssumable = false;
        car.speedFPMAssume = false;
    }
}

export function updateCapacity(car: ICarView) {

    if (car.isHydraulic()) {
        car.capacityAssumable = true;

        if (car.motorHP == null || car.speedFPM == null) {
return null;
}

        let exCapacity = +(car.motorHP * 10000 / car.speedFPM).toFixed(0);

        if (exCapacity < 500) {
            exCapacity = 500;
        }

        if (exCapacity > 20000) {
            exCapacity = 20000;
        }

        car.capacityAssumedValue = exCapacity;
    }
}

export function updateMotorFLA(
    car: ICarView,
    lookup: IQuoteLookupDataView,
    ctx: BusinessContext,
    allowChangeValues: boolean = true) {

    updateMotorFLAAssumable(car);
    updateMotorFLAAssume(car);

    if (
        car.isACTraction() &&
        car.carTractionField.isGearless() &&
        car.carTractionField.isMRL()
    ) {

        car.fullLoadAmpsAssumedValue = lookup.getAssumedMotorFLAFromTDI200MiniGearless1stSection(car.capacity, car.speedFPM);
        if (car.fullLoadAmpsAssume && allowChangeValues) {
            if (car.fullLoadAmpsAssumedValue === null) {
                car.fullLoadAmpsAssume = false;
                ctx.actions.errorMessage('Assumed Motor FLA cannot be found based on the Capacity and Speed values');
                return;
            }
            car.fullLoadAmps = car.fullLoadAmpsAssumedValue;
        }
        return;
    }

    if (
        car.isACTraction() &&
        car.carTractionField.isGearless() &&
        car.carTractionField.isOverhead() &&
        !car.isMainLineVoltageEmpty()
    ) {
        car.fullLoadAmpsAssumedValue = lookup.getAssumedMotorFLAFromTDI200MiniGearlessOtherSections(car.capacity, car.speedFPM, Number(car.mainLineVoltage));
        if (car.fullLoadAmpsAssume && allowChangeValues) {
            if (car.fullLoadAmpsAssumedValue === null) {
                car.fullLoadAmpsAssume = false;
                ctx.actions.errorMessage('Assumed Motor FLA cannot be found based on the Capacity and Speed values');
                return;
            }
            car.fullLoadAmps = car.fullLoadAmpsAssumedValue;
        }
        return;
    }

    if (
        car.isACTraction() &&
        car.carTractionField.isGeared() &&
        !car.carTractionField.isMRL()
    ) {

        const mockedMotorRPM = mockMotorRPM(car.carTractionField.motorRPM);

        car.fullLoadAmpsAssumedValue = lookup.getAssumedMotorFLAFromHWVVVFHoistMotorDataHPVoltsAndAmps(car.motorHP, Number(car.motorVolts), mockedMotorRPM);
        if (car.fullLoadAmpsAssume && allowChangeValues) {
            if (car.fullLoadAmpsAssumedValue === null) {
                car.fullLoadAmpsAssume = false;
                ctx.actions.errorMessage('Assumed Motor FLA cannot be found based on the Motor HP and Motor Volts values');
                return;
            }
            car.fullLoadAmps = car.fullLoadAmpsAssumedValue;
        }
        return;
    }

    // if (
    //     car.isACTraction() &&
    //     car.carTractionField.isGeared() &&
    //     !car.carTractionField.isMRL() &&
    //     car.motorVolts <= 480
    // ) {
    //     car.fullLoadAmpsAssumedValue = lookup.getAssumedMotorFLAFromHWVVVFHoistMotorDataHPVoltsAndAmps(car.motorHP, Number(car.motorVolts), car.carTractionField.motorRPM);
    //     if (car.fullLoadAmpsAssume && allowChangeValues) {
    //         if (car.fullLoadAmpsAssumedValue === null) {
    //             car.fullLoadAmpsAssume = false;
    //             ctx.actions.errorMessage('Assumed Motor FLA cannot be found based on the Motor HP and Motor Volts values');
    //             return;
    //         }
    //         car.fullLoadAmps = car.fullLoadAmpsAssumedValue;
    //     }
    //     return;
    // }

    // if (
    //     car.isACTraction() &&
    //     car.carTractionField.isGeared() &&
    //     !car.carTractionField.isMRL() &&
    //     (car.motorVolts > 480)
    // ) {
    //     car.fullLoadAmpsAssumedValue = lookup.getAssumedMotorFLAFromHWVVVFHoistMotorDataHPVoltsAndAmps575V(car.motorHP, Number(car.motorVolts));
    //     if (car.fullLoadAmpsAssume && allowChangeValues) {
    //         if (car.fullLoadAmpsAssumedValue === null) {
    //             car.fullLoadAmpsAssume = false;
    //             ctx.actions.errorMessage('Assumed Motor FLA cannot be found based on the Motor HP and Motor Volts values');
    //             return;
    //         }
    //         car.fullLoadAmps = car.fullLoadAmpsAssumedValue;
    //     }
    //     return;
    // }
}

function mockMotorRPM(motorRPM?: number) {
    if (motorRPM === 0) {
        return motorRPM;
    }

    if (!motorRPM) {
        return 1200;
    }

    return motorRPM;
}

function updateMotorFLAAssumable(car: ICarView) {

    car.fullLoadAmpsAssumable = (
        car.isACTraction() &&
        car.carTractionField.isGearless() &&
        car.carTractionField.isMRL()
    ) ||
        (
            car.isACTraction() &&
            car.carTractionField.isGearless() &&
            car.carTractionField.isOverhead()
        ) ||
        (
            car.isACTraction() &&
            car.carTractionField.isGeared() &&
            (!car.carTractionField.isMRL() && car.carTractionField.hasMotorLocation())
        );

    if (!car.fullLoadAmpsAssumable) {
        car.fullLoadAmpsAssume = false;
    }
}

function updateMotorFLAAssume(car: ICarView) {
    if (car.isACTraction()) {

        if (car.carTractionField.isGearless() && car.carTractionField.isOverhead()) {
            if (car.isMainLineVoltageEmpty()) {
                car.unAssumeFullLoadAmps();
                return true;
            }
        }

        if (!car.carTractionField.hasMotorType()) {
            car.unAssumeFullLoadAmps();
            return true;
        }

        if (car.carTractionField.isGeared()) {
            if (car.isMotorHPOrMotorVoltsEmpty()) {
                car.unAssumeFullLoadAmps();
                return true;
            }
        }

        if (car.carTractionField.isGearless()) {
            if (!car.carTractionField.hasMotorLocation()) {
                car.unAssumeFullLoadAmps();
                return true;
            }

            if (car.isCapacityOrSpeedEmpty()) {
                car.unAssumeFullLoadAmps();
                return true;
            }
        }

    }
    return false;
}

export function updateAIParking(carManagementSystem: ICarManagementSystemView) {
    carManagementSystem.aiParkingAvailable = carManagementSystem.car.isHydraulic()
        || (carManagementSystem.car.isTraction() && carManagementSystem.car.carTractionField.v2Traction);

    if (!carManagementSystem.aiParkingAvailable) {
        carManagementSystem.aiParking = false;
    }
}

export function updateCarTitle(lookupData: IQuoteLookupDataView, car: ICarView) {

    const group = lookupData.groups.filter(x => x.value === car.group);
    if (group.length > 0) {
        if (group[0].description && car.carLabel) {
            car.displayName = group[0].description + ' - ' + car.carLabel;
        } else if (group[0].description && !car.carLabel) {
            car.displayName = group[0].description;
        } else if (!group[0].description && car.carLabel) {
            car.displayName = car.carLabel;
        }
    } else {
        car.displayName = car.carLabel;
    }
}

export function updateGroupRedundancy(carSpecialField: ICarSpecialFieldView) {

    if (!carSpecialField.car.group) {
        carSpecialField.groupRedundancyIsClickable = false;
        carSpecialField.groupRedundancy = false;
        return;
    }

    carSpecialField.groupRedundancyIsClickable = carSpecialField.car.group !== 'Simplex';

    if (!carSpecialField.groupRedundancyIsClickable) {
        carSpecialField.groupRedundancy = false;
    }
}

export function updateInterfaceToDestinationDispatch(carProvision: ICarProvisionView) {

    if (!carProvision.car.group) {
        carProvision.interfaceToDestinationDispatchIsClickable = false;
        carProvision.interfaceToDestinationDispatch = false;
        return;
    }

    carProvision.interfaceToDestinationDispatchIsClickable = carProvision.car.group !== 'Simplex';
    if (!carProvision.interfaceToDestinationDispatchIsClickable) {
        carProvision.interfaceToDestinationDispatch = false;
    }
}

export function updateTravelerCable(smartriseFeature: ICarSmartriseFeatureView) {
    if (smartriseFeature.car.hasControllerType()) {
        smartriseFeature.travelerCableAvailable = true;
        if (!smartriseFeature.travelerCableExistsInTravelerCablesDatasource()) {
            smartriseFeature.travelerCable = '';
        }
    } else {
        smartriseFeature.travelerCableAvailable = false;
    }
}

export function updateHoistwayCable(smartriseFeature: ICarSmartriseFeatureView) {
    if (smartriseFeature.car.hasControllerType()) {
        smartriseFeature.hoistwayCableAvailable = true;
        if (!smartriseFeature.hoistwayCableExistsInHoistwayCablesDatasource()) {
            smartriseFeature.hoistwayCable = '';
        }
    } else {
        smartriseFeature.hoistwayCableAvailable = false;
    }
}

export function updateNewMotorFieldsAvailability(carTractionField: ICarTractionFieldView) {
    carTractionField.motorProviderAvailable = carTractionField.newMotorProvidedBySmartrise;
    carTractionField.motorMountAvailable = carTractionField.newMotorProvidedBySmartrise;
    carTractionField.motorRPMAvailable = carTractionField.newMotorProvidedBySmartrise;
    carTractionField.couplerAvailable = carTractionField.newMotorProvidedBySmartrise;
    carTractionField.encoderAvailable = carTractionField.newMotorProvidedBySmartrise;
}

export function updateTravelerLength(smartriseFeature: ICarSmartriseFeatureView) {
    if (!smartriseFeature.car.stops) {

        smartriseFeature.travelerLengthInfoMessage = null;
        smartriseFeature.travelerLengthAssume = false;
        return;
    }

    const assumedValue = smartriseFeature.car.stops * 15;

    smartriseFeature.travelerLengthInfoMessage = `Traveler Length equals to ${assumedValue} will be assumed`;
    smartriseFeature.travelerLengthAssumedValue = assumedValue;

    if (smartriseFeature.travelerLengthAssume) {
        smartriseFeature.travelerLength = assumedValue;
    }
}

export function updateHoistwayLength(smartriseFeature: ICarSmartriseFeatureView) {
    if (!smartriseFeature.car.stops) {

        smartriseFeature.hoistwayLengthInfoMessage = null;
        smartriseFeature.hoistwayLengthAssume = false;
        return;
    }

    const assumedValue = smartriseFeature.car.stops * 15;

    smartriseFeature.hoistwayLengthInfoMessage = `Hoistway Length equals to ${assumedValue} will be assumed`;
    smartriseFeature.hoistwayLengthAssumedValue = assumedValue;

    if (smartriseFeature.hoistwayLengthAssume) {
        smartriseFeature.hoistwayLength = assumedValue;
    }
}

export function updateLandingSystemLengthOfTravel(carSmartriseFeature: ICarSmartriseFeatureView) {
    if (!carSmartriseFeature.car.stops) {

        carSmartriseFeature.landingSystemLengthOfTravelInfoMessage = null;
        carSmartriseFeature.landingSystemLengthOfTravelAssume = false;
        return;
    }

    const assumedValue = carSmartriseFeature.car.stops * 15;

    carSmartriseFeature.landingSystemLengthOfTravelInfoMessage = `Landing System Length of Travel equals to ${assumedValue} will be assumed`;
    carSmartriseFeature.landingSystemLengthOfTravelAssumedValue = assumedValue;

    if (carSmartriseFeature.landingSystemLengthOfTravelAssume) {
        carSmartriseFeature.landingSystemLengthOfTravel = assumedValue;
    }
}

export function fillCarDefaultValuesBasedOnControllerType(car: ICarView, defaultCar: ICarView) {

    car.capacity = replaceWithDefault(car.capacity, defaultCar.capacity);
    car.motorHP = replaceWithDefault(car.motorHP, defaultCar.motorHP);
    car.speedFPM = replaceWithDefault(car.speedFPM, defaultCar.speedFPM);
    car.capacity = replaceWithDefault(car.capacity, defaultCar.capacity);
    car.motorVolts = replaceWithDefault(car.motorVolts, defaultCar.motorVolts);
    car.fullLoadAmps = replaceWithDefault(car.fullLoadAmps, defaultCar.fullLoadAmps);
    car.stops = replaceWithDefault(car.stops, defaultCar.stops);
    car.openings = replaceWithDefault(car.openings, defaultCar.openings);

    fillTractionFieldsDefaultValuesBasedOnControllerType(car.carTractionField, defaultCar.carTractionField);
    fillAdditionalC4RiserBoardsFieldsBasedOnControllerType(car.carAdditionalC4RiserBoards, defaultCar.carAdditionalC4RiserBoards);
    fillHydraulicFieldsDefaultValuesBasedOnControllerType(car.carHydraulicField, defaultCar.carHydraulicField);
    fillSmartriseFeatureFieldsDefaultValuesBasedOnControllerType(car.carSmartriseFeature, defaultCar.carSmartriseFeature);
    fillDoorFeatureFieldsDefaultValuesBasedOnControllerType(car.carDoorFeature, defaultCar.carDoorFeature);
    fillAdditionalFeaturesDefaultValuesBasedOnControllerType(car.additionalFeature, defaultCar.additionalFeature);
    fillProvisionDefaultValuesBasedOnControllerType(car.carProvision, defaultCar.carProvision);
    fillManagementSystemDefaultValuesBasedOnControllerType(car.carManagementSystem, defaultCar.carManagementSystem);
    fillSpecialFieldDefaultValuesBasedOnControllerType(car.carSpecialField, defaultCar.carSpecialField);
}

function fillAdditionalC4RiserBoardsFieldsBasedOnControllerType(
    carAdditionalC4RiserBoards: ICarAdditionalC4RiserBoardsView,
    defaultCarAdditionalC4RiserBoards: ICarAdditionalC4RiserBoardsView) {
    carAdditionalC4RiserBoards.emergencyGeneratorPowersOtherGroupsSimplex = replaceWithDefault(carAdditionalC4RiserBoards.emergencyGeneratorPowersOtherGroupsSimplex, defaultCarAdditionalC4RiserBoards.emergencyGeneratorPowersOtherGroupsSimplex);
    carAdditionalC4RiserBoards.groupInterconnect = replaceWithDefault(carAdditionalC4RiserBoards.groupInterconnect, defaultCarAdditionalC4RiserBoards.groupInterconnect);
    carAdditionalC4RiserBoards.hallCallSecurity = replaceWithDefault(carAdditionalC4RiserBoards.hallCallSecurity, defaultCarAdditionalC4RiserBoards.hallCallSecurity);
    carAdditionalC4RiserBoards.moreThanTwoHallNetworks = replaceWithDefault(carAdditionalC4RiserBoards.moreThanTwoHallNetworks, defaultCarAdditionalC4RiserBoards.moreThanTwoHallNetworks);
}

function fillTractionFieldsDefaultValuesBasedOnControllerType(carTractionField: ICarTractionFieldView, defaultCarTractionField: ICarTractionFieldView) {
    carTractionField.c4 = replaceWithDefault(carTractionField.c4, defaultCarTractionField.c4);
    carTractionField.coupler = replaceWithDefault(carTractionField.coupler, defaultCarTractionField.coupler);
    carTractionField.emirfiFilter = replaceWithDefault(carTractionField.emirfiFilter, defaultCarTractionField.emirfiFilter);
    carTractionField.governorResetBox = replaceWithDefault(carTractionField.governorResetBox, defaultCarTractionField.governorResetBox);
    carTractionField.harmonicFilter = replaceWithDefault(carTractionField.harmonicFilter, defaultCarTractionField.harmonicFilter);
    carTractionField.encoder = replaceWithDefault(carTractionField.encoder, defaultCarTractionField.encoder);
    carTractionField.isoTransformer = replaceWithDefault(carTractionField.isoTransformer, defaultCarTractionField.isoTransformer);
    carTractionField.regenKit = replaceWithDefault(carTractionField.regenKit, defaultCarTractionField.regenKit);
    carTractionField.lineReactor = replaceWithDefault(carTractionField.lineReactor, defaultCarTractionField.lineReactor);
    carTractionField.madFixtures = replaceWithDefault(carTractionField.madFixtures, defaultCarTractionField.madFixtures);
    carTractionField.motorMount = replaceWithDefault(carTractionField.motorMount, defaultCarTractionField.motorMount);
    carTractionField.motorRPM = replaceWithDefault(carTractionField.motorRPM, defaultCarTractionField.motorRPM);
    carTractionField.driveModel = replaceWithDefault(carTractionField.driveModel, defaultCarTractionField.driveModel);
}

function fillHydraulicFieldsDefaultValuesBasedOnControllerType(carHydraulicField: ICarHydraulicFieldView, defaultCarHydraulicField: ICarHydraulicFieldView) {
    carHydraulicField.dualSoftStarts = replaceWithDefault(carHydraulicField.dualSoftStarts, defaultCarHydraulicField.dualSoftStarts);
    carHydraulicField.hydroEvolved = replaceWithDefault(carHydraulicField.hydroEvolved, defaultCarHydraulicField.hydroEvolved);
    carHydraulicField.motorLeads = replaceWithDefault(carHydraulicField.motorLeads, defaultCarHydraulicField.motorLeads);
    carHydraulicField.ropedHydro = replaceWithDefault(carHydraulicField.ropedHydro, defaultCarHydraulicField.ropedHydro);
}

function fillSmartriseFeatureFieldsDefaultValuesBasedOnControllerType(carSmartriseFeature: ICarSmartriseFeatureView, defaultCarSmartriseFeature: ICarSmartriseFeatureView) {
    carSmartriseFeature.arcFlashProtection = replaceWithDefault(carSmartriseFeature.arcFlashProtection, defaultCarSmartriseFeature.arcFlashProtection);
    carSmartriseFeature.batteryLoweringDevice = replaceWithDefault(carSmartriseFeature.batteryLoweringDevice, defaultCarSmartriseFeature.batteryLoweringDevice);
    carSmartriseFeature.cabinetAirConditioning = replaceWithDefault(carSmartriseFeature.cabinetAirConditioning, defaultCarSmartriseFeature.cabinetAirConditioning);
    carSmartriseFeature.dualCOP = replaceWithDefault(carSmartriseFeature.dualCOP, defaultCarSmartriseFeature.dualCOP);
    carSmartriseFeature.enclosureLegs = replaceWithDefault(carSmartriseFeature.enclosureLegs, defaultCarSmartriseFeature.enclosureLegs);
    carSmartriseFeature.hoistwayLength = replaceWithDefault(carSmartriseFeature.hoistwayLength, defaultCarSmartriseFeature.hoistwayLength);
    carSmartriseFeature.landingSystemLengthOfTravel = replaceWithDefault(carSmartriseFeature.landingSystemLengthOfTravel, defaultCarSmartriseFeature.landingSystemLengthOfTravel);
    carSmartriseFeature.loadWeighingDeviceTraction = replaceWithDefault(carSmartriseFeature.loadWeighingDeviceTraction, defaultCarSmartriseFeature.loadWeighingDeviceTraction);
    carSmartriseFeature.loadWeighingHydro = replaceWithDefault(carSmartriseFeature.loadWeighingHydro, defaultCarSmartriseFeature.loadWeighingHydro);
    carSmartriseFeature.travelerLength = replaceWithDefault(carSmartriseFeature.travelerLength, defaultCarSmartriseFeature.travelerLength);
    //SHOW TO TAREK
    if (defaultCarSmartriseFeature.hoistwayCable === 'Hoistway') {
        if (carSmartriseFeature.car.isHydraulic()) {
            carSmartriseFeature.hoistwayCable = 'Hoistway';
        } else {
            carSmartriseFeature.hoistwayCable = 'C4Hoistway';
        }
    }
    carSmartriseFeature.travelerCable = replaceWithDefault(carSmartriseFeature.travelerCable, defaultCarSmartriseFeature.travelerCable);
}

function fillDoorFeatureFieldsDefaultValuesBasedOnControllerType(carDoorFeature: ICarDoorFeatureView, defaultCarDoorFeature: ICarDoorFeatureView) {
    carDoorFeature.rearDoorPresent = replaceWithDefault(carDoorFeature.rearDoorPresent, defaultCarDoorFeature.rearDoorPresent);
}

function fillAdditionalFeaturesDefaultValuesBasedOnControllerType(carAdditionalFeature: ICarAdditionalFeature, defaultCarAdditionalFeature: ICarAdditionalFeature) {
    carAdditionalFeature.brownOutReset = replaceWithDefault(carAdditionalFeature.brownOutReset, defaultCarAdditionalFeature.brownOutReset);
    carAdditionalFeature.enclosureGFCI = replaceWithDefault(carAdditionalFeature.enclosureGFCI, defaultCarAdditionalFeature.enclosureGFCI);
    carAdditionalFeature.enclosureLight = replaceWithDefault(carAdditionalFeature.enclosureLight, defaultCarAdditionalFeature.enclosureLight);
    carAdditionalFeature.fanAndFilter = replaceWithDefault(carAdditionalFeature.fanAndFilter, defaultCarAdditionalFeature.fanAndFilter);
    carAdditionalFeature.interfaceToEarthquakeOperation = replaceWithDefault(carAdditionalFeature.interfaceToEarthquakeOperation, defaultCarAdditionalFeature.interfaceToEarthquakeOperation);
    carAdditionalFeature.interfaceToEmergencyPower = replaceWithDefault(carAdditionalFeature.interfaceToEmergencyPower, defaultCarAdditionalFeature.interfaceToEmergencyPower);
    carAdditionalFeature.interfaceToVoiceAnnuciator = replaceWithDefault(carAdditionalFeature.interfaceToVoiceAnnuciator, defaultCarAdditionalFeature.interfaceToVoiceAnnuciator);
}

function fillProvisionDefaultValuesBasedOnControllerType(carProvisionView: ICarProvisionView, defaultCarProvisionView: ICarProvisionView) {
    carProvisionView.carCallSecurity = replaceWithDefault(carProvisionView.carCallSecurity, defaultCarProvisionView.carCallSecurity);
    carProvisionView.emtService = replaceWithDefault(carProvisionView.emtService, defaultCarProvisionView.emtService);
    carProvisionView.hallArrivalLanterns = replaceWithDefault(carProvisionView.hallArrivalLanterns, defaultCarProvisionView.hallArrivalLanterns);
    carProvisionView.hospitalService = replaceWithDefault(carProvisionView.hospitalService, defaultCarProvisionView.hospitalService);
    carProvisionView.interfaceToDestinationDispatch = replaceWithDefault(carProvisionView.interfaceToDestinationDispatch, defaultCarProvisionView.interfaceToDestinationDispatch);
    carProvisionView.interfaceToLobbyPanel = replaceWithDefault(carProvisionView.interfaceToLobbyPanel, defaultCarProvisionView.interfaceToLobbyPanel);
    carProvisionView.patientSecurity = replaceWithDefault(carProvisionView.patientSecurity, defaultCarProvisionView.patientSecurity);
    carProvisionView.sabbathOperation = replaceWithDefault(carProvisionView.sabbathOperation, defaultCarProvisionView.sabbathOperation);
    carProvisionView.v2V3HallCallSecurityCat5 = replaceWithDefault(carProvisionView.v2V3HallCallSecurityCat5, defaultCarProvisionView.v2V3HallCallSecurityCat5);
    carProvisionView.vipService = replaceWithDefault(carProvisionView.vipService, defaultCarProvisionView.vipService);
}

function fillManagementSystemDefaultValuesBasedOnControllerType(carManagementSystem: ICarManagementSystemView, defaultCarManagementSystem: ICarManagementSystemView) {
    carManagementSystem.aiParking = replaceWithDefault(defaultCarManagementSystem.aiParking, defaultCarManagementSystem.aiParking);
    carManagementSystem.lobbyMonitoring = replaceWithDefault(defaultCarManagementSystem.lobbyMonitoring, defaultCarManagementSystem.lobbyMonitoring);
    carManagementSystem.remoteMonitoring = replaceWithDefault(defaultCarManagementSystem.remoteMonitoring, defaultCarManagementSystem.remoteMonitoring);
    carManagementSystem.v2BACnet = replaceWithDefault(defaultCarManagementSystem.v2BACnet, defaultCarManagementSystem.v2BACnet);
    carManagementSystem.v2LiftNetReady = replaceWithDefault(defaultCarManagementSystem.v2LiftNetReady, defaultCarManagementSystem.v2LiftNetReady);
    carManagementSystem.v2MachineRoomMonitoringInterface = replaceWithDefault(defaultCarManagementSystem.v2MachineRoomMonitoringInterface, defaultCarManagementSystem.v2MachineRoomMonitoringInterface);
}

function fillSpecialFieldDefaultValuesBasedOnControllerType(carManagementSystem: ICarSpecialFieldView, defaultCarManagementSystem: ICarSpecialFieldView) {
    carManagementSystem.crossRegistration = replaceWithDefault(defaultCarManagementSystem.crossRegistration, defaultCarManagementSystem.crossRegistration);
    carManagementSystem.expansionBoard = replaceWithDefault(defaultCarManagementSystem.expansionBoard, defaultCarManagementSystem.expansionBoard);
    carManagementSystem.groupRedundancy = replaceWithDefault(defaultCarManagementSystem.groupRedundancy, defaultCarManagementSystem.groupRedundancy);
}

function getMotorVoltsInfoMessage(car: ICarView): string {
    if (car.isHydraulic()) {
        return 'Motor Volts equals to Main Line Voltage will be assumed';
    }
    return null;
}
