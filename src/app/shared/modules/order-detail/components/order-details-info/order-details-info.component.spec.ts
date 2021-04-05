import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailsInfoComponent } from './order-details-info.component';

describe('OrderDetailsInfoComponent', () => {
  let component: OrderDetailsInfoComponent;
  let fixture: ComponentFixture<OrderDetailsInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDetailsInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
