import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPasscodesComponent } from './job-passcodes.component';

describe('JobPasscodesComponent', () => {
  let component: JobPasscodesComponent;
  let fixture: ComponentFixture<JobPasscodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobPasscodesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobPasscodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
