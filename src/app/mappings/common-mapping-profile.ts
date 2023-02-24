import { AutoMapper, ProfileBase } from '@nartc/automapper';
import { EnumValueResponse, EnumValueView } from '../_shared/models/enumValue.model';

export class CommonProfile extends ProfileBase {
    constructor(mapper: AutoMapper) {
        super();
        mapper.createMap(EnumValueResponse, EnumValueView);
    }
}
