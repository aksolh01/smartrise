import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmComponent } from '../_shared/components/confirm/confirm.component';
import { FullscreenBusyComponent } from '../_shared/components/fullscreen-busy/fullscreen-busy.component';
import { TokenService } from './token.service';

@Injectable()
export class MiscellaneousService {

    fullscreenBusyComponent: any;
    modalRef: any;

    constructor(
        private tokenService: TokenService,
        private httpClient: HttpClient,
        private modelService: BsModalService
    ) {

    }

    startFullscreenBusy() {
        this.fullscreenBusyComponent = this.modelService.show<FullscreenBusyComponent>(FullscreenBusyComponent, {
            class: 'fullscreen-busy centered'
        });
    }

    endFullscreenBusy() {
        this.fullscreenBusyComponent?.hide();
    }

    loadImage(image: string) {
        return this.httpClient.get(`assets/images/${image}`, { responseType: 'blob' });
    }

    isSmartriseUser() {
        return (this.tokenService.getProperty('SmartriseUser') === 'True');
    }

    isCustomerUser() {
        return !this.isSmartriseUser();
    }

    isImpersonateMode() {
        return (
            this.tokenService.getProperty('SourceUserId') !== null &&
            this.tokenService.getProperty('SourceUserId') !== undefined &&
            this.tokenService.getProperty('SourceUserId') !== ''
        );
    }

    openConfirmModal(message: string, okCallback?: () => void, cancelCallback?: () => void): void {
        this.modalRef = this.modelService.show<ConfirmComponent>(ConfirmComponent, {
            initialState: { message }
        });

        const subscription = this.modalRef.onHidden.subscribe(() => {
            if (this.modalRef.content.confirmResult && okCallback) {
                okCallback();
            }
            if (!this.modalRef.content.confirmResult && cancelCallback) {
                cancelCallback();
            }
            subscription.unsubscribe();
        });
    }

    clean() {
        this.modalRef?.hide();
    }
}
