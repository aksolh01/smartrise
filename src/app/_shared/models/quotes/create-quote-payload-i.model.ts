export interface ICreateQuotePayload {
    creationDate: Date;
    jobStatus: string;
    modernization: string;
    newConstruction: boolean;
    jobName: string;
    contact: string;
    contactId: number;
    biddingDate?: Date;
    stateValue: string;
    city: string;
    consultantName: string;
    unknownConsultant: boolean;
    buildingType: string;
    phone: string;
    email: string;
}
