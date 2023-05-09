import { map } from 'rxjs/operators';
import { BuisnessBuilder } from './builder/business-builder';
import { BusinessContext } from './business-context';

export abstract class BusinessProfile {

    constructor(protected businessBuilder: BuisnessBuilder, protected businessContext: BusinessContext) {

    }

    apply() {
        this.initialize();
        return this.businessBuilder.build();
    }

    abstract initialize();
}
