import { CommonModule, DatePipe, NgFor } from '@angular/common';
import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../interfaces/task';
import { TaskStatusPercentageComponent } from '../task-status-percentage/task-status-percentage.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TaskStatusPercentageComponent,RouterLink,RouterLinkActive, RouterOutlet, NgFor, CommonModule, ],
  providers: [DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  formattedDate = signal<string|null>('');
  tasks = signal<Task[]>([]);
  completedPercentage = signal<number>(0);
  activePercentage = signal<number>(0);
  completed_text = signal<string>('Completed');
  active_text = signal<string>('Active');
  constructor(private datePipe: DatePipe, private taskService: TaskService) {}

  ngOnInit() {
    this.formattedDate.set(this.datePipe.transform(new Date(), 'EEEE, d MMMM yyyy'));
    this.taskService.fetchTasks();
    this.taskService.tasks.subscribe({
      next : (data : Task[]) =>{
        this.tasks.set(data);
        this.calculatePercentages();
      },
      error : (error : Error) => {
        alert("Error in fetching tasks");
      }
    })
  }
  calculatePercentages() {
    if (this.tasks().length > 0) {
      const totalTasks = this.tasks().length;
      const completedTasks = this.tasks().filter(task => task.status === true).length;
      const activeTasks = this.tasks().filter(task => task.status === false).length;
      this.completedPercentage.set(Math.round((completedTasks / totalTasks) * 100));
      this.activePercentage.set(Math.round((activeTasks / totalTasks) * 100));
    }
  }
}
