import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-download-progress',
  templateUrl: './download-progress.component.html',
  styleUrls: ['./download-progress.component.scss']
})
export class DownloadProgressComponent implements OnInit {

  progress = 0;

  ngOnInit(): void {
  }

}
