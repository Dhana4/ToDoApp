import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskStatusPercentageComponent } from './task-status-percentage.component';

describe('TaskStatusPercentageComponent', () => {
  let component: TaskStatusPercentageComponent;
  let fixture: ComponentFixture<TaskStatusPercentageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskStatusPercentageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskStatusPercentageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
