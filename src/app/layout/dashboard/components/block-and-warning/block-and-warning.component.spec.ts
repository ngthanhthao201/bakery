import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockAndWarningComponent } from './block-and-warning.component';

describe('BlockAndWarningComponent', () => {
  let component: BlockAndWarningComponent;
  let fixture: ComponentFixture<BlockAndWarningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockAndWarningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockAndWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
