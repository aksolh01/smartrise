import { BusinessContext } from '../business-context';
import { InstanceView, ChangingEventArg } from '../types';

export function validateV2TractionPreConditions(ctx: BusinessContext, instance: InstanceView, arg: ChangingEventArg) {
    if (arg.newValue) {
        if (instance.c4) {
            arg.handled = true;
            ctx.actions.errorMessage('Cannot check V2 Traction while C4 is checked');
        }
    }
}

export function validateC4PreConditions(ctx: BusinessContext, instance: InstanceView, arg: ChangingEventArg) {
    if (arg.newValue) {
        if (instance.v2Traction) {
            arg.handled = true;
            ctx.actions.errorMessage('Cannot check C4 while V2 Traction is checked');
        }
    }
}

export function validateV2HydraulicPreConditions(ctx: BusinessContext, instance: InstanceView, arg: ChangingEventArg) {
    if (arg.newValue) {
        if (instance.hydroEvolved) {
            arg.handled = true;
            ctx.actions.errorMessage('Cannot check V2 while Hydro Evolved is checked');
            return;
        }
    }
}

export function validateHydroEvolvedPreConditions(ctx: BusinessContext, instance: InstanceView, arg: ChangingEventArg) {
    if (arg.newValue) {
        if (instance.v2) {
            arg.handled = true;
            ctx.actions.errorMessage('Cannot check Hydro Evolved while V2 is checked');
            return;
        }
    }
}
