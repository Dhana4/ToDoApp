import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, filter, take } from 'rxjs';
import { BehaviorSubject, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';
import { Tokens } from '../interfaces/tokens';
import { TaskService } from '../services/task.service';

let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenString = localStorage.getItem('tokens');
  const router = inject(Router);
  const tokenService = inject(TokenService);
  const taskService = inject(TaskService);
  const userService = inject(AuthService);
  let tokens: Tokens | null = null;
  if (tokenString) {
    try {
      tokens = JSON.parse(tokenString);
    } catch (e) {
      console.error('Error parsing tokens from localStorage', e);
    }
  }
  let clonedRequest = req;
  if (tokens && tokens.accessToken) {
    clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${tokens.accessToken}`
      }
    });
  }
  return next(clonedRequest).pipe(
    catchError(err => {
      if (err instanceof HttpErrorResponse) {
        if (err.status == 404) {
          taskService.tasks.next([]);
        }
        if (err.status === 401) {
          if (!isRefreshing) {
            if(window.confirm("Your session was expired! Do you want to continue?"))
            {
              isRefreshing = true;
              refreshTokenSubject.next(null);
              return userService.refresh(tokens!.refreshToken).pipe(
                switchMap((data: Tokens) => {
                  isRefreshing = false;
                  refreshTokenSubject.next(data.accessToken);
                  tokenService.setToken(data);
                  return next(clonedRequest.clone({
                    setHeaders: {
                      Authorization: `Bearer ${data.accessToken}`
                    }
                  }));
                }),
                catchError((error: Error) => {
                  isRefreshing = false;
                  tokenService.removeToken();
                  router.navigate(['/signIn']);
                  return throwError(() => new Error('Error while refreshing the tokens'));
                })
              );
            }
          } 
          else {
            return refreshTokenSubject.pipe(
              filter(token => token !== null),
              take(1),
              switchMap(token => next(clonedRequest.clone({
                setHeaders: {
                  Authorization: `Bearer ${token}`
                }
              })))
            );
          }
        }
      }
      return throwError(() => err);
    })
  );
};


