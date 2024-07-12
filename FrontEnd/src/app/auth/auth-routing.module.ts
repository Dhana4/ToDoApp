import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path : 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [authGuard]
      },
      {
        path : 'active',
        loadComponent: () => import('./components/filtered-task-viewer/filtered-task-viewer.component').then(m => m.FilteredTaskViewerComponent)
      },
      {
        path : 'completed',
        loadComponent: () => import('./components/filtered-task-viewer/filtered-task-viewer.component').then(m => m.FilteredTaskViewerComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
