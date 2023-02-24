/* eslint-disable */
import { AutoMap } from '@nartc/automapper';
import { ICreateQuotePayload } from './create-quote-payload-i.model';

export class CreateQuotePayload implements ICreateQuotePayload {

    constructor(props?: Partial<CreateQuotePayload>) {
        if(props) {
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
