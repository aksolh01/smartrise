import { AutoMap } from '@nartc/automapper';

export interface ITextValue {
    value: any;
    description: string;
}

export interface IEnumValue {
    value: string;
    description: string;
}

export interface IEnumValueResponse {
    value: string;
    description: string;
}

export interface IEnumValueView {
    value: string;
    description: string;
}

export class EnumValueResponse implements IEnumValueResponse {

    constructor(props?: Partial<EnumValueResponse>) {
        if(props) {
            Object.assign(this, props);
        }
    }

    @AutoMap()
    value: string;
    @AutoMap()
    description: string;
}

export class EnumValueView implements IEnumValueView {

    constructor(props?: Partial<EnumValueView>) {
        if(props) {
            Object.assign(this, props);
        }
    }

    @AutoMap()
    value: string;
    @AutoMap()
    description: string;
}
