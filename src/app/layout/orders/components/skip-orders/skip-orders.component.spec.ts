import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkipOrdersComponent } from './skip-orders.component';

describe('SkipOrdersComponent', () => {
  let component: SkipOrdersComponent;
  let fixture: ComponentFixture<SkipOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkipOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkipOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
