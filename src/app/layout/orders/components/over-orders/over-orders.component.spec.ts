import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverOrdersComponent } from './over-orders.component';

describe('OverOrdersComponent', () => {
  let component: OverOrdersComponent;
  let fixture: ComponentFixture<OverOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
