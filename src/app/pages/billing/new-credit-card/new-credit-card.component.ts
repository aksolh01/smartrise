import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { SmartriseValidators } from '../../../_shared/constants';
import { ICreditCard } from '../../../_shared/models/credit-card.model';
import { BaseComponentService } from '../../../services/base-component.service';
import { BillingService } from '../../../services/billing.service';
import { trimValidator } from '../../../_shared/validators/trim-validator';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'ngx-new-credit-card',
  templateUrl: './new-credit-card.component.html',
  styleUrls: ['./new-credit-card.component.scss']
})
export class NewCreditCardComponent extends BaseComponent implements OnInit {

  creditCardForm: UntypedFormGroup;
  selectedCard = '';
  selectedCardClass = 'card-type';
  currentYear: number;
  @Input() creditCard: ICreditCard;

  constructor(private onlinePaymentService: BillingService,
    baseService: BaseComponentService) {
    super(baseService);
  }

  ngOnInit(): void {
    this.currentYear = new Date(Date.now()).getFullYear();
    this.createForm();
  }

  createForm() {
    this.creditCardForm = new UntypedFormGroup({
      cardType: new UntypedFormControl('', [SmartriseValidators.requiredWithTrim]),
      cardNumber: new UntypedFormControl('', [
        SmartriseValidators.creditCardNumber,
        SmartriseValidators.requiredWithTrim,
        trimValidator
      ]),
      expirationYear: new UntypedFormControl('', [
        SmartriseValidators.requiredWithTrim,
        trimValidator
      ]),
      expirationMonth: new UntypedFormControl('', [
        SmartriseValidators.requiredWithTrim,
        trimValidator
      ]),
      cvcCode: new UntypedFormControl('', [
        SmartriseValidators.requiredWithTrim,
        trimValidator
      ]),
      cardOwner: new UntypedFormControl('', [
        SmartriseValidators.requiredWithTrim,
        trimValidator
      ]),
    });
  }

  onSelectCard(event) {
    this.selectedCard = event;
    this.selectedCardClass = 'card-type ' + event;
    this.creditCardForm.patchValue({
      cardType: event
    });
  }

  onRemoveSelectedCard() {
    this.selectedCard = '';
    this.selectedCardClass = 'card-type';
    this.creditCardForm.patchValue({
      cardType: null
    });
  }

  onSubmit() {
    this.onlinePaymentService.createCreditCard(this.creditCardForm.value).subscribe(x => {

    });
  }

  restrictInput(e) {
    e = e || window.event;
    const charCode = (typeof e.which === 'undefined') ? e.keyCode : e.which;
    const charStr = String.fromCharCode(charCode);

    if (!charStr.trim()) {
      e.preventDefault();
      return;
    }

    const min = e.target.min;
    const max = e.target.max;

    const input = +(e.target.value + charStr);
    if (isNaN(input)) {
      e.preventDefault();
      return;
    }

    if (input < 1) {
      e.preventDefault();
      return;
    }

    if (max) {
if (input > max) {
        e.preventDefault();
        return;
      }
}

    // if (max > 0) {
    //     if (!charStr.match(/^[0-9]+$/))
    //         e.preventDefault();
    // }
  }

  restrictCardNumber(e) {
    e = e || window.event;

    const charCode = (typeof e.which === 'undefined') ? e.keyCode : e.which;
    const charStr = String.fromCharCode(charCode);
    const input = (e.target.value + charStr);
    const index = input.length - 1;

    if (index > 18) {
      e.preventDefault();
      return;
    }

    if (
      (index >= 0 && index <= 3) ||
      (index >= 5 && index <= 8) ||
      (index >= 10 && index <= 13) ||
      (index >= 15 && index <= 18)
    ) {

      if (charStr === ' ') {
        e.preventDefault();
        return;
      }

      if (isNaN(+charStr)) {
        e.preventDefault();
        return;
      }
    }

    if (index === 4 || index === 9 || index === 14) {

      if (charStr === ' ') {
        return;
      }

      if (!isNaN(+charStr)) {
        e.target.value = e.target.value + ' ' + charStr;
        e.preventDefault();
        return;
      }

      if (charStr !== ' ') {
        e.preventDefault();
        return;
      }
    }
  }
}
