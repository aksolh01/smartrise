import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbAccordionModule,
  NbAutocompleteModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule,
  NbIconModule,
  NbInputModule,
  NbMenuModule,
  NbPopoverModule,
  NbSelectModule,
  NbSpinnerModule,
  NbTabsetModule,
  NbToastrModule,
  NbToggleModule,
  NbTreeGridModule,
} from '@nebular/theme';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { CpCheckboxComponent } from './components/cp-checkbox/cp-checkbox.component';
import { CpDateFilterComponent } from './components/table-filters/cp-date-filter.component';
import { CpDatepickerComponent } from './components/cp-datepicker/cp-datepicker.component';
import { CpFilterComponent } from './components/table-filters/cp-filter.component';
import { CpListFilterComponent } from './components/table-filters/cp-list-filter.component';
import { PagerComponent } from './components/pager/pager.component';
import { PagingHeaderComponent } from './components/paging-header/paging-header.component';
import { RecordsPerPageComponent } from './components/records-per-page/records-per-page.component';
import { TextInputComponent } from './components/text-input/text-input.component';
import { CpBooleanFilterComponent } from './components/table-filters/cp-boolean-filter.component';
import { CpBooleanViewComponent } from './components/table-views/cp-boolean-view.component';
import { NgxShowDirective } from './directives/smr-show.directive';
import { Ng2TableCellComponent } from './components/ng2-table-cell/ng2-table-cell.component';
import { RolesChecklistComponent } from './components/roles-checklist/roles-checklist.component';
import { InfoDialogComponent } from './components/info-dialog/info-dialog.component';
import { MobileFiltersComponent } from './components/mobile-filters/mobile-filters.component';
import { PasswordInputComponent } from './components/password-input/password-input.component';
import { EpicoreIdCellComponent } from './components/epicore-id-cell/epicore-id-cell.component';
import { CpDateTimeFilterComponent } from './components/table-filters/cp-datetime-filter.component';
import { ValuePipe } from './pipes/value.pipe';
import { RegexTestPipe } from './pipes/regex-test.pipe';
import { NbDateFnsDateModule } from '@nebular/date-fns';
import { ResourceTaskStatusCellComponent } from './components/business/status.component';
import { ShipmentStatusCellComponent } from './components/business/shipment-status.component';
import { PermissionDirective } from './directives/permission.directive';
import { AddressFieldComponent } from './components/address-field/address-field.component';
import { AddressComponent } from './components/address/address.component';
import { PartReviewFaultCellComponent } from './components/business/part-review-fault.component';
import { PartReviewActualFaultCounterCellComponent } from './components/business/parts-review-actual-fault-counter.component';
import { JobAlertStatusCellComponent } from './components/business/job-alert-status.component';
import { FileUploadModule } from 'ng2-file-upload';
import { ProfilePictureComponent } from './components/profile-picture/profile-picture.component';
import { AlertSeverityCellComponent } from './components/business/alert-severity.component';
import { NgxSelectAutoWidthDirective } from './directives/smr-select-fullwidth.directive';
import { InformativeCellComponentComponent } from './components/informative-cell-component/informative-cell-component.component';
import { CpNumberFilterComponent } from './components/table-filters/cp-number-filter.component';
import { NumberTableCellComponent } from './components/number-table-cell/number-table-cell.component';
import { NgxButtonComponent } from './components/ngx-button/ngx-button.component';
import { InvoiceDueAmountComponent } from './components/invoice-due-amount/invoice-due-amount.component';
import { BooleanCellComponent } from './components/boolean-cell/boolean-cell.component';
import { InvoiceStatusCellComponent } from './components/invoice-status-cell/invoice-status-cell.component';
import { AgedCellComponent } from './components/aged-cell/aged-cell.component';
import { WaitSpinnerComponent } from './components/wait-spinner/wait-spinner.component';
import { InvoiceAgedCellComponent } from './components/invoice-aged-cell/invoice-aged-cell.component';
import { CpCustomFilterComponent } from './components/table-filters/cp-custom-filter.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DownloadProgressComponent } from './components/download-progress/download-progress.component';
import { IsActiveComponent } from './components/is-active/is-active.component';
import { YesNoCellComponent } from './components/yes-no-cell.component';
import { NgxValidatorDirective } from './directives/validations/ng-validator.directive';
import { NgxRequiredWithTrimDirective } from './directives/validations/required-with-trim.directive';
import { NgxTrimErrorDirective } from './directives/validations/trim-error.directive';
import { UploadFilesComponent } from './components/upload-files/upload-files.component';
import { DndDirective } from './directives/dnd.directive';
import { ProgressComponent } from './components/upload-files/progress/progress.component';
import { ToggleButtonComponent } from './components/toggle-button/toggle-button.component';
import { NgxEmailDirective } from './directives/validations/email.directive';
import { QuoteStatusComponent } from './components/quote-status/quote-status.component';
import { NumberValuePipe } from './pipes/number-value.pipe';
import { FormExitConfirmComponent } from './components/form-exit-confirm/form-exit-confirm.component';
import { Ng2TableHtmlCellComponent } from './components/ng2-table-html-cell/ng2-table-html-cell.component';
import { TaskResultComponent } from './components/task-result/task-result.component';
import { HLinkTableCellComponent } from './components/hlink-table-cell/hlink-table-cell.component';
import { FullscreenBusyComponent } from './components/fullscreen-busy/fullscreen-busy.component';
import { RolesChecklistCellComponent } from './components/roles-checklist-cell/roles-checklist-cell.component';
import { AccountRolesSelectionComponent } from './components/account-roles-selection/account-roles-selection.component';
import { SelectableAccountCellComponent } from './components/selectable-account-cell/selectable-account-cell.component';
import { RemoveAccountCellComponent } from './components/remove-account-cell/remove-account-cell.component';
import { AccountNameCellComponent } from './components/account-name-cell/account-name-cell.component';
import { AccountInfoComponent } from './components/account-info/account-info.component';

@NgModule({
  declarations: [
    TextInputComponent,
    PagerComponent,
    PagingHeaderComponent,
    CpCheckboxComponent,
    ConfirmComponent,
    FormExitConfirmComponent,
    CpDatepickerComponent,
    CpFilterComponent,
    CpCustomFilterComponent,
    CpNumberFilterComponent,
    CpDateTimeFilterComponent,
    CpDateFilterComponent,
    CpListFilterComponent,
    CpBooleanViewComponent,
    CpBooleanFilterComponent,
    RecordsPerPageComponent,
    NgxShowDirective,
    NgxRequiredWithTrimDirective,
    NgxEmailDirective,
    NgxTrimErrorDirective,
    NgxValidatorDirective,
    PermissionDirective,
    NgxSelectAutoWidthDirective,
    DndDirective,
    Ng2TableCellComponent,
    Ng2TableHtmlCellComponent,
    RolesChecklistComponent,
    InfoDialogComponent,
    MobileFiltersComponent,
    PasswordInputComponent,
    EpicoreIdCellComponent,
    ValuePipe,
    NumberValuePipe,
    RegexTestPipe,
    ResourceTaskStatusCellComponent,
    ShipmentStatusCellComponent,
    JobAlertStatusCellComponent,
    AlertSeverityCellComponent,
    PartReviewFaultCellComponent,
    PartReviewActualFaultCounterCellComponent,
    AgedCellComponent,
    InvoiceAgedCellComponent,
    AddressComponent,
    AddressFieldComponent,
    ProfilePictureComponent,
    HLinkTableCellComponent,
    InformativeCellComponentComponent,
    NgxButtonComponent,
    NumberTableCellComponent,
    InvoiceDueAmountComponent,
    BooleanCellComponent,
    InvoiceStatusCellComponent,
    YesNoCellComponent,
    WaitSpinnerComponent,
    InvoiceAgedCellComponent,
    DownloadProgressComponent,
    IsActiveComponent,
    UploadFilesComponent,
    ProgressComponent,
    ToggleButtonComponent,
    QuoteStatusComponent,
    FormExitConfirmComponent,
    TaskResultComponent,
    FullscreenBusyComponent,
    RolesChecklistCellComponent,
    AccountRolesSelectionComponent,
    SelectableAccountCellComponent,
    RemoveAccountCellComponent,
    AccountNameCellComponent,
    AccountInfoComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    // PaginationModule.forRoot(),
    NbToastrModule.forRoot(),
    ModalModule.forChild(),
    NbDatepickerModule,
    NbDateFnsDateModule.forChild({}),
    NbCheckboxModule,
    NbCardModule,
    NbSelectModule,
    NbButtonModule,
    Ng2SmartTableModule,
    TooltipModule,
    NbSpinnerModule,
    NbPopoverModule,
    FileUploadModule,
  ],
  exports: [
    NbTabsetModule,
    NbAccordionModule,
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    NbSelectModule,
    NbToggleModule,
    NbAutocompleteModule,
    NbSpinnerModule,
    NbDatepickerModule,
    NbPopoverModule,
    Ng2SmartTableModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TextInputComponent,
    CpCheckboxComponent,
    CpDatepickerComponent,
    PagerComponent,
    NbMenuModule,
    PaginationModule,
    PagingHeaderComponent,
    CpCustomFilterComponent,
    ConfirmComponent,
    FormExitConfirmComponent,
    CpFilterComponent,
    CpNumberFilterComponent,
    CpDateTimeFilterComponent,
    CpDateFilterComponent,
    CpListFilterComponent,
    RecordsPerPageComponent,
    NgxShowDirective,
    NgxValidatorDirective,
    NgxRequiredWithTrimDirective,
    NgxEmailDirective,
    NgxTrimErrorDirective,
    PermissionDirective,
    NgxSelectAutoWidthDirective,
    DndDirective,
    CpBooleanFilterComponent,
    CpBooleanViewComponent,
    Ng2TableCellComponent,
    Ng2TableHtmlCellComponent,
    HLinkTableCellComponent,
    InformativeCellComponentComponent,
    RolesChecklistComponent,
    InfoDialogComponent,
    MobileFiltersComponent,
    TooltipModule,
    PasswordInputComponent,
    EpicoreIdCellComponent,
    ValuePipe,
    NumberValuePipe,
    ResourceTaskStatusCellComponent,
    ShipmentStatusCellComponent,
    JobAlertStatusCellComponent,
    AlertSeverityCellComponent,
    PartReviewFaultCellComponent,
    PartReviewActualFaultCounterCellComponent,
    YesNoCellComponent,
    IsActiveComponent,
    InvoiceAgedCellComponent,
    AgedCellComponent,
    AddressComponent,
    AddressFieldComponent,
    ProfilePictureComponent,
    NgxButtonComponent,
    InvoiceDueAmountComponent,
    WaitSpinnerComponent,
    UploadFilesComponent,
    ProgressComponent,
    ToggleButtonComponent,
    QuoteStatusComponent,
    FileUploadModule,
    TaskResultComponent,
    FullscreenBusyComponent,
    RolesChecklistCellComponent,
    AccountRolesSelectionComponent,
    RemoveAccountCellComponent,
  ],
  providers: [
    {
      provide: TooltipConfig,
      useValue: {
        adaptivePosition: false,
        delay: 0,
        placement: 'top',
        triggers: 'mouseenter:mouseleave click:click',
        container: 'body',
      },
    },
  ],
})
export class SharedModule { }
