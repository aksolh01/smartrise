import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsListCellComponent } from './accounts-list-cell.component';

describe('AccountsListCellComponent', () => {
  let component: AccountsListCellComponent;
  let fixture: ComponentFixture<AccountsListCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountsListCellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsListCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
