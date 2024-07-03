import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { FilteredTaskViewerComponent } from '../filtered-task-viewer/filtered-task-viewer.component';
import { authGuard } from '../../guard/auth.guard';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', data : {status :'dashboard'}  ,component: DashboardComponent ,canActivate: [authGuard] },
      { path: 'active', data : {status : 'active'},component: FilteredTaskViewerComponent },
      { path: 'completed', data : {status : 'completed'},component: FilteredTaskViewerComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
