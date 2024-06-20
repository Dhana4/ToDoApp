import { Component, Input, signal } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { FormGroup , FormBuilder, ReactiveFormsModule, FormsModule, Validators} from '@angular/forms';
import { AddTask } from '../../interfaces/add-task';
import {CommonModule} from '@angular/common'
import { Task } from '../../interfaces/task';
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  isModalOpen = signal<boolean>(false);
  taskToUpdate = signal<number|null>(null);
  addTaskForm : FormGroup;
  constructor(private taskService : TaskService, private fb : FormBuilder){
    this.addTaskForm = this.fb.group({
      title : ['',Validators.required],
      description : ['',Validators.required]
    });
  }
  ngOnInit(){
    this.taskService.isModelOpen.subscribe({
      next : (data : boolean) => {
        this.isModalOpen.set(data);
      }
    });
    this.taskService.taskToUpdate.subscribe({
      next : (data : number|null) => {
        this.taskToUpdate.set(data);
      }
    })
    if(this.taskToUpdate() != null){
      this.taskService.getTaskById(this.taskToUpdate()!);
      this.taskService.task.subscribe({
      next: (data : Task|null) => {
        const task = data;
        if (task) {
          this.addTaskForm.patchValue({
            title: task.title,
            description: task.description
          });
        }
      },
      error: (err: Error) => {
        console.error('Error fetching task details', err);
      }
    });
    }
  }
  onAddTask() {
    if (this.addTaskForm.valid) {
      const newTask: AddTask = this.addTaskForm.value;
      if (this.taskToUpdate() === null) {
        this.taskService.addTask(newTask).subscribe({
          next: (data: Task) => {
            alert('Task Added successfully');
            console.log(data);
            this.closeModel();
            this.taskService.fetchTasks();
          },
          error: (error: Error) => {
            alert('Error in adding task');
            console.log(error);
            this.closeModel();
          }
        });
      } else {
        this.taskService.updateTask(this.taskToUpdate()!, newTask).subscribe({
          next: (data: Task) => {
            alert('Task Updated successfully');
            console.log(data);
            this.closeModel();
            this.taskService.fetchTasks();
          },
          error: (error: Error) => {
            alert('Error in updating task');
            console.log(error);
            this.closeModel();
          }
        });
        this.taskService.taskToUpdate.next(null);
      }
    }
  }
  closeModel(){
    this.isModalOpen.set(false);
    this.taskService.isModelOpen.next(false);
  }
  onCancel(){
    this.closeModel();
    if(this.taskToUpdate() != null){
      this.taskService.taskToUpdate.next(null);
    }
  }
}
