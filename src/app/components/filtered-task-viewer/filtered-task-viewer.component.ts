import { Component, signal } from '@angular/core';
import { Task } from '../../interfaces/task';
import { TaskService } from '../../services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { TaskDetailsComponent } from '../task-details/task-details.component';
@Component({
  selector: 'app-filtered-task-viewer',
  standalone: true,
  imports: [NgFor, DatePipe, CommonModule, TaskDetailsComponent],
  providers : [DatePipe],
  templateUrl: './filtered-task-viewer.component.html',
  styleUrl: './filtered-task-viewer.component.scss'
})
export class FilteredTaskViewerComponent {
  clickedTaskId = signal<number|null>(null);
  formattedDate = signal<string|null>('');
  tasks = signal<Task[]>([]);
  isModalOpen = signal<boolean>(false);
  constructor(private datePipe : DatePipe,private taskService : TaskService, private router : Router, private activatedRoute : ActivatedRoute){}
  ngOnInit(){
    this.loadTasks()
    this.taskService.isModelOpen.subscribe({
      next : (data) => {
        this.isModalOpen.set(data);
      }
    })
  }
  loadTasks(){
    this.formattedDate.set(this.datePipe.transform(new Date(), 'EEEE, d MMMM yyyy'));
    this.activatedRoute.url.subscribe(segments => {
      const lastSegment = segments[segments.length - 1]?.path;

      if (lastSegment === 'active' || lastSegment === 'completed') {
        this.taskService.fetchTasks();
        this.taskService.tasks.subscribe({
          next : (data: Task[]) => {
            if (lastSegment === 'active') {
              this.tasks.set(data.filter(task => !task.status));
            } else if (lastSegment === 'completed') {
              this.tasks.set(data.filter(task => task.status));
            }
          },
          error: (error :Error) => {
            console.error('Error in fetching tasks', error);
            alert('Error in fetching tasks');
          }
        });
      } else {
        console.error('Invalid route segment');
        alert('Invalid route segment');
        this.router.navigate(['/']);
      }
    });
  }
  taskDeleted(){

  }
  onTaskClicked(taskId : number){
    if(this.clickedTaskId() == taskId){
      this.clickedTaskId.set(null);
    }
    else{
      this.clickedTaskId.set(taskId);
    }
  }
  changeClickedTaskId(taskId: number) {
    if(this.clickedTaskId() == taskId){
      this.clickedTaskId.set(null);
    }
  }
}
