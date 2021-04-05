import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneOrdersComponent } from './done-orders.component';

describe('DoneOrdersComponent', () => {
  let component: DoneOrdersComponent;
  let fixture: ComponentFixture<DoneOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoneOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoneOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
