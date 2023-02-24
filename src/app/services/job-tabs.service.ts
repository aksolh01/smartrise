import { Injectable } from '@angular/core';
import { Tab } from '../_shared/models/jobTabs';

@Injectable()
export class JobTabService {

    tab: Tab;
    data: any;

    getSelectedTab() {
        const jobSelectedTab = sessionStorage.getItem('jobSelectedTab');
        return Tab[jobSelectedTab];
    }

    setSelectedTab(tab: Tab, data: any = null) {
        sessionStorage.setItem('jobSelectedTab', Tab[tab]);
        sessionStorage.setItem('jobSelectedTabExtraData', data);
    }

    getExtraData() {
        return sessionStorage.getItem('jobSelectedTabExtraData');
    }
}
