export enum ObjectType {
    Customer = 0,
    JobFileRequest = 8,
    Job = 2,
    JobFile = 6,
    SalesRepresentative = 7,
    Settings = 4,
    Shipment = 5,
    User = 1,
}

export enum Action {
    Activate = 3,
    ChangePassword = 12,
    Create = 0,
    Deactivate = 4,
    Delete = 2,
    DownloadFile = 16,
    GenerateFile = 19,
    InviteUser = 18,
    Login = 7,
    ResendInvitationLink = 11,
    ResetUserPassword = 10,
    ResetUserPasswordRequest = 9,
    SoftDelete = 5,
    StopLoginAs = 14,
    Update = 1,
    UploadFile = 15,
    VerifyAccount = 6,
    LoginAs = 13,
}
