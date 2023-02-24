import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectableAccountCellComponent } from './selectable-account-cell.component';

describe('SelectableAccountCellComponent', () => {
  let component: SelectableAccountCellComponent;
  let fixture: ComponentFixture<SelectableAccountCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectableAccountCellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectableAccountCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
