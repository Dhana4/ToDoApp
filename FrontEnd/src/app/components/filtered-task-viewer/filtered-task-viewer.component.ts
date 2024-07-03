import { Component, signal } from '@angular/core';
import { Task } from '../../interfaces/task';
import { TaskService } from '../../services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-filtered-task-viewer',
  standalone: true,
  imports: [NgFor, DatePipe, CommonModule, TaskDetailsComponent],
  providers : [DatePipe],
  templateUrl: './filtered-task-viewer.component.html',
  styleUrl: './filtered-task-viewer.component.scss'
})
export class FilteredTaskViewerComponent {
  noTasksFound = signal<boolean>(false);
  clickedTaskId = signal<number|null>(null);
  tasks = signal<Task[]>([]);
  currentRoute = signal<string>('');
  isModalOpen = signal<boolean>(false);
  constructor(private toastr : ToastrService,private datePipe : DatePipe,private taskService : TaskService, private router : Router, private activatedRoute : ActivatedRoute){}
  ngOnInit(){
    this.taskService.tasks.subscribe({
      next : (data) =>{
        if(data.length == 0){
          this.noTasksFound.set(true);
        }
        else{
          this.noTasksFound.set(false);
        }
      }
    })
    this.loadTasks()
    this.taskService.isModelOpen.subscribe({
      next : (data) => {
        this.isModalOpen.set(data);
      }
    })
  }
  loadTasks(){
    this.activatedRoute.url.subscribe(segments => {
      const lastSegment = segments[segments.length - 1]?.path;
      this.currentRoute.set(lastSegment);
      if (lastSegment === 'active') {
        this.taskService.fetchTasks(false);
        this.taskService.tasks.subscribe({
          next : (data: Task[]) => {
            this.tasks.set(data);
          },
          error: (error :Error) => {
            console.error('Error in fetching tasks', error);
            this.toastr.error("Error in fetching tasks", 'Error');
          }
        });
      } 
      else if(lastSegment === 'completed'){
        this.taskService.fetchTasks(true);
        this.taskService.tasks.subscribe({
          next : (data: Task[]) => {
            this.tasks.set(data);
          },
          error: (error :Error) => {
            console.error('Error in fetching tasks', error);
            this.toastr.error("Error in fetching tasks", 'Error');
          }
        });
      }
      else {
        console.error('Invalid route segment');
        this.toastr.info('invalid route segment','Info');
        this.router.navigate(['/']);
      }
    });
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
