import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceDetailsComponent } from './invoices/invoice-details/invoice-details.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { JobsManagementComponent } from './jobs-management.component';
import { JobDetailsComponent } from './jobs/job-details/job-details.component';
import { JobsListComponent } from './jobs/jobs-list/jobs-list.component';
import { JobFilesListComponent } from './job-files/job-files-list/job-files-list.component';
import { ShipmentsListComponent } from './shipments/shipments-list/shipments-list.component';
import { UploadConfigFileComponent } from './jobs/upload-config-file/upload-config-file.component';

const routes: Routes = [
    {
        path: '',
        component: JobsManagementComponent,
        data: { title: 'JobsManagement' }
    },
    {
        path: 'jobs',
        data: { breadcrumb: { label: 'Jobs' } },
        children: [
            {
                path: '',
                component: JobsListComponent,
                data: { title: 'Jobs' }
            },
            {
                path: ':id',
                component: JobDetailsComponent,
                data: { title: 'Job Details', breadcrumb: { alias: 'jobNumber' } },
            },
        ],
    },
    {
        path: 'shipments',
        data: { title: 'Shipments', breadcrumb: { label: 'Shipments' } },
        children: [
            {
                path: '',
                component: ShipmentsListComponent,
                data: { title: 'Shipments' }
            },
            {
                path: ':id',
                component: JobDetailsComponent,
                data: { title: 'Job Details', breadcrumb: { alias: 'jobNumber' } },
            },
        ],
    },
    {
        path: 'job-files',
        data: { title: 'Job Files', breadcrumb: { label: 'Job Files' } },
        children: [
            {
                path: '',
                component: JobFilesListComponent,
                data: { title: 'Job Files' }
            },
            {
                path: ':id',
                component: JobDetailsComponent,
                data: { title: 'Job Details', breadcrumb: { alias: 'jobNumber' } },
            },
        ],
    },
    {
        path: 'invoices',
        data: { breadcrumb: { label: 'Invoices' } },
        children: [
            {
                path: '',
                component: InvoicesComponent,
                data: { title: 'Invoices' }
            },
            {
                path: ':id',
                component: InvoiceDetailsComponent,
                data: { title: 'Invoice Details', breadcrumb: { alias: 'invoiceNumber' } }
            }
        ],
    },
    {
        path: 'generate-passcode',
        data: { title: 'Generate Passcode' },
        children: [
            {
                path: '',
                component: UploadConfigFileComponent,
                data: { title: 'Generate Passcode', breadcrumb: { label: 'Generate Passcode' } },        
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class JobsManagementRoutingModule { }
