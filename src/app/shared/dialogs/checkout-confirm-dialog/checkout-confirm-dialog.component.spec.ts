import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutConfirmDialogComponent } from './checkout-confirm-dialog.component';

describe('CheckoutConfirmDialogComponent', () => {
  let component: CheckoutConfirmDialogComponent;
  let fixture: ComponentFixture<CheckoutConfirmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutConfirmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
