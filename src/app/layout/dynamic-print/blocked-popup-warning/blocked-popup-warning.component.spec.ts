import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockedPopupWarningComponent } from './blocked-popup-warning.component';

describe('BlockedPopupWarningComponent', () => {
  let component: BlockedPopupWarningComponent;
  let fixture: ComponentFixture<BlockedPopupWarningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockedPopupWarningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockedPopupWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
