export interface IPasscode {
    lines: any;
    message: string;
    displayPasscode: boolean;
}

export class PasscodeCallResponse implements IPasscode {
    lines: any;
    message: string;
    displayPasscode: boolean;

    constructor(displayPasscode: boolean, message: string, lines: any) {
        this.displayPasscode = displayPasscode;
        this.message = message;
        this.lines = lines;
    }
}