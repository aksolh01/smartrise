import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { PartService } from '../../../services/part.service';
import { URLs } from '../../../_shared/constants';

@Component({
  selector: 'ngx-part-details',
  templateUrl: './part-details.component.html',
  styleUrls: ['./part-details.component.scss']
})
export class PartDetailsComponent implements OnInit {

  part: any;

  constructor(
    private bcService: BreadcrumbService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private partService: PartService
  ) { }

  ngOnInit(): void {
    this.bcService.set('@partNumber', { skip: true });
    this.loadPart();
  }

  loadPart() {
    const partId = +this.activatedRoute.snapshot.paramMap.get('id');

    if (!isFinite(partId)) {
      this.router.navigateByUrl(URLs.ViewPartsURL);
      return;
    }

    this.partService.getPart(partId).subscribe(part => {
      this.part = part;
    });
  }

  onClose() {
    this.router.navigateByUrl('pages/parts-management/parts');
  }
}
