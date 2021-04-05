import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderLinkConfirmComponent } from './order-link-confirm.component';

describe('OrderLinkConfirmComponent', () => {
  let component: OrderLinkConfirmComponent;
  let fixture: ComponentFixture<OrderLinkConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderLinkConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderLinkConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
