import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { SelectHelperService } from '../../../../../../services/select-helper.service';
import { SmartriseValidators } from '../../../../../../_shared/constants';
import { trimValidator } from '../../../../../../_shared/validators/trim-validator';

@Component({
  selector: 'ngx-job-location',
  templateUrl: './job-location.component.html',
  styleUrls: ['./job-location.component.scss']
})
export class JobLocationDetailsComponent implements OnInit {
  @Input() location: any;
  @Input() country: string;
  @Input() state: string;
  @Input() city: string;
  @Input() countries: any[] = [];
  @Input() states: any[] = [];

  locationForm: UntypedFormGroup;

  isLoadingStates = false;
  formSubmitted = false;
  statesLoaderCallback: (country: string) => Observable<any[]>;

  constructor(
    private ref: BsModalRef,
    private selectHelperService: SelectHelperService
  ) {
  }

  ngOnInit(): void {
    this.locationForm = new UntypedFormGroup({
      country: new UntypedFormControl('', Validators.required),
      state: new UntypedFormControl('', Validators.required),
      city: new UntypedFormControl('', [SmartriseValidators.requiredWithTrim, trimValidator]),
    });
    this.locationForm.markAllAsTouched();
    if (this.country) {
      setTimeout(() => {
        this.isLoadingStates = true;
        const sub = this.statesLoaderCallback(this.country).subscribe(states => {
          this.states = states;
          this.isLoadingStates = false;
          this.locationForm.patchValue({
            country: this.country,
            state: this.state,
            city: this.city
          });
          sub.unsubscribe();
        }, () => this.isLoadingStates = false);
      });
    }
  }

  onFixScrollIssue() {
    this.selectHelperService.allowOnScroll.next(false);
  }

  onChangeCountry(event) {

    if (!event) {
      this.locationForm.patchValue({
        state: '',
        city: ''
      });
      return;
    }

    this.isLoadingStates = true;
    const sub = this.statesLoaderCallback(event).subscribe(states => {
      this.states = states;
      this.isLoadingStates = false;
      sub.unsubscribe();
    }, () => this.isLoadingStates = false);
    this.locationForm.patchValue({
      state: '',
      city: ''
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChangeState(event) {
    this.locationForm.patchValue({
      city: ''
    });
  }

  onCancel() {
    this.ref.hide();
  }

  onSelect() {
    this.formSubmitted = true;

    if (this.locationForm.invalid) {
      return;
    }
    this.location = this.locationForm.value;
    this.ref.hide();
  }
}
