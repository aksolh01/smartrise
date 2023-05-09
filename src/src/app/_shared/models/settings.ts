export interface ISystemSettings {
    smtpHost: string;
    smtpPort: string;
    smtpSsl: boolean;
    smtpUsername: string;
    smtpPassword: string;
    smtpFrom: string;
    smtpReplyTo: string;
    smtpBccs: string;
    uiUrl: string;
}

export interface IBusinessSettings {
    numberOfRecords: number | 25 ;
}
