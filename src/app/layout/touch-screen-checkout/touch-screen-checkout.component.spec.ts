import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchScreenCheckoutComponent } from './touch-screen-checkout.component';

describe('TouchScreenCheckoutComponent', () => {
  let component: TouchScreenCheckoutComponent;
  let fixture: ComponentFixture<TouchScreenCheckoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TouchScreenCheckoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchScreenCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
