import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-invoice-basic-info',
  templateUrl: './invoice-basic-info.component.html',
  styleUrls: ['./invoice-basic-info.component.scss']
})
export class InvoiceBasicInfoComponent implements OnInit {

  @Input() invoice: any;
  @Input() isSmartriseUser: boolean;
  @Input() displayAccountName: boolean;
  prevUrl: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.prevUrl = this.router.url.substring(0, this.router.url.lastIndexOf('/'));
  }

  onClose() {
    this.router.navigateByUrl(this.prevUrl);
  }
}
