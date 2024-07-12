import { Component, Input, signal } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { FormGroup , FormBuilder, ReactiveFormsModule, FormsModule, Validators} from '@angular/forms';
import { AddTask } from '../../../shared/interfaces/add-task';
import {CommonModule} from '@angular/common'
import { Task } from '../../../shared/interfaces/task';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule,MatDatepickerModule, MatInputModule, MatSelectModule, MatMomentDateModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  currentRoute : string = '';
  isModalOpen = signal<boolean>(false);
  taskToUpdate = signal<number|null>(null);
  addTaskForm : FormGroup;
  constructor(private toastr : ToastrService ,private taskService : TaskService, private fb : FormBuilder, private activatedRoute : ActivatedRoute, private router : Router){
    this.addTaskForm = this.fb.group({
      title : ['',Validators.required],
      description : ['',Validators.required],
      dueDate : [null]
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
            description: task.description,
            dueDate: task.dueDate ? new Date(task.dueDate) : null
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
    this.addTaskForm.markAllAsTouched();
    if (this.addTaskForm.valid) {
      const newTask: AddTask = this.addTaskForm.value;
      if (this.taskToUpdate() === null) {
        this.taskService.addTask(newTask).subscribe({
          next: (data: Task) => {
            this.toastr.success('Task added sucessfully', 'Sucess');
            console.log(data);
            this.closeModel();
            this.handleFetchTasks();
          },
          error: (error) => {
            if(error.status === 409){
              this.toastr.error('Task already exist', 'Error');
            }
            else{
              this.toastr.error('Error in adding task', 'Error');
            }
            this.closeModel();
          }
        });
      } else {
        this.taskService.updateTask(this.taskToUpdate()!, newTask).subscribe({
          next: (data: Task) => {
            this.toastr.success('Task Updated Sucessfully', 'Success');
            console.log(data);
            this.closeModel();
            this.handleFetchTasks();
          },
          error: (error: Error) => {
            this.toastr.error('Error in updating tasks','Error');
            console.log(error);
            this.closeModel();
          }
        });
        this.taskService.taskToUpdate.next(null);
      }
    }
  }
  handleFetchTasks() {
    const currentRoute = this.router.url;
    if (currentRoute.endsWith('dashboard')) {
      this.taskService.fetchTasks();
    } else if(currentRoute.endsWith('active')){
      this.taskService.fetchTasks(false);
    }
    else if(currentRoute.endsWith('completed')){
      this.taskService.fetchTasks(true);
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
    this.toastr.info('Task Addition cancelled by user','Info');
  }
  myDateFilter = (d: Date | null): boolean => {
    const date = (d || new Date());
    const today = new Date();
    return date >= new Date(today.setHours(0, 0, 0, 0));
  }
  
}
