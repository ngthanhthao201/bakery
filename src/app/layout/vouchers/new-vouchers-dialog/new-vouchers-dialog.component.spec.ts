import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVouchersDialogComponent } from './new-vouchers-dialog.component';

describe('NewVouchersDialogComponent', () => {
  let component: NewVouchersDialogComponent;
  let fixture: ComponentFixture<NewVouchersDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewVouchersDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewVouchersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
