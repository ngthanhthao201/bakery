import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoteSupportComponent } from './remote-support.component';

describe('RemoteSupportComponent', () => {
  let component: RemoteSupportComponent;
  let fixture: ComponentFixture<RemoteSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoteSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoteSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
