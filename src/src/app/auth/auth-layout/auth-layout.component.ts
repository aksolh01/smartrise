import { Component, HostListener } from '@angular/core';
import { IAuthPageComponent } from '../auth-page.interface';

@Component({
  selector: 'ngx-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss'],
})
export class AuthLayoutComponent implements IAuthPageComponent {
  pageTitle: string;
  showPolicy = false;

  onRouteChanged({ pageTitle, showPolicy }: IAuthPageComponent): void {
    this.pageTitle = pageTitle;
    this.showPolicy = !showPolicy ? false : showPolicy;
  }
}
