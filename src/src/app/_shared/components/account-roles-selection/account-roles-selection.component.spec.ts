import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountRolesSelectionComponent } from './account-roles-selection.component';

describe('AccountRolesSelectionComponent', () => {
  let component: AccountRolesSelectionComponent;
  let fixture: ComponentFixture<AccountRolesSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountRolesSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountRolesSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
