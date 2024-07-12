import { Component,signal } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TokenService } from '../../../shared/services/token.service';
import { CommonModule, NgIf } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';
import { CacheService } from '../../services/cache.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [NgIf,RouterLink,RouterLinkActive,RouterOutlet, CommonModule, ModalComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  viewMode: 'active' | 'completed' = 'active';
  menuOpen = false;
  selectedItem: string = 'Dashboard';
  title = 'ToDoApp';
  heading = signal<string>("");
  isModalOpen = signal<boolean>(false);
  
  constructor(private cacheService : CacheService ,private taskService : TaskService,private router : Router, private tokenServie : TokenService){
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
    if(url.includes('dashboard')){
      this.heading.set('Dashboard');
      this.selectedItem = 'Dashboard';
    }
    else if(url.includes('active')){
      this.heading.set('Active');
      this.selectedItem = 'Active'
    }
    else if(url.includes('completed')){
      this.heading.set('Completed');
      this.selectedItem = 'Completed';
    }
  }
  signOut(){
    this.tokenServie.removeToken();
    this.cacheService.removeItem();
    this.router.navigate(['/unauth/signIn']);
  }
  openModel(){
    this.isModalOpen.set(true);
    this.taskService.isModelOpen.next(true);
  }
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
  selectItem(item: string): void {
    this.selectedItem = item;
    this.menuOpen = false;
  }
}
