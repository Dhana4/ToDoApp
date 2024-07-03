import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const tokens = localStorage.getItem('tokens');
  const router = inject(Router);
  if(tokens){
    return true;
  }
  else{
    router.navigate(['/signIn']);
    return false;
  }
};
