import { Injectable } from '@angular/core';
import { NbToastrService, NbComponentStatus, NbIconConfig } from '@nebular/theme';
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
        const iconConfig: NbIconConfig = { icon: "info-outline", pack: 'eva' };
        this.showToast('info', message, iconConfig);
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

    showToast(status: NbComponentStatus, message: string, iconConfig?: any) {
        this.toastrService.show(status, message, {
            status,
            hasIcon: false,
            duration: this.duration,
            toastClass: 'toast-message'
        });
    }
}
