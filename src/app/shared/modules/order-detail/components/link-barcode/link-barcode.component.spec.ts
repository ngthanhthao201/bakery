import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkBarcodeComponent } from './link-barcode.component';

describe('LinkBarcodeComponent', () => {
  let component: LinkBarcodeComponent;
  let fixture: ComponentFixture<LinkBarcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkBarcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkBarcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
