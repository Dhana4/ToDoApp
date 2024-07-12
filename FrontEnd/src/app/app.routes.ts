import { Routes,  } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'unauth',
        pathMatch: 'full'
    },
    {
        path : 'unauth',
        loadChildren: () => import('./un-auth/un-auth.module').then(m => m.UnAuthModule)
    },
    {
        path : 'auth',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
    },
    {
        path : '**',
        loadChildren: () => import('./shared/shared.module').then(m => m.SharedModule)
    }
];