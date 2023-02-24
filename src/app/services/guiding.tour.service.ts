import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class GuidingTourService {
    subject = new Subject<any>();

    finishHomePageTour() {
        localStorage.setItem('GuidingTourHome', '1');
        this.setShowTitle(false);
    }

    setShowTitle(showTitleFlag: boolean) {
        this.subject.next({ showTitle: showTitleFlag });
    }
}
