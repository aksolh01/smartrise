import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuotingToolComponent } from './quoting-tool/quoting-tool.component';
import { OpenQuoteDetailsComponent } from './open-quotes/open-quote-details/open-quote-details.component';
import { QuotesManagementComponent } from './quotes-management.component';
import { QuoteDetailsComponent } from './quote-details/quote-details.component';
import { LeaveGuard } from '../../@core/guards/leave.guard';
import { CreateOpenQuoteComponent } from './create-open-quote/create-open-quote.component';
import { QuotesComponent } from './quotes/quotes.component';
import { TaskSyncronizerService } from '../../services/task-syncronizer.service';
import { PromptAccountSelection } from './guards/prompt-account-selection.guard';

const routes: Routes = [
    {
        path: '',
        component: QuotesManagementComponent,
        data: { title: 'QuotesManagement' },
        children: [
            {
                path: 'open-quotes',
                data: { title: 'Open Quotes', breadcrumb: { label: 'Open Quotes', } },
                children: [
                    {
                        path: '',
                        component: QuotesComponent,
                        data: { title: 'Open Quotes' },
                    },
                    {
                        path: 'smartrise',
                        data: { title: 'Open Quote Details', breadcrumb: { skip: true } },
                        children: [{
                            path: ':id',
                            component: OpenQuoteDetailsComponent,
                        }
                        ]
                    },
                    {
                        path: 'customer',
                        data: { title: 'Open Quote Details', breadcrumb: { skip: true } },
                        children: [
                            {
                                path: ':id/view',
                                component: QuoteDetailsComponent,
                                data: { title: 'Quote Details', breadcrumb: { alias: 'quoteName' } },
                            }, {
                                path: ':id',
                                component: QuotingToolComponent,
                                canDeactivate: [LeaveGuard],
                                data: { title: 'Update Quote', breadcrumb: { alias: 'jobName' } },
                            },

                        ]
                    },
                ]
            },
            {
                path: 'request-quote',
                component: CreateOpenQuoteComponent,
                canActivate: [PromptAccountSelection],
                data: { title: 'Create Quote', breadcrumb: { label: 'New Quote', } },
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [
        TaskSyncronizerService
    ]
})
export class QuotesManagementRoutingModule { }
