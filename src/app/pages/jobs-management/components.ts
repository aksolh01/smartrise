import { InvoiceDetailsComponent } from './invoices/invoice-details/invoice-details.component';
import { PaymentsComponent } from './invoices/invoice-details/payments/payments.component';
import { InvoicesActionsComponent } from './invoices/invoices-actions/invoices-actions.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { JobsManagementComponent } from './jobs-management.component';
import { JobBasiicInfoComponent } from './jobs/job-details/job-basiic-info/job-basiic-info.component';
import { JobDetailsComponent } from './jobs/job-details/job-details.component';
import { JobResourcesActionsComponent } from './jobs/job-details/job-resources/job-resources-actions/job-resources-actions.component';
import { JobResourcesComponent } from './jobs/job-details/job-resources/job-resources.component';
import { JobShipmentsComponent } from './jobs/job-details/job-shipments/job-shipments.component';
import { ShipmentTrackingsComponent } from './jobs/job-details/job-shipments/shipment-trackings/shipment-trackings.component';
import { JobActionsComponent } from './jobs/jobs-list/job-actions/job-actions.component';
import { JobsListComponent } from './jobs/jobs-list/jobs-list.component';
import { PendingInfoCellComponent } from './jobs/jobs-list/pending-info-cell.component';
import { JobFilesListActionsComponent } from './job-files/job-files-list/job-files-list-actions/job-files-list-actions.component';
import { JobFilesListComponent } from './job-files/job-files-list/job-files-list.component';
import { ShipmentActionsComponent } from './shipments/shipments-list/shipment-actions/shipment-actions.component';
import { ShipmentsListComponent } from './shipments/shipments-list/shipments-list.component';
import { FileUploaderComponent } from './job-files/file-uploader/file-uploader.component';
import { UploadConfigFileComponent } from './jobs/upload-config-file/upload-config-file.component';
import { JobPasscodesComponent } from './job-passcodes/job-passcodes.component';
import { PasscodeCellComponent } from './jobs/job-details/job-basiic-info/passcode-cell/passcode-cell.component';

const routedShipmentComponents = [
    ShipmentsListComponent,
    ShipmentActionsComponent,
];

const routedJobComponents = [
    JobsListComponent,
    JobDetailsComponent,
    JobResourcesComponent,
    JobBasiicInfoComponent,
    JobShipmentsComponent,
    JobActionsComponent,
    JobResourcesActionsComponent,
    ShipmentTrackingsComponent,
    PendingInfoCellComponent,
];

const routedResourceComponents = [
    JobFilesListComponent,
    JobFilesListActionsComponent,
    FileUploaderComponent
];

const routedInvoiceComponents = [
    InvoicesComponent,
    InvoicesActionsComponent,
    InvoiceDetailsComponent,
    PaymentsComponent
];

export const routedComponents = [
    JobsManagementComponent,
    ...routedJobComponents,
    ...routedShipmentComponents,
    ...routedResourceComponents,
    ...routedInvoiceComponents,
    UploadConfigFileComponent,
    JobPasscodesComponent,
    PasscodeCellComponent
];
