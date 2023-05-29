/* eslint-disable */
import { AutoMap } from '@nartc/automapper';
import { ICreateQuotePayload } from './create-quote-payload-i.model';
import { CreateQuoteView } from './create-quote-view.model';
import { FunctionConstants } from '../../constants';

export class CreateQuotePayload implements ICreateQuotePayload {
    static mapFromView(quoteView: CreateQuoteView): CreateQuotePayload {
        const dest = FunctionConstants.map(quoteView, CreateQuotePayload, []) as CreateQuotePayload;
        
        dest.stateValue = quoteView?.jobLocation?.state?.value;
        dest.city = quoteView?.jobLocation?.city;

        delete dest['jobLocation'];
        delete dest['customer'];

        return dest;
    }

    constructor(props?: Partial<CreateQuotePayload>) {
        if (props) {
            Object.assign(this, props);
        }
    }

    customerId: number;
    @AutoMap()
    creationDate: Date;
    @AutoMap()
    jobStatus: string;
    @AutoMap()
    modernization: string;
    @AutoMap()
    newConstruction: boolean;
    @AutoMap()
    jobName: string;
    @AutoMap()
    contact: string;
    @AutoMap()
    contactId: number;
    @AutoMap()
    biddingDate?: Date;
    @AutoMap()
    countryValue: string;
    @AutoMap()
    stateValue: string;
    @AutoMap()
    city: string;
    @AutoMap()
    consultantName: string;
    @AutoMap()
    unknownConsultant: boolean;
    @AutoMap()
    buildingType: string;
    @AutoMap()
    phone: string;
    @AutoMap()
    email: string;
}
