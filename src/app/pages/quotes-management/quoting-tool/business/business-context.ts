import { Injectable } from '@angular/core';
import { IQuoteLookupDataView } from '../../../../_shared/models/quotes/quote-lookup-data-i.model';
import { IQuoteView } from '../../../../_shared/models/quotes/quote-view-i.model';
import { WorkingMode } from './types';
import { IBusinessUIActions } from './business-actions';

@Injectable()
export class BusinessContext {

    public actions: IBusinessUIActions;
    public lookupData: IQuoteLookupDataView;
    public quote: IQuoteView;
    public workingMode: WorkingMode;
}
