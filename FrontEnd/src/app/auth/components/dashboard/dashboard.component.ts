import { CommonModule, DatePipe, NgFor } from '@angular/common';
import { Component, signal } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../../shared/interfaces/task';
import { TaskStatusPercentageComponent } from '../task-status-percentage/task-status-percentage.component';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { DashboardFilterComponent } from '../dashboard-filter/dashboard-filter.component';
import { TaskKpi } from '../../../shared/interfaces/task-kpi';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DashboardFilterComponent,TaskStatusPercentageComponent,RouterLink,RouterLinkActive, RouterOutlet, NgFor, CommonModule,FormsModule],
  providers: [DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  isCompleted = signal<boolean|null>(null);
  fromDate = signal<Date|null>(null);
  toDate = signal<Date|null>(null);
  noTasksFound = signal<boolean>(false);
  tasks = signal<Task[]>([]);
  completedPercentage = signal<number>(0);
  activePercentage = signal<number>(0);
  completed_text = signal<string>('Completed');
  active_text = signal<string>('Active');
  constructor(private toastr: ToastrService,private datePipe: DatePipe, private taskService: TaskService) {
  }
  ngOnInit() {
    this.fetchTasks();
  }
  fetchTasks(isCompleted: boolean|null = null, fromDate: Date|null = null, toDate: Date|null = null) {
    this.taskService.fetchTasks(isCompleted, fromDate, toDate);
    this.taskService.tasks.subscribe({
      next : (data : Task[]) =>{
        if(data.length == 0){
          this.noTasksFound.set(true);
        }
        else{
          this.noTasksFound.set(false);
        }
        this.tasks.set(data);
        this.fetchTaskKPIs();
      },
      error : (error : Error) => {
        this.toastr.error('Error in fetching tasks','Error');
        console.log('Error in fetching tasks',error);
      }
    })
  }

  onFilterApplied(filterValues: { status: string, fromDate: Date | null, toDate: Date | null }) {
    const { status, fromDate, toDate } = filterValues;
    this.fromDate.set(fromDate);
    this.toDate.set(toDate);
    let isCompleted: boolean | null;
    if (status === 'active') {
      isCompleted = false;
      this.isCompleted.set(false);
    } else if (status === 'completed') {
      isCompleted = true;
      this.isCompleted.set(true);
    } else {
      isCompleted = null;
      this.isCompleted.set(null);
    }
    this.fetchTasks(isCompleted, fromDate, toDate);
  }

  fetchTaskKPIs() {
    this.taskService.fetchTaskKPIs().subscribe({
      next: (kpi: TaskKpi) => {
        this.completedPercentage.set(kpi.completedPercentage);
        this.activePercentage.set(kpi.activePercentage);
      },
      error: (error: Error) => {
        this.toastr.error('Error in fetching task KPIs', 'Error');
        console.log('Error in fetching task KPIs', error);
      }
    });
  }

  deleteAllTasks(): void {
    if (window.confirm(`Are you sure to delete All Tasks?`)){
      this.taskService.deleteAllTasks(this.isCompleted(), this.fromDate(), this.toDate()).subscribe({
        next : () =>{
          this.toastr.success('All tasks deleted successfully', 'Success');
        },
        error : (error : Error) => {
          this.toastr.error('Error in deleting the tasks','Error');
          console.log("error in deleting tasks",error);
        }
      })
    }
    else{
      this.toastr.info('Deletion Cancelled by the user','Info');
    }
  }
}
