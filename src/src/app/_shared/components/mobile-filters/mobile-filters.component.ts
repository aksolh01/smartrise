import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, EventEmitter, HostBinding, Output } from '@angular/core';

@Component({
  selector: 'ngx-smr-mobile-filters',
  templateUrl: './mobile-filters.component.html',
  styleUrls: ['./mobile-filters.component.scss'],
  animations: [
    trigger('showMobileFilters', [
      state(
        '*',
        style({
          right: 0,
        })
      ),

      // fade in when created. this could also be written as transition('void => *')
      transition(':enter', [style({ right: '-100%' }), animate(200)]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(':leave', animate(400, style({ right: '200%' }))),
    ]),
  ],
})
export class MobileFiltersComponent {
  @Output() close = new EventEmitter<void>();
  @HostBinding('@showMobileFilters')
  get state() {
    return 'state';
  }

  onClose(): void {
    this.close.emit();
  }
}
