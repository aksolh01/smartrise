import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { loadStripe } from '@stripe/stripe-js';
import { environment } from '../../../../environments/environment';
import { AccountService } from '../../../services/account.service';
import { BankAccountService } from '../../../services/bank-account.service';
import { MessageService } from '../../../services/message.service';
import { MultiAccountsService } from '../../../services/multi-accounts-service';
import { SmartriseValidators } from '../../../_shared/constants';
import { allowOnlyNumbers } from '../../../_shared/functions';
import { trimValidator } from '../../../_shared/validators/trim-validator';

@Component({
  selector: 'ngx-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.scss']
})
export class BankAccountComponent implements OnInit {
  bankAccountForm: UntypedFormGroup;
  bankAccount: any;
  isLoading = false;
  formSubmitted: boolean;

  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private bankAccountService: BankAccountService,
    private multiAccountService: MultiAccountsService
  ) { }

  ngOnInit(): void {
    this.createBankAccountForm();
  }

  createBankAccountForm() {

    this.bankAccountForm = new UntypedFormGroup({
      accountType: new UntypedFormControl('', [SmartriseValidators.requiredWithTrim, trimValidator]),
      cardholderName: new UntypedFormControl('', [SmartriseValidators.requiredWithTrim, trimValidator]),
      accountNumber: new UntypedFormControl('', [SmartriseValidators.requiredWithTrim, trimValidator, SmartriseValidators.bankAccountNumber]),
      routingNumber: new UntypedFormControl('', [SmartriseValidators.requiredWithTrim, trimValidator, SmartriseValidators.routingNumber])
    });
    this.bankAccountForm.markAllAsTouched();
  }

  onlyNumbers(event) {
    allowOnlyNumbers(event);
  }

  getStripeErrorMessage(stripeError) {
    console.error(stripeError);
    switch (stripeError.code) {
      case 'routing_number_invalid':
        return 'Incorrect Routing Number';
      case 'account_number_invalid':
        return 'Incorrect Bank Account Number';
      default:
        return stripeError.message;
    }
  }
  onSubmit() {


    this.formSubmitted = true;
    if (this.bankAccountForm.invalid) {
      return;
    }

    this.isLoading = true;

    this.accountService.checkSession();

    this.createBankAccount().then(result => {

      if (result.error) {
        this.isLoading = false;
        this.messageService.showErrorMessage(this.getStripeErrorMessage(result.error));
        return;
      }

      this.bankAccountService.createBankAccount({
        bankAccountToken: result.token.id,
        customerId: this.multiAccountService.getSelectedAccount()
      }).subscribe(() => {
        this.messageService.showSuccessMessage('Bank Account has been added successfully');
        this.router.navigate(['..'], { relativeTo: this.route });
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
      });
    }, error => {
      this.isLoading = false;
    });
  }

  private async createBankAccount() {
    const stripe = await loadStripe(environment.stripeKey);

    return stripe.createToken('bank_account', {
      country: 'US',
      currency: 'usd',
      routing_number: this.bankAccountForm.value.routingNumber,
      account_number: this.bankAccountForm.value.accountNumber,
      account_holder_name: this.bankAccountForm.value.cardholderName,
      account_holder_type: this.bankAccountForm.value.accountType,
    });
  }
}
