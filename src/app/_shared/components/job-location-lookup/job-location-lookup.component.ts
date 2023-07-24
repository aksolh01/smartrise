import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { map } from 'rxjs/operators';
import { LocationService } from '../../../services/location.service';
import { MiscellaneousService } from '../../../services/miscellaneous.service';
import { QuotingToolValidationService } from '../../../services/quoting-tool-validation.service';
import { EnumValueView } from '../../models/enumValue.model';
import { JobLocationView } from '../../models/quotes/quote-view.model';
import { JobLocationDetailsComponent } from '../../../pages/quotes-management/quoting-tool/custom-fields/quoting-job-location/job-location/job-location.component';
import { QuotingInputBaseComponent } from '../../../pages/quotes-management/quoting-tool/custom-fields/quoting-input-base/quoting-input-base.component';

@Component({
  selector: 'ngx-job-location-lookup',
  templateUrl: './job-location-lookup.component.html',
  styleUrls: ['./job-location-lookup.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: JobLocationLookupComponent,
    multi: true
  },
  {
    provide: NG_VALIDATORS,
    multi: true,
    useExisting: JobLocationLookupComponent
  }]
})
export class JobLocationLookupComponent extends QuotingInputBaseComponent implements
  OnInit,
  OnDestroy,
  ControlValueAccessor {

  @Output() removeLocation = new EventEmitter<void>();
  @Output() removingLocationCanceled = new EventEmitter<void>();
  @Output() locationRemoved = new EventEmitter<void>();
  @Output() selectLocation = new EventEmitter<void>();
  @Output() locationChanged = new EventEmitter<any>();
  @Output() changingLocationCancelled = new EventEmitter<void>();

  @Input() allowRemoveJobLocation: boolean = false;
  @Input() jobLocation: JobLocationView;
  @Input() states: any[];
  @Input() countries: any[];
  @Input() disableQuotingValidation = false;

  modalRef: any;
  onChanged: any;
  onTouched: any;
  isDisabled: boolean;

  constructor(
    private modalService: BsModalService,
    private miscellaneousService: MiscellaneousService,
    quotingToolValidationService: QuotingToolValidationService,
    private locationService: LocationService,
    cd: ChangeDetectorRef
  ) {
    super(quotingToolValidationService, cd);
  }

  validate(control: AbstractControl): ValidationErrors {
    if (!this.jobLocation?.country) {
      return {
        required: true
      };
    }
    return null;
  }

  registerOnValidatorChange?(fn: () => void): void {
  }

  writeValue(obj: any): void {
    this.jobLocation = obj;
  }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  onSelectLocation() {


    try {
      this.selectLocation.next();
    } catch (error) {

    }

    const ref = this.modalService.show<JobLocationDetailsComponent>(JobLocationDetailsComponent, {
      class: 'centered adjustable-modal',
      initialState: {
        country: this.jobLocation?.country?.value,
        state: this.jobLocation?.state?.value,
        city: this.jobLocation?.city,
        countries: this.countries
      }
    });
    ref.content.countries = this.countries;
    ref.content.statesLoaderCallback = (country) => this.locationService.getStates(country).pipe(map((states) => this.states = states));
    ref.onHidden.subscribe(() => {
      if (ref.content.location) {

        const jobLocation = this._createLocation();
        jobLocation.country = this.countries.filter(c => c.value === ref.content?.location?.country)[0];
        jobLocation.state = this.states.filter(s => s.value === ref.content?.location?.state)[0];
        jobLocation.city = ref.content?.location?.city;

        if (!this.isChanged(this._oldValue, jobLocation)) {
          this.changingLocationCancelled.next();
          return;
        }

        this.locationChanged.next(jobLocation);
        //this._oldValue = this.jobLocation;
        this.jobLocation = jobLocation;

        if (this.item) {
          this.item[this.valueField] = this.jobLocation;
          super.validateValue(this.item[this.valueField]);
          this.notifySort();
        }

        if (this.onTouched) {
this.onTouched();
}
        if (this.onChanged) {
this.onChanged(this.jobLocation);
}
      } else {
        this.changingLocationCancelled.next();
      }
    });
  }

  private _createLocation() {
    const location = new JobLocationView();
    location.country = new EnumValueView();
    location.state = new EnumValueView();
    return location;
  }

  rednerDisplay() {
    return this.jobLocation?.displayLocation ?? '';
  }

  onRemoveLocation() {
    try {
      this.removeLocation.next();
    } catch (error) {

    }
    this.miscellaneousService.openConfirmModal('Are you sure you want to remove this location?', () => {
      //this._oldValue = this.jobLocation;
      this.jobLocation = null;
      if (this.item) {
        this.item[this.valueField] = null;
        //this._oldValue = null;
        super.validateValue(this.item[this.valueField]);
        this.notifySort();
      }

      if (this.onTouched) {
this.onTouched();
}
      if (this.onChanged) {
this.onChanged();
}
      this.locationRemoved.next();
    }, () => {
      this.removingLocationCanceled.next();
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.modalService.hide();
  }

  protected isChanged(oldValue: any, newValue: any) {
    return oldValue?.country?.value !== newValue?.country?.value ||
      oldValue?.state?.value !== newValue?.state?.value ||
      oldValue?.city !== newValue?.city;
  }
}
