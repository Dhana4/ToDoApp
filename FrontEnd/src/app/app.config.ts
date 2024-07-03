import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { spinnerInterceptor } from './interceptors/spinner.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(),
  provideHttpClient(withFetch(), withInterceptors([authInterceptor, spinnerInterceptor])),
  importProvidersFrom([HttpClient]),
  provideAnimations(),
  provideToastr(
    { closeButton: true, timeOut: 3000, preventDuplicates:true}
  ), provideAnimationsAsync(),
  ]
};
