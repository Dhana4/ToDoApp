import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import {CommonModule} from '@angular/common';
import { TokenService } from './services/token.service';
import { AddTask } from './interfaces/add-task';
import { TaskService } from './services/task.service';
import { ModalComponent } from './components/modal/modal.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,RouterOutlet, CommonModule, ModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ToDoApp';
  heading = signal<string>("");
  isLogged = signal<boolean>(false);
  isModalOpen = signal<boolean>(false);
  constructor(private taskService : TaskService,private router : Router, private tokenServie : TokenService){
  }
  ngOnInit(){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateRouteState(this.router.url);
      }
    }); 
    this.updateRouteState(this.router.url);
    this.taskService.isModelOpen.subscribe({
      next : (data : boolean) => {
        this.isModalOpen.set(data);
      }
    });
  }
  updateRouteState(url: string) {
    if(url.includes('dashboard') || url.includes('active') || url.includes('completed')){
      this.isLogged.set(true);
    }
    if(url.includes('dashboard')){
      this.heading.set('Dashboard');
    }
    else if(url.includes('active')){
      this.heading.set('Active');
    }
    else if(url.includes('completed')){
      this.heading.set('Completed');
    }
  }
  signOut(){
    this.tokenServie.removeToken();
    this.isLogged.set(false);
    this.router.navigate(['/signIn']);
  }
  openModel(){
    this.isModalOpen.set(true);
    this.taskService.isModelOpen.next(true);
  }

}
