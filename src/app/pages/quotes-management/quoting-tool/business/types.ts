import { ICarAdditionalFeatureView, ICarDoorFeatureView, ICarHydraulicFieldView, ICarManagementSystemView, ICarProvisionView, ICarSmartriseFeatureView, ICarSpecialFieldView, ICarTractionFieldView, ICarView, IQuoteView } from '../../../../_shared/models/quotes/quote-view-i.model';

export interface EventArg {
    newValue: any;
    oldValue: any;
    changed: boolean;
};

export interface ChangingEventArg {
    newValue: any;
    oldValue: any;
    handled: boolean;
};

export interface AssumeEventArg {
    cancel: () => void;
    item: any;
    newValue: any;
    assumedValue: any;
};

export interface CallbackInfo {
    functions: Function[];
    fields: FieldInfo[];
};

export interface FieldInfo {
    action: string;
    workingMode: WorkingMode;
    name: string;
    type: any;
};

export type InstanceView =
    IQuoteView &
    ICarView &
    ICarAdditionalFeatureView &
    ICarDoorFeatureView &
    ICarHydraulicFieldView &
    ICarTractionFieldView &
    ICarManagementSystemView &
    ICarProvisionView &
    ICarSpecialFieldView &
    ICarSmartriseFeatureView;

export enum WorkingMode {
    Always = -1,
    NotSet = 0,
    Save = 1,
    Generate = 2
}
