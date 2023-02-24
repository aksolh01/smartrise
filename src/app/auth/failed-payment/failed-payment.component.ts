import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../pages/base.component';
import { ScreenBreakpoint } from '../../_shared/models/screenBreakpoint';
import { BaseComponentService } from '../../services/base-component.service';
import { PaymentService } from '../../services/payment.service';
import { ResponsiveService } from '../../services/responsive.service';

@Component({
  selector: 'ngx-failed-payment',
  templateUrl: './failed-payment.component.html',
  styleUrls: ['./failed-payment.component.scss']
})
export class FailedPaymentComponent extends BaseComponent implements OnInit {

  isLoading = true;
  canAccessPage = true;
  isSmall = false;

  amount: number;
  pnReference: any;
  transactionTime: any;
  paymentType: any;
  secureToken: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private reponsiveService: ResponsiveService,
    baseService: BaseComponentService
  ) {
    super(baseService);
  }

  ngOnInit(): void {
    this._getParameters();
    this.reponsiveService.currentBreakpoint$.subscribe(x => {
      if (x === ScreenBreakpoint.md || x === ScreenBreakpoint.sm || x === ScreenBreakpoint.xs) {
        this.isSmall = true;
      } else {
        this.isSmall = false;
      }
    });
  }

  private _getParameters() {
    this.route.queryParams.subscribe(p => {
      this.secureToken = p['SECURETOKEN'];
      this.amount = +p['AMT'];
      this.pnReference = p['PNREF'];
      this.paymentType = p['METHOD'];
      switch (this.paymentType) {
        case 'C':
        case 'CC':
          this.paymentType = 'Credit Card';
          break;
        case 'P':
          this.paymentType = 'Express Checkout';
          break;
        case 'ECHECK':
          this.paymentType = 'Electronic Check';
          break;
      }
      this.transactionTime = this._formatTime(new Date());

    });
  }

  private _formatTime(parameter: any) {
    const time = new Date(parameter);
    return this.formatUSDateTime(time.toISOString());
  }

  // private _checkIfCurrentUserLinkedToThisToken() {
  //   this.paymentService.checkIfTokenLinkedToUser(this.secureToken).subscribe(result => {
  //     this.canAccessPage = true;
  //   }, error => {
  //     this.router.navigateByUrl('auth/unauthorized');
  //   });
  // }

  onCancel() {
    this.router.navigateByUrl('pages/billing/statement-of-account');
  }
}
