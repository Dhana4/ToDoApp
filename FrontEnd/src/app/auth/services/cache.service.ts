import { Injectable } from '@angular/core';
import { Task } from '../../shared/interfaces/task';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  constructor() { }

  setItem<T>(key: string, value: T): void {
    if (key === 'tasks' && Array.isArray(value)) {
      value = this.sortTasks(value as Task[]) as any;
    }
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item) as T;
    }
    return null;
  }

  removeItem(): void {
    localStorage.removeItem('tasks');
  }

  private sortTasks(tasks: Task[]): Task[] {
    return tasks.sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted));
  }
}