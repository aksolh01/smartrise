import { AutoMap } from '@nartc/automapper';

export interface IUpdateBankAccountDto {
    id: number;
    accountType: string;
    accountHolderName: string;
}

export class UpdateBankAccountPayload implements IUpdateBankAccountDto {
  @AutoMap()
  id: number;
  @AutoMap()
  accountType: string;
  @AutoMap()

  accountHolderName: string;
    constructor(props?: Partial<UpdateBankAccountPayload>) {
        Object.assign(this, props);
    }
}
