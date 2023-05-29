import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Mapper } from '@nartc/automapper';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { JoyrideService } from 'ngx-joyride';
import { forkJoin } from 'rxjs';
import { BreadcrumbService } from 'xng-breadcrumb';
import { AccountService } from '../../../services/account.service';
import { BaseComponentService } from '../../../services/base-component.service';
import { ContactService } from '../../../services/contact.service';
import { MessageService } from '../../../services/message.service';
import { MiscellaneousService } from '../../../services/miscellaneous.service';
import { MultiAccountsService } from '../../../services/multi-accounts-service';
import { QuotingToolValidationService } from '../../../services/quoting-tool-validation.service';
import { QuotingToolService } from '../../../services/quoting-tool.service';
import { ResponsiveService } from '../../../services/responsive.service';
import { ScrollingService } from '../../../services/scrolling.servive';
import { TaskSyncronizerService } from '../../../services/task-syncronizer.service';
import { TokenService } from '../../../services/token.service';
import { FormExitConfirmComponent } from '../../../_shared/components/form-exit-confirm/form-exit-confirm.component';
import { TaskResultComponent } from '../../../_shared/components/task-result/task-result.component';
import { UploadFilesComponent } from '../../../_shared/components/upload-files/upload-files.component';
import { URLs } from '../../../_shared/constants';
import { convertDates, guid, replaceValueInObject, stringifyObject } from '../../../_shared/functions';
import { FormExitValue } from '../../../_shared/models/dialog.model';
import { IQuoteEnums } from '../../../_shared/models/quote-job.model';
import { IQuoteLookupDataView } from '../../../_shared/models/quotes/quote-lookup-data-i.model';
import { QuoteLookupDataView } from '../../../_shared/models/quotes/quote-lookup-data.model';
import { IQuoteResponse } from '../../../_shared/models/quotes/quote-response-i.model';
import { ICarView, IQuoteView } from '../../../_shared/models/quotes/quote-view-i.model';
import { CarAdditionalC4RiserBoardsView, CarAdditionalFeatureView, CarDoorFeatureView, CarHydraulicFieldView, CarManagementSystemView, CarProvisionView, CarSmartriseFeatureView, CarSpecialFieldView, CarTractionFieldView, CarView, QuoteView } from '../../../_shared/models/quotes/quote-view.model';
import { SaveQuotePayload } from '../../../_shared/models/quotes/save-qoute.model';
import { SubmitQuotePayload } from '../../../_shared/models/quotes/submit-quote.model';
import { ScreenBreakpoint } from '../../../_shared/models/screenBreakpoint';
import { BaseComponent } from '../../base.component';
import * as guidingTourGlobal from '../../guiding.tour.global';
import { RfqDetailsComponent } from '../rfq-details/rfq-details.component';
import { IBusinessUIActions } from './business/business-actions';
import { BusinessContext } from './business/business-context';
import { updateC4RiserBoardsVisibilityOnQuoteLevel, updateHydraulicFieldVisibilityOnQuoteLevel, updateTractionFieldVisibilityOnQuoteLevel } from './business/business-core/business-rules';
import { BusinessProfileService } from './business/business-profile-service';
import { initializeCar } from './business/event-callbacks/initialize-callbacks';
import { WorkingMode } from './business/types';
import { CablesInfoComponent } from './custom-components/cables-info/cables-info.component';
import { ErrorsPanelComponent } from './custom-components/errors-panel/errors-panel.component';
import { HoistwayCablesInfoComponent } from './custom-components/hoistway-cables-info/hoistway-cables-info.component';
import { SearchableContactsListComponent } from './custom-components/searchable-contacts-list/searchable-contacts-list.component';

@Component({
  selector: 'ngx-quoting-tool',
  templateUrl: './quoting-tool.component.html',
  styleUrls: ['./quoting-tool.component.scss']
})
export class QuotingToolComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit, IBusinessUIActions {

  private _atachmentsChanged: boolean = false;
  private _oldQuote: string;
  private _canLeave: boolean = false;

  showAccountName: boolean = false;
  lookup: IQuoteLookupDataView = new QuoteLookupDataView();
  jobLocation = '';
  isRefreshingContacts: boolean = false;
  contactHasEmail: boolean = false;
  quote: IQuoteView;
  isLoading = true;
  isBusy: boolean = false;
  isSaving: boolean = false;
  isGenerating: boolean = false;
  contacts: any[];
  leaveSubscription: any;
  motorHPWarningMessage: string;
  runGuidingTour: boolean = true;
  customerId: number;

  @ViewChild('speedFPM') speedFPM: any;
  @ViewChild('capacity') capacity: any;
  @ViewChild('motorHP') motorHP: any;
  @ViewChild('actionsRequired') actionsRequired: ErrorsPanelComponent;
  @ViewChild('attachments') attachments: UploadFilesComponent;

  isSmall?: boolean = false;
  hideTopMessage: boolean = false;
  hideBottomMessage: boolean = true;
  selectedContact: any;
  removedFiles: number[];
  taskResult: BsModalRef<TaskResultComponent>;
  isProcessing: boolean = false;
  states = [];
  modalRef: any;


  errors = [];
  defaultValue = '';
  hasError: boolean = false;
  defaultCar: any;
  generalHasBorder: boolean = true;
  isLoadingStates: boolean;

  constructor(
    baseService: BaseComponentService,
    private taskSyncronizerService: TaskSyncronizerService,
    private route: ActivatedRoute,
    private bcService: BreadcrumbService,
    private router: Router,
    private tokenService: TokenService,
    private quotingToolValidationService: QuotingToolValidationService,
    private quotingToolService: QuotingToolService,
    private businessContext: BusinessContext,
    private contactService: ContactService,
    private modalService: BsModalService,
    private messageService: MessageService,
    private miscellaneousService: MiscellaneousService,
    private accountService: AccountService,
    private responsiveService: ResponsiveService,
    private joyrideService: JoyrideService,
    private businessPrfileService: BusinessProfileService,
    private scrollService: ScrollingService,
    private cd: ChangeDetectorRef,
    private multiAccountsService: MultiAccountsService,
  ) {
    super(baseService);
  }


  revalidateField(instance: any, field: string) {
    this.quotingToolValidationService.revalidateField(instance, field);
  }

  revalidate(instance: any) {
    this.quotingToolValidationService.revalidate(instance);
  }

  revalidateAll() {
    this.quotingToolValidationService.revalidateAll();
  }

  errorMessage(message: string): void {
    this.messageService.showErrorMessage(message);
  }

  updateVisibiltyStatus(instance: any, hide: boolean): void {
    this.quotingToolValidationService.updateVisibilityStatus(instance, hide);
  }

  updateCar(updateCarInfo: { ref: any; displayName: any; }) {
    setTimeout(() => this.quotingToolValidationService.updateCar.emit(updateCarInfo));
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this._canLeave = true;
    this.modalService.hide();
    this.leaveSubscription?.unsubscribe();
    this.joyrideService?.closeTour();
    this.joyrideService = null;
  }

  onRemoveContact() {
    this.actionsRequired.collapse();
    this.miscellaneousService.openConfirmModal('Are you sure you want to remove this contact?', () => {
      this.quote.contact = null;
      this.quote.contactId = null;
      this.quote.email = null;
      this.quote.phone = null;
      this.actionsRequired?.enable();
    }, () => {
      this.actionsRequired?.enable();
    });
  }

  onSelectContact() {
    this.actionsRequired.collapse();
    this.modalRef = this.modalService.show<SearchableContactsListComponent>(SearchableContactsListComponent, {
      class: 'centered adjustable-modal',
      initialState: {
        title: 'Contacts',
        options: this.lookup.customerContacts,
        autocompleteDisplayField: 'fullName',
        autocompleteValueField: 'id',
        initialValue: this.quote.contactId
      }
    });
    this.modalRef.content.refresh.subscribe(() => this._onRefreshContacts());
    this.modalRef.onHidden.subscribe(() => this._onCloseContacts());
  }

  private _onCloseContacts() {
    this.actionsRequired?.enable();
    if (this.modalRef?.content?.selectedContact) {
      this._fillQuoteContactInfo();
    }
  }

  private _fillQuoteContactInfo() {
    this.selectedContact = this.modalRef?.content?.selectedContact;
    this.quote.contactId = this.modalRef?.content?.selectedContact?.id;
    this.quote.contact = this.modalRef?.content?.selectedContact?.fullName;
    this.quote.email = this.modalRef?.content?.selectedContact?.email;
    this.quote.phone = this.modalRef?.content?.selectedContact?.phone;
  }

  private _onRefreshContacts() {
    this.contactService.getCustomerContacts(this.customerId).subscribe(contacts => {
      this.lookup.customerContacts = contacts;
      this.modalRef.content.options = contacts;
      this.modalRef.content.isRefreshingContacts = false;
    }, error => {
      this.modalRef.content.isRefreshingContacts = false;
    });
  }

  onClickBidDate() {
    this.actionsRequired.collapse();
  }

  @HostListener('window:beforeunload', ['$event'])
  preventReload(e) {
    return this.canLeave();
  }

  notifyLeave(url: string) {
    this._openExitModal(
      'Exit Quote',
      'You have unsaved changes. Are you sure you want to Exit?',
      (result) => {
        if (result === FormExitValue.Cancel) {
          return;
        } else if (result === FormExitValue.Exit) {
          this._atachmentsChanged = false;
          this._canLeave = true;
          this.router.navigateByUrl(url);
        }
      }
    );
  }

  displayGroup(group) {
    const groupItem = this.lookup.groups.filter(x => x.value === group);
    if (groupItem.length > 0)
      return groupItem[0]?.description;
  }

  canLeave(): boolean {

    this.accountService.checkSession();

    return this._canLeave || (!this._quoteChanged() && !this._atachmentsChanged);
  }

  ngOnInit(): void {

    this.showAccountName = this.multiAccountsService.hasMultipleAccounts();
    this.quotingToolValidationService.reset();
    this.quotingToolValidationService.index = 0;
    this.businessContext.workingMode = WorkingMode.NotSet;
    this.responsiveService.currentBreakpoint$.subscribe(w => this._onScreenSizeChanged(w));
    this.bcService.set('@jobName', { skip: true });
    const quoteId = this.route.snapshot.paramMap.get('id');

    this.quotingToolService
      .getQuote(+quoteId)
      .subscribe(quoteResponse => this._onQuoteResponseReady(quoteResponse));
  }

  private _onScreenSizeChanged(w: ScreenBreakpoint) {
    if (w === ScreenBreakpoint.lg || w === ScreenBreakpoint.xl) {
      if (this.isSmall !== false) {
        this.isSmall = false;
      }
    } else if (w === ScreenBreakpoint.md || w === ScreenBreakpoint.xs || w === ScreenBreakpoint.sm) {
      if (this.isSmall !== true) {
        this.isSmall = true;
      }
    }
  }

  private _onQuoteResponseReady(quoteResponse: IQuoteResponse) {

    if (this.miscellaneousService.isCustomerUser()) {
      const selectedAccount = this.multiAccountsService.getSelectedAccount();

      if (selectedAccount != null && selectedAccount !== quoteResponse.customer.id) {
        this.router.navigateByUrl(URLs.ViewOpenQuotesURL);
        return;
      }
    }

    this.quote = QuoteView.mapFromResponse(quoteResponse);
    this.customerId = quoteResponse.customer.id;

    forkJoin([
      this.contactService.getCustomerContacts(this.customerId),
      this.quotingToolService.getEnums(this.customerId),
    ]).subscribe(([
      contacts,
      enums,
    ]) => {
      this._canLeave = false;
      this.defaultCar = enums.defaultCar;
      this._fillLookupProperties(enums, contacts);
      this._getSelectedContactFromContactId(quoteResponse.contactId);
      this._populateNavigationPropertiesOnQuoteLevel(this.quote);
      this.businessContext.quote = this.quote;
      this.businessContext.lookupData = this.lookup;
      this.businessContext.actions = this;
      setTimeout(() => {
        this.attachments?.loadAttachments(quoteResponse.attachments);
      });
      this._fillBreadcrumbPlaceholder();
      this._applyBusinessProfile();
      this._finalizeQuote();
      this.triggerGuidingTour();
    }, error => {
      this.router.navigateByUrl(URLs.ViewOpenQuotesURL);
    });
  }

  private _fillBreadcrumbPlaceholder() {
    this.bcService.set('@jobName', this.quote.jobName === '' ? 'N/A' : this.quote.jobName);
    this.bcService.set('@jobName', { skip: false });
  }

  private _getSelectedContactFromContactId(contactId: number) {
    this.selectedContact = this.lookup.customerContacts.filter(x => x.id === contactId)[0];
  }

  private _fillLookupProperties(enums: IQuoteEnums, contacts: any[]) {
    this.lookup.defaultCar = enums.defaultCar;
    this.lookup.customerContacts = contacts;
    this.lookup.doors = enums.doors;
    this.lookup.controllerLayouts = enums.controllerLayouts;
    this.lookup.nemaLocations = enums.nemaLocations;
    this.lookup.nemaRatings = enums.nemaRatings;
    this.lookup.hydroHoistwayCables = enums.hydroHoistwayCables;
    this.lookup.c4HoistwayCables = enums.tractionHoistwayCables;
    this.lookup.smartConnects = enums.smartConnects;
    this.lookup.starters = enums.starters;
    this.lookup.groups = enums.groups;
    this.lookup.jobStatuses = enums.jobStatus;
    this.lookup.c4TravelerCables = enums.tractionTravelerCables;
    this.lookup.hydroTravelerCables = enums.hydroTravelerCables;
    this.lookup.motorTypes = enums.motorTypes;
    this.lookup.motorMounts = enums.motorMounts;
    this.lookup.motorLocations = enums.motorLocations;
    this.lookup.motorProviders = enums.motorProviders;
    this.lookup.batteryRescues = enums.batteryRescues;
    this.lookup.numberOfRisers = enums.numberOfRisers;
    this.lookup.numberOfRisersAlternatives = enums.numberOfRisersAlternatives;
    this.lookup.mainLineVoltages = enums.mainLineVoltages;
    this.lookup.motorLeads = enums.motorLeads;
    this.lookup.acTractionDriveModels = enums.acTractionDriveModels;
    this.lookup.dcTractionDriveModels = enums.dcTractionDriveModels;
    this.lookup.countries = enums.countries;
    this.lookup.controllerTypes = enums.controllerTypes;
    this.lookup.buildingTypes = enums.buildingTypes;
    this.lookup.loadWeighingDeviceTractionDataSource = enums.loadWeighingDeviceTractions;
  }

  private _isValidQuoteId(quoteId: string) {
    if (quoteId == null)
      return false;

    if (isNaN(+quoteId))
      return false;

    return true;
  }

  private _populateNavigationPropertiesOnQuoteLevel(quote: IQuoteView) {
    quote.cars.forEach((car) => this._populateNavigationProprties(car));
  }

  private _populateNavigationProprties(car: ICarView) {
    car.quote = this.quote;
    car.additionalFeature.car = car;
    car.carDoorFeature.car = car;
    car.carHydraulicField.car = car;
    car.carManagementSystem.car = car;
    car.carProvision.car = car;
    car.carSpecialField.car = car;
    car.carSmartriseFeature.car = car;
    car.carTractionField.car = car;
    car.carAdditionalC4RiserBoards.car = car;
  }

  private _applyBusinessProfile() {
    const profile = this.businessPrfileService.getDefaultProfile();
    profile.apply();
  }

  private _finalizeQuote() {
    this._replaceQuoteValues(null, '');
    this._convertQuoteDates(this.quote);
    this.quote.cars.forEach(this.initializeCar.bind(this));
    this.isLoading = false;
    this._saveCurrentQuote();
  }

  private _convertQuoteDates(quote: IQuoteView) {
    convertDates(quote);
    this.quote.cars.forEach(car => {
      convertDates(car);
      convertDates(car.additionalFeature);
      convertDates(car.carDoorFeature);
      convertDates(car.carHydraulicField);
      convertDates(car.carManagementSystem);
      convertDates(car.carProvision);
      convertDates(car.carSpecialField);
      convertDates(car.carSmartriseFeature);
    });
  }

  private _replaceQuoteValues(searchValue: any, replaceValue: any) {
    replaceValueInObject(this.quote, searchValue, replaceValue);
  }

  private initializeCar(car) {
    car.ref = guid();
    if (!car.mainLineVoltage) {
      car.mainLineVoltage = '';
    }
    if (!car.carHydraulicField.motorLeads) {
      car.carHydraulicField.motorLeads = '';
    }
  }

  private _saveCurrentQuote() {
    setTimeout(() => {
      this._oldQuote = stringifyObject(SaveQuotePayload.mapFromView(this.quote));
    });
  }

  private _quoteChanged() {

    //We added this checking in case the quote returned empty
    //from server.
    if (!this.quote) {
      return false;
    }

    let _newQuoteSerialized = stringifyObject(SaveQuotePayload.mapFromView(this.quote));
    if (_newQuoteSerialized !== this._oldQuote) {
      return true;
    }
    return false;
  }

  onCancel() {

    if (!this._quoteChanged() && !this._atachmentsChanged) {
      this._canLeave = true;
      this.router.navigateByUrl(URLs.ViewOpenQuotesURL);
      return;
    }

    this._openExitModal(
      'Exit Quote',
      'You have unsaved changes. Are you sure you want to Exit?',
      (result) => {
        if (result === FormExitValue.Cancel) {
          return;
        } else if (result === FormExitValue.Exit) {
          this._canLeave = true;
          this._atachmentsChanged = false;
          this.router.navigateByUrl(URLs.ViewOpenQuotesURL);
        }
      }
    );
  }

  addCarKeyPress(event) {
    event = event || window.event;
    const charCode = (typeof event.which === 'undefined') ? event.keyCode : event.which;
    if (charCode === 13)
      event.preventDefault();
  }

  onAddCar() {

    if (this.isBusy) {
      return;
    }

    this.accountService.checkSession();

    this.isBusy = true;
    setTimeout(() => {
      this._cloneCar(this.defaultCar);
      const newCar = this.quote.cars[this.quote.cars.length - 1];
      newCar.carLabel = '';
      replaceValueInObject(newCar, null, '');
      this.initializeCar(newCar);
      this.isBusy = false;
    });
  }

  onDeleteCar(car) {

    this.accountService.checkSession();

    this.actionsRequired.collapse();
    this.miscellaneousService.openConfirmModal(
      'Are you sure you want to remove this car?',
      () => this._onDeleteCarConfirmed(car),
      () => this.actionsRequired?.enable()
    );
  }

  private _onDeleteCarConfirmed(car: any) {
    this.isBusy = true;
    setTimeout(() => {
      this._removeCarFromQuote(car);
      this.updateTablesVisibility();
      this.isBusy = false;
    });
    this.actionsRequired?.enable();
  }

  private _removeCarFromQuote(car: any) {
    const indexOfCar = this.quote.cars.indexOf(car);
    this.quote.cars.splice(indexOfCar, 1);
  }

  onCloneCar(car: ICarView) {

    this.accountService.checkSession();

    this.isBusy = true;
    setTimeout(() => {
      this._cloneCar(car);
      this.isBusy = false;
    });
  }

  private _cloneCar(car: Partial<ICarView>) {

    const newCar = this._cloneCarProperties(car);
    this._populateNavigationProprties(newCar);
    this.quote.cars.push(newCar);
    newCar.carIndex = this._generateNewCarIndex();
    newCar.id = 0;

    initializeCar(newCar, this.businessContext);
  }

  private _generateNewCarIndex() {
    let maxIndex = this.quote.cars.reduce((c1, c2) => c1 = c1 > c2.carIndex ? c1 : c2.carIndex, 0);
    if (!maxIndex)
      maxIndex = 0;
    return maxIndex + 1;
  }

  private _cloneCarProperties(car: Partial<ICarView>) {
    const newCar = new CarView();

    Object.assign(newCar, car);

    newCar.ref = guid();
    newCar.id = 0;

    newCar.additionalFeature = new CarAdditionalFeatureView();
    Object.assign(newCar.additionalFeature, car.additionalFeature);
    newCar.additionalFeature.id = 0;

    newCar.carDoorFeature = new CarDoorFeatureView();
    Object.assign(newCar.carDoorFeature, car.carDoorFeature);
    newCar.carDoorFeature.id = 0;

    newCar.carHydraulicField = new CarHydraulicFieldView();
    Object.assign(newCar.carHydraulicField, car.carHydraulicField);
    newCar.carHydraulicField.id = 0;

    newCar.carManagementSystem = new CarManagementSystemView();
    Object.assign(newCar.carManagementSystem, car.carManagementSystem);
    newCar.carManagementSystem.id = 0;

    newCar.carProvision = new CarProvisionView();
    Object.assign(newCar.carProvision, car.carProvision);
    newCar.carProvision.id = 0;

    newCar.carSmartriseFeature = new CarSmartriseFeatureView();
    Object.assign(newCar.carSmartriseFeature, car.carSmartriseFeature);
    newCar.carSmartriseFeature.id = 0;

    newCar.carSpecialField = new CarSpecialFieldView();
    Object.assign(newCar.carSpecialField, car.carSpecialField);
    newCar.carSpecialField.id = 0;

    newCar.carTractionField = new CarTractionFieldView();
    Object.assign(newCar.carTractionField, car.carTractionField);
    newCar.carTractionField.id = 0;

    newCar.carAdditionalC4RiserBoards = new CarAdditionalC4RiserBoardsView();
    Object.assign(newCar.carAdditionalC4RiserBoards, car.carAdditionalC4RiserBoards);
    newCar.carAdditionalC4RiserBoards.id = 0;

    return newCar;
  }

  onSaveQuote(withGenerate: boolean = false) {

    this.businessContext.workingMode = withGenerate ? WorkingMode.Generate : WorkingMode.Save;
    if (this.isProcessing) {
      return;
    }

    this.accountService.checkSession();

    this.isProcessing = true;

    if (withGenerate && !this._validateNumberOfCarsOnAllGroups()) {
      this.isProcessing = false;
      return;
    }

    if (withGenerate && !this._validateC2V2Checkings()) {
      this.isProcessing = false;
      return;
    }

    if (withGenerate && !this._validateV2EvolvedCheckings()) {
      this.isProcessing = false;
      return;
    }

    this.quotingToolValidationService.validateAll(() => {

      if (this.hasError) {
        this._handleValidationErrorEncountered();
        return;
      }

      this._prePost();

      if (
        !this.attachments.hasNewFiles() &&
        !this.attachments.hasRemovedFiles()
      ) {
        this.miscellaneousService.startFullscreenBusy();
        this.isBusy = true;

        if (withGenerate) {
          this._submitQuote();
        } else {
          this._saveQuote();
        }

        return;
      }


      this.taskSyncronizerService.clear();
      if (withGenerate) {
        this._registerGenerateQuoteTask();
      } else {
        this._registerSaveQuoteTask();
      }

      if (this.attachments.hasNewFiles()) {
        this._registerUploadAttachmentsTasks();
      }

      if (this.attachments.hasRemovedFiles()) {
        this._registerDeleteAttachmentsTask();
      }

      const taskStatuses = this.taskSyncronizerService.tasks.map(x => {
        return {
          name: x.name,
          message: x.message,
          status: 'InProgress',
        };
      });

      this.taskResult = this.modalService.show<TaskResultComponent>(TaskResultComponent, {
        initialState: {
          title: 'Saving Quote',
          statuses: taskStatuses
        },
        keyboard: false
      });

      const _updateTaskStatusOnUI = (name: string, status: string) => {
        taskStatuses.filter(s => s.name === name)[0].status = status;
      };

      let saveQuoteResult = null;
      const sub = this.taskSyncronizerService.start().subscribe(
        result => {
          _updateTaskStatusOnUI(result.name, result.status);
          this._handleTaskBasedOnStatus(result);
        },
        error => {
          this._updateInProgressTasks(taskStatuses, 'Failed');
          this._onTaskError(error);
          sub.unsubscribe();
        },
        () => {
          this._atachmentsChanged = false;
          this._onTasksCompleted(withGenerate, saveQuoteResult);
          this._saveCurrentQuote();
          this._updateAllTasks(taskStatuses, 'Done');
          sub.unsubscribe();
        });
    });
  }

  private _validateV2EvolvedCheckings() {

    if (this.quote.isCanadaOntario()) {
      return true;
    }

    for (var car of this.quote.cars) {
      if (this._eitherV2OrHydroEvolvedMustBeSelected(car)) {
        this.messageService.showErrorMessage(`${car.displayName} must have either V2 or Hydro Evolved selected`);
        return false;
      }
    }
    return true;
  }

  private _eitherV2OrHydroEvolvedMustBeSelected(car: ICarView) {
    return car.isHydraulic() &&
      !car.carHydraulicField.v2 &&
      !car.carHydraulicField.hydroEvolved;
  }

  private _validateC2V2Checkings() {
    for (var car of this.quote.cars) {
      if (car.isTraction() && (!car.carTractionField.c4 && !car.carTractionField.v2Traction)) {
        this.messageService.showErrorMessage(`${car.displayName} must have either C4 or V2 selected`);
        return false;
      }
    }
    return true;
  }

  private _handleValidationErrorEncountered() {
    this.quotingToolValidationService.errorChanged.next({ sort: true });
    this.isProcessing = false;
    this.messageService.showErrorMessage('Please check the action(s) required');
  }

  private _saveQuote() {
    this.isSaving = true;
    const saveQuotePayload = SaveQuotePayload.mapFromView(this.quote);
    saveQuotePayload.customerId = this.customerId;

    this.quotingToolService.saveQuote(saveQuotePayload).subscribe(result => {
      this._onSaveSuccess();
      this._onTasksCompleted(false, result);
    }, error => {
      this.isProcessing = false;
      this.isSaving = false;
      this.isBusy = false;
      this.miscellaneousService.endFullscreenBusy();
      this._resetQuote();
    });
  }

  private _submitQuote() {
    this.isGenerating = true;
    const submitQuotePayload = SubmitQuotePayload.mapFromView(this.quote);
    submitQuotePayload.customerId = this.customerId;

    this.quotingToolService.submitQuote(submitQuotePayload).subscribe(result => {
      this._onSaveSuccess();
      this._onTasksCompleted(true, result);
    }, error => {
      this.isProcessing = false;
      this.isGenerating = false;
      this.isBusy = false;
      this.miscellaneousService.endFullscreenBusy();
      this._resetQuote();
    });
  }

  private _registerSaveQuoteTask() {
    const saveQuotePayload = SaveQuotePayload.mapFromView(this.quote);
    saveQuotePayload.customerId = this.customerId;

    this.taskSyncronizerService.registerTask(
      this.quotingToolService.saveQuote(saveQuotePayload),
      'SaveQuote',
      `Saving quote ${this.quote.jobName}`
    );
  }

  private _registerGenerateQuoteTask() {
    const submitQuotePayload = SubmitQuotePayload.mapFromView(this.quote);
    submitQuotePayload.customerId = this.customerId;

    this.taskSyncronizerService.registerTask(
      this.quotingToolService.submitQuote(submitQuotePayload),
      'SaveQuote',
      `Generating quote ${this.quote.jobName}`
    );
  }

  private _registerDeleteAttachmentsTask() {
    this.taskSyncronizerService.registerTask(
      this.quotingToolService.deleteAttachments(this.attachments.removedFiles),
      'DeleteAttachments',
      `Deleting removed attachments`
    );
  }

  private _registerUploadAttachmentsTasks() {
    let index = -1;
    this.attachments.newFiles.forEach(file => {

      this.taskSyncronizerService.registerTask(
        this.quotingToolService.uploadAttachments([file.data], this.quote.id),
        `UploadAttachment${index}`,
        `Uploading file ${file.data.name}`,
        file.ui
      );

      index++;
    });
  }

  private _validateNumberOfCarsOnAllGroups() {
    const groups = this.quote.cars.reduce((groups, item) => {
      const group = (groups[item.group] || []);
      group.push(item);
      groups[item.group] = group;
      return groups;
    }, {});
    for (let key in groups) {

      if (key === 'Simplex')
        continue;

      let count = 0;
      groups[key].forEach(c => {
        if (c.numberOfCars) {
          count += +c.numberOfCars;
        }
      });
      if (count > 8) {
        const groupName = this.lookup.groups.filter(g => g.value === key)[0].description;
        this.messageService.showErrorMessage(`${groupName} cannot have more than 8 Cars`);
        return false;
      }
    }
    return true;
  }

  private _updateInProgressTasks(taskStatuses: any[], status: string) {
    taskStatuses.forEach(t => {
      if (t.status === 'InProgress')
        t.status = status;
    });
  }

  private _updateAllTasks(taskStatuses: any[], status: string) {
    taskStatuses.forEach(t => {
      t.status = status;
    });
  }

  private _onTasksCompleted(withGenerate: boolean, result: any) {
    this.hideBottomMessage = false;
    if (withGenerate) {
      this.quote.status = 'Generated';
    } else {
      this.quote.status = 'Saved';
    }
    setTimeout(() => {
      this.isProcessing = false;
      this.taskResult?.hide();
      this.miscellaneousService.endFullscreenBusy();
      if (withGenerate) {
        this.isGenerating = false;
        this.messageService.showSuccessMessage('Quote has been generated successfully');
        this._showRfqModel(result);
      } else {
        this.isSaving = false;
        this.messageService.showSuccessMessage('Quote has been saved successfully');
      }
      this.isBusy = false;
    }, 1000);
  }

  private _onTaskError(error: any) {
    error?.stop();
    setTimeout(() => this.taskResult?.hide(), 1000);

    this.isProcessing = false;
    this.isSaving = false;
    this.isGenerating = false;
    this.isLoading = false;

    this.taskSyncronizerService?.clear();
    this._resetQuote();
  }

  private _handleTaskBasedOnStatus(result: any) {
    if (result.status === 'Done') {
      if (result.name === 'SaveQuote') {
        this._onSaveSuccess();
        return result.result;
      } else if (result.name.startsWith('UploadAttachment')) {
        this._onUploadAttachmentSuccess(result);
      } else if (result.name === 'DeleteAttachments') {
        this._onDeleteAttachmentsSuccess();
      }
    }
  }

  private _resetQuote() {
    this._replaceQuoteValues(null, this.defaultValue);
  }

  private _showRfqModel(resp: any) {
    const ref = this.modalService.show<RfqDetailsComponent>(RfqDetailsComponent, {
      initialState: {
        quoteId: this.quote.id,
      }
    });
    ref.onHidden.subscribe(() => {
    });
  }

  private _onDeleteAttachmentsSuccess() {
    this.attachments.clearRemovedFiles();
  }

  private _onUploadAttachmentSuccess(result: any) {
    this.attachments.updateFileID(result.data, result.result[0]);
  }

  private _onSaveSuccess() {
    this._canLeave = true;
    this._resetQuote();
    this._saveCurrentQuote();
  }

  private _prePost() {
    this._replaceQuoteValues(this.defaultValue, null);
    this.quote.creationDate = this.mockUtcDate(this.quote.creationDate);
    if (this.quote.biddingDate) {
      this.quote.biddingDate = this.mockUtcDate(this.quote.biddingDate);
    }
  }

  openTravelerCablesInfo() {
    this.actionsRequired.collapse();
    this.modalRef = this.modalService.show<CablesInfoComponent>(CablesInfoComponent, {
      initialState: {}
    });

    const subscription = this.modalRef.onHidden.subscribe(() => {
      subscription.unsubscribe();
      this.actionsRequired?.enable();
    });
  }

  openHoistwayCablesInfo() {
    this.actionsRequired.collapse();
    this.modalRef = this.modalService.show<HoistwayCablesInfoComponent>(HoistwayCablesInfoComponent, {
      initialState: {}
    });

    const subscription = this.modalRef.onHidden.subscribe(() => {
      this.actionsRequired?.enable();
      subscription.unsubscribe();
    });
  }

  private _openExitModal(title: string, message: string, callback: (res) => void): void {
    this.actionsRequired.collapse();
    this.modalRef = this.modalService.show<FormExitConfirmComponent>(FormExitConfirmComponent, {
      initialState: {
        title: title,
        message: message,
      }
    });

    const subscription = this.modalRef.onHidden.subscribe(() => {
      callback(this.modalRef.content.result);
      this.actionsRequired?.enable();
      subscription.unsubscribe();
    });
  }

  onCloseTopMessage() {
    this.hideTopMessage = true;
  }

  onCloseBottomMessage() {
    this.hideBottomMessage = true;
  }

  onShowErrors() {

  }

  collapseActionsRequired() {
    this.actionsRequired.collapseWithoutDisable();
  }

  onRemoveLocation(event) {
    this.actionsRequired.collapse();
  }

  onRemovingLocationCanceled(event) {
    this.actionsRequired?.enable();
  }

  onLocationRemoved() {
    this.actionsRequired?.enable();
  }

  onLocationChanged(event) {
    this.actionsRequired?.enable();
  }

  onChangingLocationCancelled(event) {
    this.actionsRequired?.enable();
  }

  onRemovingAttachment(index) {
    this.actionsRequired?.collapse();
    this.miscellaneousService.openConfirmModal('Are you sure you want to remove this attachment?', () => {
      this.attachments.deleteFile(index);
      this.actionsRequired?.enable();
    }, () => {
      this.actionsRequired?.enable();
    });
  }

  onViewPricing() {

    if (this.isProcessing) {
      return;
    }

    const modelRef = this.modalService.show<RfqDetailsComponent>(RfqDetailsComponent, {
      initialState: {
        quoteId: this.quote.id
      }
    });
  }

  onAttchmentChanged() {
    this._atachmentsChanged = true;
  }

  triggerGuidingTour() {
    setTimeout(() => {
      this.startGuidingTour();
    }, 10);
  }

  startGuidingTour() {
    if (localStorage.getItem('GuidingTourQuoteDetails') === null) {
      this.scrollService.enableScroll();
      this.runGuidingTour = true;
      this.openGuidingTour();
    } else {
      this.runGuidingTour = false;
    }
  }

  openGuidingTour() {
    if (this.joyrideService) {
      const steps = ['quoteFirstStep'];
      this.joyrideService.startTour({
        steps: steps,
        themeColor: guidingTourGlobal.guidingTourThemeColor,
        customTexts: {
          prev: guidingTourGlobal.guidingTourPrevButtonText,
          next: guidingTourGlobal.guidingTourNextButtonText,
          done: guidingTourGlobal.guidingTourDoneButtonText
        }
      });
    }
  }

  onFinishingTour() {
    this.scrollService.disableScroll();
    localStorage.setItem('GuidingTourQuoteDetails', '1');
    this.runGuidingTour = false;
  }

  updateTablesVisibility() {
    updateHydraulicFieldVisibilityOnQuoteLevel(this.businessContext);
    updateTractionFieldVisibilityOnQuoteLevel(this.businessContext);
    updateC4RiserBoardsVisibilityOnQuoteLevel(this.businessContext);
  }

  onSelectLocation() {
    this.actionsRequired.collapse();
  }
}


