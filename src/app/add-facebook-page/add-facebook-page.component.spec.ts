import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFacebookPageComponent } from './add-facebook-page.component';

describe('AddFacebookPageComponent', () => {
  let component: AddFacebookPageComponent;
  let fixture: ComponentFixture<AddFacebookPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFacebookPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFacebookPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
