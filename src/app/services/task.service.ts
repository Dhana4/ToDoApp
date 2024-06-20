import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Task } from '../interfaces/task';
import { TokenService } from './token.service';
import { AddTask } from '../interfaces/add-task';
import { JsonPatchOperation } from '../interfaces/json-patch-operation';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  apiUrl = environment.apiUrl;
  isModelOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  taskToUpdate : BehaviorSubject<number|null> = new BehaviorSubject<number|null>(null);
  tasks : BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
  task : BehaviorSubject<Task|null> = new BehaviorSubject<Task|null>(null);
  constructor(private http : HttpClient, private tokenService : TokenService) { 
  }
  fetchTasks(){
    const token = this.tokenService.getToken();
    if (token) {
      const userId = this.tokenService.getUserIdFromToken(token);
      this.http.get<Task[]>(`${this.apiUrl}/Task/userId?userId=${userId}`).subscribe({
        next: (data) => {
          this.tasks.next(data);
        },
        error: (err) => {
          alert("Error fetching tasks");
          console.error('Error fetching tasks', err);
        }
      });
    } else {
      alert('No token found in local storage');
    }
  }
  addTask(task: AddTask): Observable<Task> {
    const token = this.tokenService.getToken();
    if(token){
      const userId = this.tokenService.getUserIdFromToken(token);
      return this.http.post<any>(`${this.apiUrl}/Task?userId=${userId}`, task);
    }
    else {
      alert('No token found in local storage');
      return throwError('No token found in local storage');
    }
  }
  deleteTask(taskId: number): Observable<Task> {
    return this.http.delete<Task>(`${this.apiUrl}/Task/id?id=${taskId}`);
  }
  getTaskById(id : number){
    const token = this.tokenService.getToken();
    if (token) {
      this.http.get<Task>(`${this.apiUrl}/Task/id?id=${id}`).subscribe({
        next: (data) => {
          this.task.next(data);
        },
        error: (err) => {
          alert("Error fetching task");
          console.error('Error fetching task', err);
        }
      });
    } else {
      alert('No token found in local storage');
    }
  }
  updateTask(taskId: number, task: AddTask): Observable<Task> {
    const token = this.tokenService.getToken();
    const userId = this.tokenService.getUserIdFromToken(token!);
    return this.http.put<any>(`${this.apiUrl}/Task/id?id=${taskId}&userId=${userId}`, task);
  }

  updateTaskPartial(taskId: number, patchDocument: JsonPatchOperation[]): Observable<any> {
    return this.http.patch(`${this.apiUrl}/Task?taskId=${taskId}`, patchDocument);
  }
}
