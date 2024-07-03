import { Injectable } from '@angular/core';
import { Tokens } from '../interfaces/tokens';
@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }
  getToken(): string | null {
    return localStorage.getItem('tokens');
  }

  setToken(tokens: Tokens): void {
    localStorage.setItem('tokens', JSON.stringify(tokens));
  }

  removeToken(): void {
    localStorage.removeItem('tokens');
  }
}
