import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveProductBarcodeComponent } from './active-product-barcode.component';

describe('ActiveProductBarcodeComponent', () => {
  let component: ActiveProductBarcodeComponent;
  let fixture: ComponentFixture<ActiveProductBarcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveProductBarcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveProductBarcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
