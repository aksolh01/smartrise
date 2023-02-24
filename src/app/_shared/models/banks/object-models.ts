import { AutoMap } from '@nartc/automapper';

export interface IUpdateBankAccountObjectModel {
    accountType: string;
    accountHolderName: string;
}

export class UpdateBankAccountObjectModel implements IUpdateBankAccountObjectModel {

    constructor(props?: Partial<UpdateBankAccountObjectModel>) {
        Object.assign(this, props);
    }

    @AutoMap()
    public accountType: string;
    @AutoMap()
    public accountHolderName: string;
}
