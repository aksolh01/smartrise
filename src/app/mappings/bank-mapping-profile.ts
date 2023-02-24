import { AutoMapper, ProfileBase, mapFrom, ignore } from '@nartc/automapper';
import { UpdateBankAccountPayload } from '../_shared/models/banks/dtos';
import { UpdateBankAccountObjectModel } from '../_shared/models/banks/object-models';

export class BankProfile extends ProfileBase {
    constructor(mapper: AutoMapper) {
        super();
        mapper.createMap(UpdateBankAccountObjectModel, UpdateBankAccountPayload)
        .forMember(d => d.id, ignore());
    }
}

