import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GuidingTourService } from '../../../services/guiding.tour.service';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <div class="footer-container">
    <span class="created-by">Copyright © 2021 <a href="https://smartrise.us" target="_blank" class="imitate-link">Smartrise Engineering, Inc.</a> All Rights Reserved.</span>
      <div class="socials">
    <div style='display: inline-block'
    [title]="runGuidingTour === true ? 'Let\\'s connect!' : null"
    joyrideStep="fourthStep" [prevTemplate]="prevButton" [stepContent]="fourthCustomContent"
    [nextTemplate]="nextButton" (done)="onFinishingHomeTour()"
      stepPosition="top">
    <ng-template #fourthCustomContent>
      <div class='joyride-custom-content'>
      Check us out on social media.
      </div>
    </ng-template>
        <!-- <a href="#" target="_blank" class="ion ion-social-github"></a> -->

        <a
        href="https://www.facebook.com/thesmartriseengineering"
        target="_blank"
        class="ion ion-social-facebook"
        tooltip="Follow On Facebook" ></a>

        <!-- <a href="#" target="_blank" class="ion ion-social-twitter"></a> -->
        <a
        href="https://www.linkedin.com/company/smartrise/"
        target="_blank"
        class="ion ion-social-linkedin"
        tooltip="Follow On Linkedin"></a>

        <a
        href="https://www.instagram.com/smartrise/"
        target="_blank"
        class="ion ion-social-instagram"
        tooltip="Follow On Instagram"></a>
        </div>
      </div>
    </div>

    <ng-template #prevButton>
  <button class="btn btn-primary">
  <i class="fas fa-step-backward"></i>
  Prev
  </button>
</ng-template>
<ng-template #nextButton>
  <button class="btn btn-primary">
    Next
    <i class="fas fa-step-forward"></i>
  </button>
</ng-template>
  `,
})
export class FooterComponent implements OnInit {

  runGuidingTour = true;
  guidingTourSubscription: Subscription;

  constructor(private guidingTourService: GuidingTourService) { }

  ngOnInit(): void {
    this.guidingTourSubscription = this.guidingTourService.subject.subscribe(data => {
      if (data) {
        this.runGuidingTour = data.showTitle;
      }
    });

    if (localStorage.getItem('GuidingTourHome') !== null) {
      this.runGuidingTour = false;
    }
  }

  onFinishingHomeTour() {
    this.guidingTourService.finishHomePageTour();
  }
}
