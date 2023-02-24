import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StorageConstants } from '../../_shared/constants';
import { IUser } from '../../_shared/models/IUser';
import { AccountService } from '../../services/account.service';
import { RoutingService } from '../../services/routing.service';

@Component({
    selector: 'ngx-is-logged-in',
    templateUrl: './is-logged-in.component.html',
    styleUrls: ['./is-logged-in.component.scss']
})
export class IsLoggedInComponent implements OnInit, AfterViewInit, OnDestroy {
    currentUserSubscription: Subscription;
    user: IUser;
    pUrl: string;

    constructor(
        private accountService: AccountService,
        private routingService: RoutingService,
        private router: Router,
    ) { }

    ngAfterViewInit(): void {
    }

    ngOnInit(): void {
        if (!sessionStorage.getItem(StorageConstants.PreventedUrl)) {
            this.pUrl = this.routingService.getPreviousUrl();
            sessionStorage.setItem(StorageConstants.PreventedUrl, this.pUrl);
        } else {
            this.pUrl = sessionStorage.getItem(StorageConstants.PreventedUrl);
        }

        this.accountService.currentUser$.subscribe((user) => {
            this.user = user;
        });
    }

    ngOnDestroy(): void {
        if (this.currentUserSubscription) {
            this.currentUserSubscription.unsubscribe();
        }
    }

    onLogOut() {
        this.accountService.logout();
        this.router.navigateByUrl(this.pUrl);
    }
}
