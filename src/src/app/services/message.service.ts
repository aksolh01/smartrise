import { Injectable } from '@angular/core';
import { NbToastrService, NbComponentStatus } from '@nebular/theme';
import { environment } from '../../environments/environment';

@Injectable()
export class MessageService {
    private duration = environment.toastMessageShowDuration;
    constructor(private toastrService: NbToastrService) {
    }

    showSuccessMessage(message: string) {
        this.showToast('success', message);
    }

    showWarningMessage(message: string) {
        this.showToast('warning', message);
    }

    showInfoMessage(message: string) {
        this.showToast('info', message);
    }

    showErrorMessage(message: string) {
        this.showToast('danger', message);
    }

    showError(error: any) {
        let message = error?.error?.detail;
        if (message === null) {
            message = error.message;
        }
        this.showToast('danger', message);
    }

    showToast(status: NbComponentStatus, message: string) {
        this.toastrService.show(status, message, {
                status,
                duration: this.duration,
                toastClass: 'toast-message'
        });
    }
}
