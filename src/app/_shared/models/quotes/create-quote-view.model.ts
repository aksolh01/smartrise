/* eslint-disable */
import { AutoMap } from '@nartc/automapper';
import { ICreateQuoteView } from './create-quote-view-i.model';
import { IJobLocationView } from './quote-view-i.model';
import { JobLocationView } from './quote-view.model';

export class CreateQuoteView implements ICreateQuoteView {

    constructor(props?: Partial<CreateQuoteView>) {
        if(props) {
            Object.assign(this, props);
            if(props.jobLocation) {
                this.jobLocation = new JobLocationView(props.jobLocation);
            }
        }
    }

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
    jobLocation: IJobLocationView;
    @AutoMap()
    consultantName: string;
    @AutoMap()
    buildingType: string;
    @AutoMap()
    unknownConsultant: boolean;
    @AutoMap()
    phone: string;
    @AutoMap()
    email: string;
}
