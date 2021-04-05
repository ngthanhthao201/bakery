import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CakeSizeTypeDialogComponent } from './cake-size-type-dialog.component';

describe('CakeSizeTypeDialogComponent', () => {
  let component: CakeSizeTypeDialogComponent;
  let fixture: ComponentFixture<CakeSizeTypeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CakeSizeTypeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CakeSizeTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
