import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class SelectHelperService {
    allowOnScroll = new EventEmitter<boolean>();
}
