import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmResetStuffsComponent } from './confirm-reset-stuffs.component';

describe('ConfirmResetStuffsComponent', () => {
  let component: ConfirmResetStuffsComponent;
  let fixture: ComponentFixture<ConfirmResetStuffsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmResetStuffsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmResetStuffsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
