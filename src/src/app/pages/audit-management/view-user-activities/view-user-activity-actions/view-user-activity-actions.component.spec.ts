import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewUserActivityActionsComponent } from './view-user-activity-actions.component';

describe('ViewUserActivityActionsComponent', () => {
  let component: ViewUserActivityActionsComponent;
  let fixture: ComponentFixture<ViewUserActivityActionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewUserActivityActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUserActivityActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
