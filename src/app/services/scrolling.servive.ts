import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class ScrollingService {
    scrollStatusChanged = new EventEmitter<boolean>();

    enableScroll() {
        this.scrollStatusChanged.next(true);
    }

    disableScroll() {
        this.scrollStatusChanged.next(false);
    }
}
