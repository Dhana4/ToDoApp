import { Routes,  } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './services/auth.guard';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { FilteredTaskViewerComponent } from './components/filtered-task-viewer/filtered-task-viewer.component';

export const routes: Routes = [
    {path : '' , redirectTo : 'signIn', pathMatch : 'full'},
    {path : 'signIn', component : SignInComponent},
    {path : 'signUp' , component : SignInComponent},
    {path : 'dashboard', component : DashboardComponent, canActivate : [authGuard]},
    {path : 'active', component : FilteredTaskViewerComponent, canActivate : [authGuard]},
    {path : 'completed', component : FilteredTaskViewerComponent, canActivate : [authGuard]},
    {path : '**', component : PageNotFoundComponent},
];
