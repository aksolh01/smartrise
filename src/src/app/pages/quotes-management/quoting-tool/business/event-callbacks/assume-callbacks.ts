import { AssumeEventArg, InstanceView } from '../types';
import { BusinessContext } from '../business-context';
import { getAssumedSpeed, getAssumedCapacity, isEmptyValue } from '../business-core/business-formulas';
import { updateEstimatedMotorHP } from '../business-core/business-rules';
import { ICarSmartriseFeatureView, ICarView } from '../../../../../_shared/models/quotes/quote-view-i.model';

export function reevaluateMainLineVoltageDependentsOnAssume(ctx: BusinessContext, instance: InstanceView, arg: AssumeEventArg) {
    // if (instance.motorVoltsAssume) {
    //     updateMotorVolts({
    //         capacity: instance.capacity,
    //         controllerType: instance.controllerType,
    //         mainLineVoltage: arg.newValue,
    //         motorLocation: instance.carTractionField.motorLocation,
    //         motorType: instance.carTractionField.motorType,
    //         speed: instance.speedFPM,
    //     }, instance, ctx.lookupData);
    // }
}

export function canAssumeFullLoadAmps(ctx: BusinessContext, car: ICarView, arg: AssumeEventArg) {
    if (arg.newValue) {

        if (
            car.isACTraction() &&
            car.carTractionField.isGearless() &&
            car.carTractionField.isMRL()
        ) {
            if (car.isCapacityOrSpeedEmpty()) {
                arg.cancel();
                ctx.actions.errorMessage('Cannot assume Motor FLA while Capacity or Speed is empty');
                return;
            }
            if (car.fullLoadAmpsAssumedValue === null) {
                arg.cancel();
                ctx.actions.errorMessage('Assumed Motor FLA cannot be found based on the Capacity and Speed values');
                return;
            }
        }

        if (
            car.isACTraction() &&
            car.carTractionField.isGearless() &&
            car.carTractionField.isOverhead()
        ) {
            if (car.isCapacityOrSpeedOrMainLineVoltageEmpty()) {
                arg.cancel();
                ctx.actions.errorMessage('Cannot assume Motor FLA while Capacity, Speed or Main Line Voltage is empty');
                return;
            }
            if (car.fullLoadAmpsAssumedValue === null) {
                arg.cancel();
                ctx.actions.errorMessage('Assumed Motor FLA cannot be found based on the Capacity and Speed values');
                return;
            }
        }

        if (
            car.isACTraction() &&
            car.carTractionField.isGeared()
        ) {
            if (car.isMotorHPOrMotorVoltsEmpty()) {
                arg.cancel();
                ctx.actions.errorMessage('Cannot assume Motor FLA while Motor HP or Motor Volts is empty');
                return;
            }
            if (car.fullLoadAmpsAssumedValue === null) {
                arg.cancel();
                ctx.actions.errorMessage('Assumed Motor FLA cannot be found based on the Motor HP and Motor Volts values');
                return;
            }
        }
    }
}

export function canAssumeSpeedFPM(ctx: BusinessContext, instance: ICarView, arg: AssumeEventArg) {
    if (arg.newValue) {
        if (!instance.capacity || !instance.motorHP) {
            arg.cancel();
            ctx.actions.errorMessage('Cannot assume Speed while Capacity or Motor HP is empty');
            return;
        }
        if (instance.capacityAssume || instance.motorHPAssume) {
            arg.cancel();
            ctx.actions.errorMessage('Cannot assume Speed while Capacity or Motor HP is assumed');
            return;
        }
        arg.assumedValue = getAssumedSpeed(instance.motorHP, instance.capacity);
    }
}

export function canAssumeCapacity(ctx: BusinessContext, instance: ICarView, arg: AssumeEventArg) {
    if (arg.newValue) {
        if (!instance.speedFPM || !instance.motorHP) {
            arg.cancel();
            ctx.actions.errorMessage('Cannot assume Capacity while Speed or Motor HP is empty');
            return;
        }
        if (instance.speedFPMAssume || instance.motorHPAssume) {
            arg.cancel();
            ctx.actions.errorMessage('Cannot assume Capacity while Speed or Motor HP is assumed');
            return;
        }
        arg.assumedValue = getAssumedCapacity(instance.motorHP, instance.speedFPM);
    }
}

export function canAssumeMotorHP(ctx: BusinessContext, car: ICarView, arg: AssumeEventArg) {
    if (arg.newValue) {

        if (car.isHydraulic()) {
            if (car.isCapacityOrSpeedEmpty()) {
                arg.cancel();
                ctx.actions.errorMessage('Cannot assume Motor HP while Speed or Capacity is empty');
                return;
            }
            if (car.speedFPMAssume || car.capacityAssume) {
                arg.cancel();
                ctx.actions.errorMessage('Cannot assume Motor HP while Speed or Capacity is assumed');
                return;
            }
        }

        if (
            car.isACTraction() &&
            car.carTractionField.isGeared() &&
            car.carTractionField.isOverhead()
        ) {
            if (car.isCapacityOrSpeedEmpty()) {
                arg.cancel();
                ctx.actions.errorMessage('Cannot assume Motor HP while Speed or Capacity is empty');
                return;
            }
            if (car.motorHPAssumedValue === null) {
                arg.cancel();
                ctx.actions.errorMessage('Assumed Motor HP cannot be found based on the Capacity and Speed values');
                return;
            }
        }

        if (
            car.isACTraction() &&
            car.carTractionField.isGeared() &&
            car.carTractionField.isBasement()
        ) {
            if (car.isCapacityOrSpeedEmpty()) {
                arg.cancel();
                ctx.actions.errorMessage('Cannot assume Motor HP while Speed or Capacity is empty');
                return;
            }
            if (car.motorHPAssumedValue === null) {
                arg.cancel();
                ctx.actions.errorMessage('Assumed Motor HP cannot be found based on the Capacity and Speed values');
                return;
            }
        }

        if (
            car.isACTraction() &&
            car.carTractionField.isGearless() &&
            car.carTractionField.isMRL()
        ) {
            if (car.isCapacityOrSpeedEmpty()) {
                arg.cancel();
                ctx.actions.errorMessage('Cannot assume Motor HP while Speed or Capacity is empty');
                return;
            }
            if (car.motorHPAssumedValue === null) {
                arg.cancel();
                ctx.actions.errorMessage('Assumed Motor HP cannot be found based on the Capacity and Speed values');
                return;
            }
        }

        if (
            car.isACTraction() &&
            car.carTractionField.isGearless() &&
            car.carTractionField.isOverhead()
        ) {
            if (car.isCapacityOrSpeedOrMainLineVoltageEmpty()) {
                arg.cancel();
                ctx.actions.errorMessage('Cannot assume Motor HP while Capacity, Speed or Main Line Voltage is empty');
                return;
            }
            if (car.motorHPAssumedValue === null) {
                arg.cancel();
                ctx.actions.errorMessage('Assumed Motor HP cannot be found based on the Capacity and Speed values');
                return;
            }
        }

        updateEstimatedMotorHP(car);
    }
}

export function canAssumeTravelerLength(ctx: BusinessContext, instance: ICarSmartriseFeatureView, arg: AssumeEventArg) {
    if (arg.newValue) {
        if (!instance.car.stops) {
            arg.cancel();
            ctx.actions.errorMessage('Fill the Stops first');
            return;
        }
    }
}

export function canAssumeHoistwayLength(ctx: BusinessContext, instance: ICarSmartriseFeatureView, arg: AssumeEventArg) {
    if (arg.newValue) {
        if (!instance.car.stops) {
            arg.cancel();
            ctx.actions.errorMessage('Fill the Stops first');
            return;
        }
    }
}

export function canAssumeLandingSystemLengthOfTravel(ctx: BusinessContext, instance: ICarSmartriseFeatureView, arg: AssumeEventArg) {
    if (arg.newValue) {
        if (!instance.car.stops) {
            arg.cancel();
            ctx.actions.errorMessage('Fill the Stops first');
            return;
        }
    }
}

// export function canAssumeMotorFLA(ctx: BusinessContext, instance: InstanceView, arg: AssumeEventArg) {
//     if (arg.newValue) {
//         if (
//             instance.isACTraction() &&
//             !instance.carTractionField.motorType &&
//             !instance.carTractionField.motorLocation
//             )  {
//             arg.cancel();
//             ctx.actions.errorMessage('Fill the Stops first');
//             return;
//         }
//     }
// }

export function canAssumeMotorVolts(ctx: BusinessContext, car: ICarView, arg: AssumeEventArg) {
    if (arg.newValue) {

        if (
            car.isACTraction() &&
            car.carTractionField.isGearless() &&
            car.carTractionField.isMRL()
        ) {
            if (car.isCapacityOrSpeedEmpty()) {
                arg.cancel();
                ctx.actions.errorMessage('Cannot assume Motor Volts while Capacity or Speed is empty');
                return;
            }
            if (car.motorVoltsAssumedValue === null) {
                arg.cancel();
                ctx.actions.errorMessage('Assumed Motor Volts cannot be found based on the Capacity and Speed values');
                return;
            }
        }

        if (
            car.isACTraction() &&
            car.carTractionField.isGearless() &&
            car.carTractionField.isOverhead()
        ) {
            if (car.isCapacityOrSpeedOrMainLineVoltageEmpty()) {
                arg.cancel();
                ctx.actions.errorMessage('Cannot assume Motor Volts while Capacity, Speed or Main Line Voltage is empty');
                return;
            }

            if (car.motorVoltsAssumedValue === null) {
                arg.cancel();
                ctx.actions.errorMessage('Assumed Motor Volts cannot be found based on the Capacity and Speed values');
                return;
            }
        }

        if (car.isHydraulic()) {
            if (!car.mainLineVoltage) {
                arg.cancel();
                ctx.actions.errorMessage('Cannot assume Motor Volts while Main Line Voltage is empty');
                return;
            }
            arg.assumedValue = car.mainLineVoltage;
        }
    }
}
