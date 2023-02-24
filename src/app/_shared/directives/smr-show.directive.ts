import {
  Directive,
  EmbeddedViewRef,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ScreenBreakpoint } from '../models/screenBreakpoint';
import {
  ResponsiveService,
} from '../../services/responsive.service';

@Directive({
  selector: '[ngxShow]',
})
export class NgxShowDirective implements OnInit, OnDestroy {
  private _subscription: Subscription;
  private _showOn: ScreenBreakpoint[] = [];
  private _showViewRef: EmbeddedViewRef<void>;

  @Input() set ngxShow(breakpoints: ScreenBreakpoint[]) {
    this._showOn = breakpoints;
  }

  constructor(
    private _viewContainer: ViewContainerRef,
    private _showTemplateRef: TemplateRef<void>,
    private _rs: ResponsiveService
  ) {}

  ngOnInit(): void {
    this._subscription = this._rs.currentBreakpoint$.subscribe((m) => {
      this._updateView(m);
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
    this._subscription = null;
  }

  private _updateView(bp: ScreenBreakpoint): void {
    if (this._shouldShow(bp)) {
      if (!this._showViewRef) {
        this._viewContainer.clear();
        this._showViewRef = this._viewContainer.createEmbeddedView(
          this._showTemplateRef
        );
      }
    } else {
      if (this._showViewRef) {
        this._viewContainer.clear();
        this._showViewRef = null;
      }
    }
  }

  private _shouldShow(bp: ScreenBreakpoint): boolean {
    return this._showOn.indexOf(bp) > -1;
  }
}
