import { BusinessContext } from '../business-context';
import { isBetween, isEmptyValue } from './business-formulas';
import { EventArg, InstanceView } from '../types';
import { ICarView } from '../../../../../_shared/models/quotes/quote-view-i.model';

export function alwaysRequired(ctx: BusinessContext, instance: InstanceView, arg: EventArg) {
    if (isEmptyValue(arg.newValue)) {
return 'Value is required';
}
    return null;
}

export function consultantNameRequired(ctx: BusinessContext, instance: InstanceView, arg: EventArg) {
    if (!instance.unknownConsultant && isEmptyValue(arg.newValue)) {
        return 'Value is required';
    }
}


export function travelerLengthRequired(ctx: BusinessContext, instance: InstanceView, arg: EventArg) {
    if (instance.travelerCable && isEmptyValue(arg.newValue)) {
        return 'Value is required';
    }
}

export function hoistwayLengthRequired(ctx: BusinessContext, instance: InstanceView, arg: EventArg) {
    if (instance.hoistwayCable && isEmptyValue(arg.newValue)) {
return 'Value is required';
}
}

export function landingSystemLengthOfTravelRequired(ctx: BusinessContext, instance: InstanceView, arg: EventArg) {
    if ((instance.nemaLocation === 'Both' || instance.nemaLocation === 'Hoistway') && !arg.newValue) {
return 'Value is required';
}
}

export function nemaLocationRequired(ctx: BusinessContext, instance: InstanceView, arg: EventArg) {
    if (instance.nemaRating && isEmptyValue(arg.newValue)) {
return 'Value is required';
}
}
export function isBetween1And8(ctx: BusinessContext, instance: InstanceView, arg: EventArg) {
    return isBetween(arg.newValue, 1, 8);
}

export function validateStopsIfInRangeBasedOnControllerType(ctx: BusinessContext, instance: InstanceView, arg: EventArg) {
    if (instance.isTraction()) {
        return isBetween(arg.newValue, 2, 96);
    }

    if (instance.controllerType === 'Hydraulic') {
        return isBetween(arg.newValue, 2, 10);
    }
}

export function validateOpeningsIfInRangeBasedOnControllerType(ctx: BusinessContext, instance: InstanceView, arg: EventArg) {
    if (instance.isTraction()) {
        return isBetween(arg.newValue, 2, 192);
    }

    if (instance.controllerType === 'Hydraulic') {
        return isBetween(arg.newValue, 2, 20);
    }
}

export function isBetween100And600(ctx: BusinessContext, instance: InstanceView, arg: EventArg) {
    return isBetween(arg.newValue, 100, 600);
}

export function validateMotorHPIfInRangeBasedOnControllerType(ctx: BusinessContext, car: ICarView, arg: EventArg) {
    if (car.isHydraulic() || car.isTraction()) {
        return isBetween(arg.newValue, 5, 100);
    }
}

export function isBetween10And1400(ctx: BusinessContext, instance: InstanceView, arg: EventArg) {
    if (instance.isHydraulic() || instance.isTraction()) {
        return isBetween(arg.newValue, 10, 1400);
    }
}

export function validateZeroInCaseOfDCController(ctx: BusinessContext, instance: InstanceView, arg: EventArg) {
    if(instance.isDCTraction()) {
        const number = Number(arg.newValue);
        if(number === 0) {
return 'Value cannot be zero';
}
    }
}

export function isBetween500And20000(ctx: BusinessContext, instance: InstanceView, arg: EventArg) {
    if (instance.isHydraulic() || instance.isTraction()) {
        return isBetween(arg.newValue, 500, 20000);
    }
}

export function isLessThanToday(ctx: BusinessContext, instance: InstanceView, arg: EventArg) {
    if (!arg.newValue) {
        return null;
    }
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (arg.newValue < now) {
        return 'Value cannot be less than today';
    }
    return null;
}

export function hasSpace(ctx: BusinessContext, instance: InstanceView, arg: EventArg) {
    if (!arg.newValue?.toString()?.trim()) {
        return null;
    }

    if (arg.newValue?.toString()?.trim() !== arg.newValue?.toString()) {
        return `This field can't start or end with a blank space`;
    }
    return null;
}
