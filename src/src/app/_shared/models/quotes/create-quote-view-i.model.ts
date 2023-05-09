import { IJobLocationView } from './quote-view-i.model';

export interface ICreateQuoteView {
    creationDate: Date;
    jobStatus: string;
    modernization: string;
    newConstruction: boolean;
    jobName: string;
    contact: string;
    contactId: number;
    biddingDate?: Date;
    jobLocation: IJobLocationView;
    consultantName: string;
    unknownConsultant: boolean;
    buildingType: string;
    phone: string;
    email: string;
}
