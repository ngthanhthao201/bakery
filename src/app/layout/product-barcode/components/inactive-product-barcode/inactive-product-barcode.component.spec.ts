import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InactiveProductBarcodeComponent } from './inactive-product-barcode.component';

describe('InactiveProductBarcodeComponent', () => {
  let component: InactiveProductBarcodeComponent;
  let fixture: ComponentFixture<InactiveProductBarcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InactiveProductBarcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InactiveProductBarcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
