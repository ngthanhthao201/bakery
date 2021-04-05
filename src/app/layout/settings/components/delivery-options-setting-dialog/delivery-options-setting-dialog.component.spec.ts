import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryOptionsSettingDialogComponent } from './delivery-options-setting-dialog.component';

describe('DeliveryOptionsSettingDialogComponent', () => {
  let component: DeliveryOptionsSettingDialogComponent;
  let fixture: ComponentFixture<DeliveryOptionsSettingDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryOptionsSettingDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryOptionsSettingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
