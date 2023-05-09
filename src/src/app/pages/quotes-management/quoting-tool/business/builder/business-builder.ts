import { Injectable, EventEmitter } from '@angular/core';
import { QuotingToolValidationService } from '../../../../../services/quoting-tool-validation.service';
import { BusinessContext } from '../business-context';
import { CallbackInfo, FieldInfo, InstanceView, WorkingMode } from '../types';

@Injectable({ providedIn: 'root' })
export class BuisnessBuilder {

    private _action: string;
    private _callBackPackages: CallbackInfo[] = [];

    constructor(private quotingToolValidationService: QuotingToolValidationService, private businessContext: BusinessContext) {
    }

    clear() {
        this._callBackPackages.splice(0, this._callBackPackages.length);
    }

    onChange(type: any, field: string, workingMode: WorkingMode = WorkingMode.Always) {

        this._action = 'change';

        this._checkIfPropertyExistsOnType(type, field);
        this._initializeCallbacksPackage(type, field, workingMode);
        return this;
    }

    onPrecondition(type: any, field: string, workingMode: WorkingMode = WorkingMode.Always) {

        this._action = 'precondition';

        this._checkIfPropertyExistsOnType(type, field);
        this._initializeCallbacksPackage(type, field, workingMode);
        return this;
    }

    onAssume(type: any, field: string, workingMode: WorkingMode = WorkingMode.Always) {

        this._action = 'assume';

        this._checkIfPropertyExistsOnType(type, field);
        this._initializeCallbacksPackage(type, field, workingMode);
        return this;
    }

    onValidate(type: any, field: string, workingMode: WorkingMode = WorkingMode.Always) {

        this._action = 'validate';

        this._checkIfPropertyExistsOnType(type, field);
        this._initializeCallbacksPackage(type, field, workingMode);
        return this;
    }

    private _checkIfPropertyExistsOnType(type: any, field: string) {
    }

    private _initializeCallbacksPackage(type: any, field: string, workingMode: WorkingMode) {
        if (
            this._callBackPackages.length === 0 ||
            (this._callBackPackages.length > 0 && this._callBackPackages[this._callBackPackages.length - 1].functions.length > 0)
        ) {
            this._callBackPackages.push({
                functions: [],
                fields: []
            });
        }

        const newCallBackPackage = this._callBackPackages[this._callBackPackages.length - 1];
        newCallBackPackage.fields.push({
            action: this._action,
            workingMode,
            name: field,
            type
        });
    }

    // call(fn: (context: BusinessContext, instance: IQuoteView | ICarView | ICarAdditionalFeatureView | ICarDoorFeatureView | ICarManagementSystemView | ICarSmartriseFeatureView | ICarSpecialFieldView | ICarHydraulicFieldView, value: any) => void) {
    call(fn: (context: BusinessContext, instance: InstanceView, value: any) => void) {

        if (!this._action) {
            throw new TypeError(`Cannot invoke 'call' before any of 'onChanging', 'onChange' or 'onAssume' is called`);
        }

        if (this._callBackPackages.length === 0) {
            throw new TypeError('No trigger fields set');
        }

        const callBackPackage = this._callBackPackages[this._callBackPackages.length - 1];
        callBackPackage.functions.push(fn);

        this._action = null;

        return this;
    }

    build() {
        this.quotingToolValidationService.clearsRules.next();
        this._callBackPackages.forEach(callbackConfiguration => {
            callbackConfiguration.fields.forEach(field => {
                const wrappingFunctions: any[] = [];
                callbackConfiguration.functions.forEach(fn => {
                    const originalfunction = fn;
                    const workingMode = <WorkingMode>field.workingMode;
                    const wrappingFunction = (instance, eventArgs) => {
                        if (field.action === 'change' && !eventArgs.changed) {
                            return;
                        }
                        if (workingMode === WorkingMode.Always) {
                            return originalfunction(this.businessContext, instance, eventArgs);
                        } else if (workingMode <= this.businessContext.workingMode) {
                            return originalfunction(this.businessContext, instance, eventArgs);
                        }
                    };
                    wrappingFunctions.push(wrappingFunction);
                });

                const callBackPacket = {
                    trigger: field.action,
                    field,
                    functions: wrappingFunctions
                };
                this.quotingToolValidationService.pushRules.next(callBackPacket);
            });
        });
    }
}
