import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoldProductBarcodeComponent } from './sold-product-barcode.component';

describe('SoldProductBarcodeComponent', () => {
  let component: SoldProductBarcodeComponent;
  let fixture: ComponentFixture<SoldProductBarcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoldProductBarcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoldProductBarcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
