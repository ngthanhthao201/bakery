import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinSettingComponent } from './checkin-setting.component';

describe('CheckinSettingComponent', () => {
  let component: CheckinSettingComponent;
  let fixture: ComponentFixture<CheckinSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckinSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckinSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
