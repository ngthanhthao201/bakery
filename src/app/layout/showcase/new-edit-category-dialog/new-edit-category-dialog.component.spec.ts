import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEditCategoryDialogComponent } from './new-edit-category-dialog.component';

describe('NewEditCategoryDialogComponent', () => {
  let component: NewEditCategoryDialogComponent;
  let fixture: ComponentFixture<NewEditCategoryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewEditCategoryDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEditCategoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
