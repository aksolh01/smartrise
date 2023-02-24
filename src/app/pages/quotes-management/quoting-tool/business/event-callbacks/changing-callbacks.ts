import { BusinessContext } from '../business-context';
import { InstanceView, ChangingEventArg } from '../types';

export function validateV2TractionPreConditions(ctx: BusinessContext, instance: InstanceView, arg: ChangingEventArg) {
    if (arg.newValue) {
        if (instance.c4) {
            arg.handled = true;
            ctx.actions.errorMessage('Can not check V2 Traction while C4 is checked');
        }
    }
}

export function validateC4PreConditions(ctx: BusinessContext, instance: InstanceView, arg: ChangingEventArg) {
    if (arg.newValue) {
        if (instance.v2Traction) {
            arg.handled = true;
            ctx.actions.errorMessage('Can not check C4 while V2 Traction is checked');
        }
    }
}
