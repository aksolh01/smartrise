import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { PermissionService } from '../../services/permission.service';

@Directive({
    selector: '[ngxPermission]'
})
export class PermissionDirective implements OnInit {

    color: string;
    eventHandler: any;

    @Input() disable?: boolean;
    @Input() permission: string;

    constructor(
        private el: ElementRef,
        private permissionService: PermissionService
    ) {
    }

    ngOnInit(): void {
        this._changeCursor(this.permission);
    }

    private _changeCursor(permission: string) {
        this.eventHandler = this.el.nativeElement.onclick;
        if (this.permissionService.hasPermission(permission) && !this.disable) {
            this.el.nativeElement.disabled = false;
        } else {
            this.el.nativeElement.disabled = true;
        }
    }
}
