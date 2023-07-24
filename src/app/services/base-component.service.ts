import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionService } from './permission.service';
import { TokenService } from './token.service';
import { MultiAccountsService } from './multi-accounts-service';
import { MiscellaneousService } from './miscellaneous.service';

@Injectable()
export class BaseComponentService {

    constructor(
        public router: Router,
        public permissionService: PermissionService,
        public datePipe: DatePipe,
        public tokenService: TokenService,
        public multiAccountService: MultiAccountsService,
        public miscellaneousService: MiscellaneousService
    ) {

    }
}
