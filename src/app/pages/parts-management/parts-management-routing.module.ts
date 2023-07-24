import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartsManagementComponent } from './parts-management/parts-management.component';
import { PartsListComponent } from './parts-list/parts-list.component';
import { PartDetailsComponent } from './part-details/part-details.component';

const routes: Routes = [
  {
    path: '',
    component: PartsManagementComponent,
    data: { title: 'PartsManagement' },
    children: [
      {
        path: 'parts',
        data: { title: 'Parts', breadcrumb: { label: 'Parts', } },
        children: [
          {
            path: '',
            component: PartsListComponent,
            data: { title: 'Parts' },
          },
          {
            path: ':id/view',
            component: PartDetailsComponent,
            data: { title: 'Part Details', breadcrumb: { alias: 'partNumber' } },
          },
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartsManagementRoutingModule { }
