import { Injectable } from '@angular/core';
import { BuisnessBuilder } from './builder/business-builder';
import { BusinessContext } from './business-context';
import { DefaultProfile } from './profiles/default-profile';

@Injectable()
export class BusinessProfileService {

    constructor(private businessBuilder: BuisnessBuilder,
        private businessContext: BusinessContext,
    ) {

    }

    getDefaultProfile() {
        return new DefaultProfile(this.businessBuilder, this.businessContext);
    }
}
