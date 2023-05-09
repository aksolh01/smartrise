import { EventEmitter, Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class QuotingToolValidationService {
    validate = new ReplaySubject<any>();
    pushRules = new ReplaySubject<any>();
    clearsRules = new EventEmitter<void>();
    focus = new EventEmitter<any>();
    errorChanged = new EventEmitter<any>();
    updateCar = new EventEmitter<any>();
    visibilityChanged = new EventEmitter<any>();
    index = 0;

    constructor() { }


    reset() {
        this.validate = new ReplaySubject<any>();
        this.pushRules = new ReplaySubject<any>();
    }


    getIndex(): number {
        this.index = this.index + 1;
        return this.index;
    }

    // registerValidatorComponent(component: IValidatorComponent) {
    //     this._registeredValidatorsComponent[`${component.bindingType}_${component.fieldName}`] = component;
    // }

    // assignValidationsCallback(callbackPacket: any) {
    //     const component = this._registeredValidatorsComponent[`${callbackPacket.field.type.name}_${callbackPacket.field.name}`]
    // as IValidatorComponent;
    //     component.assumeCallbacks = callbackPacket.
    // }

    revalidateAll() {
        setTimeout(() => this.validate.next(null));
    }

    revalidate(instance: any) {
        setTimeout(() =>
            this.validate.next({
                instance
            })
        );
    }

    revalidateField(instance: any, field: string) {
        this.validate.next({
            field,
            instance
        });
    }

    validateAll(callback?: () => void) {
        this.validate.next(null);
        setTimeout(() => {
            callback();
        });
    }

    updateVisibilityStatus(instance: any, hide: boolean) {
        setTimeout(() => this.visibilityChanged.next({ hide, instance }));
    }

    notifySort() {
        setTimeout(() =>
            this.errorChanged.next({ sort: true })
        );
    }
}
