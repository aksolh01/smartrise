import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountUserActionsComponent } from './account-user-actions.component';

describe('AccountUserActionsComponent', () => {
  let component: AccountUserActionsComponent;
  let fixture: ComponentFixture<AccountUserActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountUserActionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountUserActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
