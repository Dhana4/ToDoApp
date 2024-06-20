import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Task } from '../../interfaces/task';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { JsonPatchOperation } from '../../interfaces/json-patch-operation';
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

  constructor(private taskService : TaskService){}
  getHoursAgo(createdOn: Date|string): string {
    const createdDate = new Date(createdOn);
    const now = new Date();
    const diffInMs = now.getTime() - createdDate.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    return `${diffInHours}`;
  }
  onDeleteTask() {
    const taskId = this.task.id;
    if (window.confirm(`Are you sure you want to delete task ${taskId}?`)) {
      this.taskService.deleteTask(taskId).subscribe({
        next: (data: Task) => {
          alert(`Task ${taskId} deleted successfully`);
          console.log("deleted task", data);
          this.taskDeleted.emit(taskId);
        },
        error: (error: Error) => {
          alert("Error occurred in deleting the task");
          console.log(error);
        }
      });
    } else {
      console.log('Task deletion canceled by user.');
    }
  }  
  openModel(){
    this.taskService.isModelOpen.next(true);
    this.taskService.taskToUpdate.next(this.task.id);
  }
  completeTask(){
    const patchDocument: JsonPatchOperation[] = [{ op: 'replace', path: 'status', value: (true)}];
    this.taskService.updateTaskPartial(this.task.id, patchDocument).subscribe({
      next : () =>{
        alert("Task marked as completed");
        this.taskCompleted.emit(this.task.id);
      },
      error : (error : Error) => {
        alert("Error in marking task as completed");
        console.log("Error in marking task as completed",error);
      }
    })
  }
}

