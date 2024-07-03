import { Component, computed, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import {CommonModule, NgIf} from '@angular/common';
import { TokenService } from './services/token.service';
import { AddTask } from './interfaces/add-task';
import { TaskService } from './services/task.service';
import { ModalComponent } from './components/modal/modal.component';
import { SpinnerService } from './services/spinner.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgIf,RouterLink,RouterLinkActive,RouterOutlet, CommonModule, ModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  displaySpinner = computed(() => this.spinner.spinner());
  constructor(private spinner : SpinnerService,){}
}
