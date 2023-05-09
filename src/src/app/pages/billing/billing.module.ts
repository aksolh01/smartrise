import { NgModule } from '@angular/core';
import { JoyrideModule } from 'ngx-joyride';

import { ThemeModule } from '../../@theme/theme.module';
import { SharedModule } from '../../_shared/shared.module';
import { ImageService } from '../../services/image.service';
import { InvoiceService } from '../../services/invoice.service';
import { BillingRoutingModule } from './billing-routing.module';
import { routedComponents } from './components';
import { BankAccountService } from '../../services/bank-account.service';
import { EditBankAccountComponent } from './edit-bank-account/edit-bank-account.component';

@NgModule({
    imports: [
        JoyrideModule.forChild(),
        BillingRoutingModule,
        SharedModule,
        ThemeModule,
    ],
    declarations: [
        ...routedComponents,
        EditBankAccountComponent,
    ],
    providers: [
        ImageService,
        InvoiceService,
        BankAccountService,
    ]
})
export class BillingModule { }
