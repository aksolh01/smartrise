/* eslint-disable @typescript-eslint/naming-convention */
import { EventEmitter, Injectable } from '@angular/core';

declare let Plaid: any;

@Injectable()
export class PlaidService {

    success = new EventEmitter<any>();
    load = new EventEmitter<void>();
    exit = new EventEmitter<any>();
    event = new EventEmitter<any>();
    handler: any;

    initializePlaidLink(link_token: string) {

        localStorage.setItem('Plaid_link_Token', link_token);
        this.handler = Plaid.create({
            token: link_token,
            onSuccess: (public_token, metadata) => {
                this.success.next({
                    public_token,
                    metadata
                });
            },
            onLoad: () => {
                this.load.next();
            },
            onExit: (err, metadata) => {
                this.exit.next({ err, metadata });
            },
            onEvent: (eventName, metadata) => {
                this.event.next({
                    eventName,
                    metadata
                });
            },
            //required for OAuth; if not using OAuth, set to null or omit:
            //receivedRedirectUri: window.location.href,
        });

        this.handler.open();
    }

    reInitializePlaidLink() {

        this.handler = Plaid.create({
            token: localStorage.getItem('Plaid_link_Token'),
            onSuccess: (public_token, metadata) => {
                this.success.next({
                    public_token,
                    metadata
                });
            },
            onLoad: () => {
                this.load.next();
            },
            onExit: (err, metadata) => {
                this.exit.next({ err, metadata });
            },
            onEvent: (eventName, metadata) => {
                this.event.next({
                    eventName,
                    metadata
                });
            },
            //required for OAuth; if not using OAuth, set to null or omit:
            receivedRedirectUri: window.location.href,
        });

        this.handler.open();
    }

    close() {
        this.handler?.exit();
        this.handler?.destroy();
    }
}
