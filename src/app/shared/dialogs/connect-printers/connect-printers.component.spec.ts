import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectPrintersComponent } from './connect-printers.component';

describe('ConnectPrintersComponent', () => {
  let component: ConnectPrintersComponent;
  let fixture: ComponentFixture<ConnectPrintersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectPrintersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectPrintersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
