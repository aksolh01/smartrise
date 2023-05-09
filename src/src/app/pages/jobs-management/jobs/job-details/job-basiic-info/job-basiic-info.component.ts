import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { IJob } from '../../../../../_shared/models/job';
import { IPasscode } from '../../../../../_shared/models/passcode.model';
import { FillPasscodeComponent } from '../../fill-passcode/fill-passcode.component';
import { MiscellaneousService } from '../../../../../services/miscellaneous.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Ng2TableCellComponent } from '../../../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { PasscodeCellComponent } from './passcode-cell/passcode-cell.component';

@Component({
  selector: 'ngx-job-basiic-info',
  templateUrl: './job-basiic-info.component.html',
  styleUrls: ['./job-basiic-info.component.scss'],
})
export class JobBasiicInfoComponent implements OnDestroy, OnChanges, OnInit {
  @Input() job: IJob;
  @Input() passcode: IPasscode;
  @Input() displayAccountName: boolean;
  @Output() refresh = new EventEmitter();
  accountTitle: string;
  isSmartrise: boolean;
  passcodeSource: LocalDataSource;
  passcodeSettings: any = {
    mode: 'external',
    actions: {
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      carName: {
        title: 'Car',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Car');
        },
        show: false,
        filter: false
      },
      passcode: {
        title: 'Passcode',
        type: 'custom',
        renderComponent: PasscodeCellComponent,
        onComponentInitFunction: (instance: PasscodeCellComponent) => {
          instance.setHeader('Passcode');
        },
        show: false,
        filter: false
      },
    }
  };

  constructor(
    private router: Router,
    private modelService: BsModalService,
    private miscellaneousService: MiscellaneousService
  ) {

  }

  ngOnInit(): void {
    this.isSmartrise = this.miscellaneousService.isSmartriseUser();
    this._setAccountTitle();
    this._initializePasscodeTable();
  }

  private _initializePasscodeTable() {
    this.passcodeSource = new LocalDataSource(this.passcode.lines);
    this.passcodeSource.refresh();
  }

  private _setAccountTitle() {
    this.accountTitle = this.miscellaneousService.isSmartriseUser() ? 'Ordered By' : 'Account Name';
  }

  ngOnChanges(changes: SimpleChanges): void {
    //this.passcode = replaceAll(this.job?.tempPasscode, '\n', '</br>')?.trim();
  }

  ngOnDestroy(): void {
    this.modelService?.hide();
  }

  getValue(value: any) {
    return value === null || value.toString().trim() === '' ? 'N/A' : value;
  }

  onClose() {
    this.router.navigateByUrl('pages/jobs-management/jobs');
  }

  onFillPasscode() {
    const ref = this.modelService.show<FillPasscodeComponent>(FillPasscodeComponent,
      {
        initialState: {
          jobId: this.job.id,
        }
      }
    );
    ref.onHide.subscribe(() => {
      this.refresh.next(null);
    });
  }
}
