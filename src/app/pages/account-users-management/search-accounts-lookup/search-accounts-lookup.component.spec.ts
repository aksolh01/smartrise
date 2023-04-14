import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAccountsLookupComponent } from './search-accounts-lookup.component';

describe('SearchAccountsLookupComponent', () => {
  let component: SearchAccountsLookupComponent;
  let fixture: ComponentFixture<SearchAccountsLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchAccountsLookupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAccountsLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
