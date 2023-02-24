import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ResponsiveService } from '../../../../../services/responsive.service';
import { ScreenBreakpoint } from '../../../../../_shared/models/screenBreakpoint';

@Component({
  selector: 'ngx-cables-info',
  templateUrl: './cables-info.component.html',
  styleUrls: ['./cables-info.component.scss']
})
export class CablesInfoComponent implements OnInit {
  isSmall: boolean;

  constructor(
    private responsiveService: ResponsiveService,
    private _modalRef: BsModalRef
  ) { }

  ngOnInit(): void {
    this.responsiveService.currentBreakpoint$.subscribe(w => {
      if (w === ScreenBreakpoint.lg || w === ScreenBreakpoint.xl) {
        if (this.isSmall !== false) {
          this.isSmall = false;
        }
      } else if (w === ScreenBreakpoint.md || w === ScreenBreakpoint.xs || w === ScreenBreakpoint.sm) {
        if (this.isSmall !== true) {
          this.isSmall = true;
        }
      }
    });
  }

  onCancel() {
    this._modalRef.hide();
  }
}
