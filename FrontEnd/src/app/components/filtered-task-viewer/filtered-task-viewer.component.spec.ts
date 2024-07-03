import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilteredTaskViewerComponent } from './filtered-task-viewer.component';

describe('FilteredTaskViewerComponent', () => {
  let component: FilteredTaskViewerComponent;
  let fixture: ComponentFixture<FilteredTaskViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilteredTaskViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilteredTaskViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
