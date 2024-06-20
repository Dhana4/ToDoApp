import { Injectable } from '@angular/core';
import {jwtDecode} from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }
  getUserIdFromToken(token: string): string {
    const decodedToken: any = jwtDecode(token);
    return decodedToken.userId;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  removeToken(): void {
    localStorage.removeItem('token');
  }
}
