import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {path : '' , redirectTo : 'signIn', pathMatch : 'full'},
  {path : 'signIn',
     loadComponent: () => import('./components/sign-in/sign-in.component').then(m => m.SignInComponent)
  },
  {path : 'signUp' ,
  loadComponent: () => import('./components/sign-in/sign-in.component').then(m => m.SignInComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnAuthRoutingModule { }
