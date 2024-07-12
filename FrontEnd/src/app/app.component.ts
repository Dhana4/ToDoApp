import { Component, computed} from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {CommonModule, NgIf} from '@angular/common';
import { ModalComponent } from './auth/components/modal/modal.component';
import { SpinnerService } from './shared/services/spinner.service';
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
