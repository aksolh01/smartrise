import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { ScreenBreakpoint } from '../_shared/models/screenBreakpoint';

@Injectable()
export class ResponsiveService {
  private static _isInitiated = false;
  public currentBreakpoint$: Observable<ScreenBreakpoint>;
  private _screenWidth: number;
  private _currentBreakpointSubject: BehaviorSubject<ScreenBreakpoint>;

  constructor() {
    this._init();
  }

  get screenWidth(): number {
    return this._screenWidth;
  }

  private _init(): void {
    if (ResponsiveService._isInitiated) {
      throw new Error('Responsive Service is already initiated.');
    }

    this._screenWidth = window.innerWidth;

    this._currentBreakpointSubject = new BehaviorSubject(
      this._widthToBreakpoint(this.screenWidth)
    );

    this.currentBreakpoint$ = this._currentBreakpointSubject.asObservable();

    fromEvent(window, 'resize')
      .pipe(
        tap(() => (this._screenWidth = window.innerWidth)),
        map(() => this._widthToBreakpoint(window.innerWidth)),
        distinctUntilChanged(),
        debounceTime(100)
      )
      .subscribe((m) => this._currentBreakpointSubject.next(m));

    ResponsiveService._isInitiated = true;
  }

  private _widthToBreakpoint(width: number): ScreenBreakpoint {
    if (width < 576) {
      return ScreenBreakpoint.xs;
    }
    if (width >= 576 && width < 768) {
      return ScreenBreakpoint.sm;
    }
    if (width >= 768 && width < 992) {
      return ScreenBreakpoint.md;
    }
    if (width >= 992 && width < 1200) {
      return ScreenBreakpoint.lg;
    }
    if (width >= 1200) {
      return ScreenBreakpoint.xl;
    }
  }
}
