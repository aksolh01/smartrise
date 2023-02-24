import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMenuItem, NbMenuService } from '@nebular/theme';
import { MenuService } from '../services/menu.service';
import { PermissionService } from '../services/permission.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MiscellaneousService } from '../services/miscellaneous.service';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout *ngIf="menu$ | async as menu">
      <nb-menu (contextmenu)="onContextMenu($event)" [items]="menu" autoCollapse="true"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent implements OnInit, OnDestroy {
  menu$: Observable<NbMenuItem[]>;
  allowContextMenu = true;

  // CAUTION
  // do not remove the breadcrumbService property from the constructor.
  constructor(
    private breadcrumbService: BreadcrumbService,
    private menuService: MenuService,
    private nbMenuService: NbMenuService,
    private permissionService: PermissionService,
    private miscellaneousService: MiscellaneousService,
    private modelService: BsModalService,
    private router: Router
  ) {
  }


  ngOnInit(): void {
    this.menu$ = this.permissionService
      .permissionsLoaded
      .pipe(
        map(() => this.menuService.generateMenus())
      );
    if (this.router.url === '/pages') {
      this.router.navigateByUrl('/pages/dashboard');
    }

    //To prevent right click on the parent navigation item menu
    this.nbMenuService.onItemHover().subscribe(m => {
      if (m?.item?.children?.length) {
        this.allowContextMenu = false;
      } else {
        this.allowContextMenu = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.modelService.hide();
    this.miscellaneousService.clean();
  }

  onContextMenu() {
    return this.allowContextMenu;
  }
}
