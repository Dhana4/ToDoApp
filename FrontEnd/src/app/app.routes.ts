import { Routes,  } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SampleComponent } from './sample/sample.component';

export const routes: Routes = [
    {path : '' , redirectTo : 'signIn', pathMatch : 'full'},
    {path : 'signIn', component : SignInComponent},
    {path : 'signUp' , component : SignInComponent},
    {
        path: '',
        loadChildren: () => import('./components/layout/layout.module').then(m => m.LayoutModule)
    },
    {path: 'sample', component : SampleComponent},
    { path: '**', component: PageNotFoundComponent }
];