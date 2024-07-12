import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject, Observable, catchError, of, tap, throwError } from 'rxjs';
import { Task } from '../../shared/interfaces/task';
import { TokenService } from '../../shared/services/token.service';
import { AddTask } from '../../shared/interfaces/add-task';
import { JsonPatchOperation } from '../../shared/interfaces/json-patch-operation';
import { ToastrService } from 'ngx-toastr';
import { TaskKpi } from '../../shared/interfaces/task-kpi';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  apiUrl = environment.apiUrl;
  isModelOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  taskToUpdate : BehaviorSubject<number|null> = new BehaviorSubject<number|null>(null);
  tasks : BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
  tasksCache : BehaviorSubject<Task[]> = new BehaviorSubject([] as Task[]);
  task : BehaviorSubject<Task|null> = new BehaviorSubject<Task|null>(null);
  private cacheKey = "tasks";
  constructor(private cacheService : CacheService,private toastr : ToastrService , private http : HttpClient, private tokenService : TokenService) 
  {
    const cachedTasks = this.cacheService.getItem<Task[]>(this.cacheKey);
    if (cachedTasks) {
      this.tasksCache.next(cachedTasks);
    }
  }
  fetchTasks(isCompleted: boolean | null = null, fromDate: Date | null = null, toDate: Date | null = null) {
    const token = this.tokenService.getToken();
    if (token) {
      if (isCompleted === null && fromDate === null && toDate === null) {
        const cachedTasks = this.tasksCache.value;
        if (cachedTasks.length > 0) {
          this.tasks.next(cachedTasks);
          return;
        }
      }
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
            if (isCompleted === null && fromDate === null && toDate === null) {
              this.tasksCache.next(data);
              this.cacheService.setItem(this.cacheKey, this.tasksCache);
            }
            this.tasks.next(data);
          },
          error: (err) => {
              console.error('Error fetching tasks', err);
          }
      });
    }
    else
    {
      this.toastr.error('No token found in local storage', 'Error');
    }
  }

  fetchTaskKPIs(): Observable<TaskKpi> {
    return this.http.get<TaskKpi>(`${this.apiUrl}/Task/kpis`);
  }
  
  addTask(task: AddTask): Observable<Task> {
    const token = this.tokenService.getToken();
    if(token){
      return this.http.post<Task>(`${this.apiUrl}/Task`, task).pipe(
        tap((newTask) => {
          const currentTasks = this.tasksCache.value;
          currentTasks.push(newTask);
          this.tasksCache.next(currentTasks);
          this.cacheService.setItem(this.cacheKey, currentTasks);
        })
      );
    }
    else {
      this.toastr.error('No token found in local storage', 'Error');
      return throwError('No token found in local storage');
    }
  }

  deleteTask(taskId: number): Observable<Task> {
    return this.http.delete<Task>(`${this.apiUrl}/Task/id?id=${taskId}`).pipe(
      tap(() => {
        const currentTasks = this.tasksCache.value.filter(t => t.id !== taskId);
        this.tasksCache.next(currentTasks);
        this.cacheService.setItem(this.cacheKey, currentTasks);
      })
    );
  }
  getTaskById(id: number) : Observable<Task>{
    const token = this.tokenService.getToken();
    if (token) {
      const cachedTask = this.tasksCache.value.find(task => task.id === id);
      if (cachedTask) {
        this.task.next(cachedTask);
        return of(cachedTask);
      } else {
        return this.http.get<Task>(`${this.apiUrl}/Task/id?id=${id}`).pipe(
          tap((data) => {
            this.task.next(data);
            const currentTasks = this.tasksCache.value;
            currentTasks.push(data);
            this.tasksCache.next(currentTasks);
            this.cacheService.setItem(this.cacheKey, currentTasks);
          }),
          catchError((err) => {
            this.toastr.error('Error fetching task', 'Error');
            console.error('Error fetching task', err);
            return throwError(err);
          })
        );
      }
    } else {
      this.toastr.error('No token found in local storage', 'Error');
      return throwError('No token found in local storage');
    }
  }

  updateTask(taskId: number, task: AddTask): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/Task/id?id=${taskId}`, task).pipe(
      tap((updatedTask) => {
        const currentTasks = this.tasksCache.value.map(t => t.id === taskId ? updatedTask : t);
        this.tasksCache.next(currentTasks);
        this.cacheService.setItem(this.cacheKey, currentTasks);
      })
    );
  }

  updateTaskPartial(taskId: number, patchDocument: JsonPatchOperation[]): Observable<any> {
    return this.http.patch<Task>(`${this.apiUrl}/Task?taskId=${taskId}`, patchDocument).pipe(
      tap((updatedTask) => {
        const currentTasks = this.tasksCache.value.map(t => t.id === taskId ? updatedTask : t);
        this.tasksCache.next(currentTasks);
        this.cacheService.setItem(this.cacheKey, currentTasks);
      })
    );
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
    this.cacheService.removeItem();
    return this.http.delete<boolean>(url);
  }
}