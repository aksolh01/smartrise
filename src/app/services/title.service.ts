import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationCancel, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Injectable()
export class TitleService {

  constructor(
    private router: Router,
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
  ) {

  }

  updatePageTitle() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd || event instanceof NavigationCancel),
        map(() => {
          let child = this.activatedRoute?.firstChild;

          while (child?.firstChild) {
            child = child.firstChild;
          }

          if (child?.snapshot?.data['title']) {
            return (child?.snapshot?.data['title']);
          }

          return this.titleService.getTitle();
        })
      )
      .subscribe((ttl: string) => {
        this.titleService.setTitle(ttl);
      }, error => {
        console.log(error);
      });
  }

  reUpdateTitle() {

  }
}
