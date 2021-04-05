import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardProductBarcodesComponent } from './hard-product-barcodes.component';

describe('HardProductBarcodesComponent', () => {
  let component: HardProductBarcodesComponent;
  let fixture: ComponentFixture<HardProductBarcodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardProductBarcodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardProductBarcodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
