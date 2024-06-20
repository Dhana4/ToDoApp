import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  debugger;
  const token = localStorage.getItem('token');
  //const router = Inject(Router);
  if(token){
    return true;
  }
  else{
    //router.navigate('/login');
    return false;
  }
};
