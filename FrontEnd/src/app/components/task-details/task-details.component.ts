import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Task } from '../../interfaces/task';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { JsonPatchOperation } from '../../interfaces/json-patch-operation';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss'
})
export class TaskDetailsComponent {
  @Input() task!: Task;
  @Output() taskDeleted: EventEmitter<number> = new EventEmitter<number>();
  @Output() taskCompleted : EventEmitter<number> = new EventEmitter<number>();

  constructor(private toastr : ToastrService,private taskService : TaskService){}
  getHoursAgo(createdOn: Date|string): string {
    const createdDate = new Date(createdOn);
    const now = new Date();
    const diffInMs = now.getTime() - createdDate.getTime();
    const hoursToSubtract = 5;
    const minutesToSubtract = 30;
    const msToSubtract = (hoursToSubtract * 60 * 60 + minutesToSubtract * 60) * 1000;
    const adjustedDiffInMs = diffInMs - msToSubtract;
    const diffInHours = Math.floor(adjustedDiffInMs / (1000 * 60 * 60));
    return `${diffInHours}`;
  }
  onDeleteTask() {
    const taskId = this.task.id;
    if (window.confirm(`Are you sure you want to delete task ${taskId}?`)) {
      this.taskService.deleteTask(taskId).subscribe({
        next: (data: Task) => {
          this.toastr.success(`Task ${taskId} deleted successfully`, 'success');
          console.log("deleted task", data);
          this.taskDeleted.emit(taskId);
        },
        error: (error: Error) => {
          this.toastr.error('Error occured in deleting the task', 'Error');
          console.log(error);
        }
      });
    } else {
      console.log('Task deletion canceled by user.');
      this.toastr.info('Deletion cancelled by the user','Info');
    }
  }  
  openModel(){
    this.taskService.isModelOpen.next(true);
    this.taskService.taskToUpdate.next(this.task.id);
  }
  completeTask(){
    const patchDocument: JsonPatchOperation[] = [{ op: 'replace', path: 'isCompleted', value: (true)}];
    this.taskService.updateTaskPartial(this.task.id, patchDocument).subscribe({
      next : () =>{
        this.toastr.success('Task marked as completed', 'Success');
        this.taskCompleted.emit(this.task.id);
      },
      error : (error : Error) => {
        this.toastr.error('Error in marking task as completed', 'Error');
        console.log("Error in marking task as completed",error);
      }
    })
  }
}

