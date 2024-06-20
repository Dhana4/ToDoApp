import { NgIf, DecimalPipe} from '@angular/common';
import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-task-status-percentage',
  standalone: true,
  imports: [NgIf, DecimalPipe],
  templateUrl: './task-status-percentage.component.html',
  styleUrl: './task-status-percentage.component.scss'
})
export class TaskStatusPercentageComponent {
  @Input() percentageType = signal<string>('');
  @Input() percentage = signal<number>(0);
}
