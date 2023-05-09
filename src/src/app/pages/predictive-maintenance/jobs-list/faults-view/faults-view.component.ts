import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'ngx-faults-view',
  templateUrl: './faults-view.component.html',
  styleUrls: ['./faults-view.component.scss']
})
export class FaultsViewComponent implements OnInit {

  constructor(private ref: BsModalRef) { }

  ngOnInit(): void {
  }

  onCancel() {
    this.ref.hide();
  }
}
