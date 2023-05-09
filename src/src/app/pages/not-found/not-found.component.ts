import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  cars = [
    {
      name: 'Car 1',
      controller: 'AC'
    },
    {
      name: 'Car 2',
      controller: 'DC'
    },
    {
      name: 'Car 3',
      controller: 'Hydrolic'
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    // const el = document.getElementById('nb-global-spinner');
    // if (el) {
    //   el.style['display'] = 'none';
    // }
  }

  goToHomePage() {
    this.router.navigateByUrl('/pages/dashboard');
  }
}
