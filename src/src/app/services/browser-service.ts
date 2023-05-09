/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';

@Injectable()
export class BrowserService {
    detectBrowserName(): Browser {
        const agent = window.navigator.userAgent.toLowerCase();
        switch (true) {
            case agent.indexOf('edge') > -1:
                return Browser.Edge;
            case agent.indexOf('opr') > -1 && !!(window as any).opr:
                return Browser.Opera;
            case agent.indexOf('chrome') > -1 && !!(window as any).chrome:
                return Browser.Chrome;
            case agent.indexOf('trident') > -1:
                return Browser.IE;
            case agent.indexOf('firefox') > -1:
                return Browser.Firefox;
            case agent.indexOf('safari') > -1:
                return Browser.Safari;
            default:
                return Browser.Other;
        }
    }
}


export enum Browser {
    Edge,
    Opera,
    Chrome,
    IE,
    Firefox,
    Safari,
    Other
}
