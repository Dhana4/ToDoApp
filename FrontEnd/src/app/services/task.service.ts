import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Task } from '../interfaces/task';
import { TokenService } from './token.service';
import { AddTask } from '../interfaces/add-task';
import { JsonPatchOperation } from '../interfaces/json-patch-operation';
import { ToastrService } from 'ngx-toastr';
import { TaskKpi } from '../interfaces/task-kpi';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  apiUrl = environment.apiUrl;
  isModelOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  taskToUpdate : BehaviorSubject<number|null> = new BehaviorSubject<number|null>(null);
  tasks : BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
  task : BehaviorSubject<Task|null> = new BehaviorSubject<Task|null>(null);
  constructor(private toastr : ToastrService , private http : HttpClient, private tokenService : TokenService) { 
  }
  fetchTasks(isCompleted: boolean | null = null, fromDate: Date | null = null, toDate: Date | null = null) {
    const token = this.tokenService.getToken();
    if (token) {
        let url = `${this.apiUrl}/Task`;
        const params: string[] = [];

        if (isCompleted !== null) {
            params.push(`isCompleted=${isCompleted}`);
        }
        if (fromDate) {
          params.push(`fromDate=${fromDate.toISOString()}`);
      }
      if (toDate) {
          params.push(`toDate=${toDate.toISOString()}`);
      }
        if (params.length > 0) {
            url += '?' + params.join('&');
        }

        this.http.get<Task[]>(url).subscribe({
            next: (data) => {
                this.tasks.next(data);
            },
            error: (err) => {
                console.error('Error fetching tasks', err);
            }
        });
    } else {
        this.toastr.error('No token found in local storage', 'Error');
    }
  }

  fetchTaskKPIs(): Observable<TaskKpi> {
    return this.http.get<TaskKpi>(`${this.apiUrl}/Task/kpis`);
  }
  
  addTask(task: AddTask): Observable<Task> {
    const token = this.tokenService.getToken();
    if(token){
      return this.http.post<any>(`${this.apiUrl}/Task`, task);
    }
    else {
      this.toastr.error('No token found in local storage', 'Error');
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
          this.toastr.error('Error fetching tasks', 'Error');
          console.error('Error fetching task', err);
        }
      });
    } else {
      this.toastr.error('No token found in local storage', 'Error');
    }
  }

  updateTask(taskId: number, task: AddTask): Observable<Task> {
    return this.http.put<any>(`${this.apiUrl}/Task/id?id=${taskId}&userId`, task);
  }

  updateTaskPartial(taskId: number, patchDocument: JsonPatchOperation[]): Observable<any> {
    return this.http.patch(`${this.apiUrl}/Task?taskId=${taskId}`, patchDocument);
  }

  deleteAllTasks(isCompleted : boolean|null, fromDate : Date|null , toDate : Date|null): Observable<boolean> {
    let queryParams = [];
    if (isCompleted !== null) {
      queryParams.push(`isCompleted=${isCompleted}`);
    }
    if (fromDate !== null) {
      queryParams.push(`fromDate=${fromDate.toISOString()}`);
    }
    if (toDate !== null) {
      queryParams.push(`toDate=${toDate.toISOString()}`);
    }

    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    const url = `${this.apiUrl}/Task${queryString}`;

    this.tasks.next([]);
    return this.http.delete<boolean>(url);
  }
}
