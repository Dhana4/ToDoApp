import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './token.service';
import { Tokens } from '../interfaces/tokens';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = environment.apiUrl;
  user : BehaviorSubject<User> = new BehaviorSubject({userName :'',password : ''});
  constructor(private http: HttpClient, private tokenService : TokenService) {
   }
   login(credentials: User): Observable<any> {
    this.user.next(credentials);
    return this.http.post(`${this.apiUrl}/Authentication/Login`, credentials);
  }
  logout() {
    this.tokenService.removeToken();
  }
  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/Authentication/Register`, user);
  }
  refresh(refreshToken : string): Observable<any>{
    return this.http.get(`${this.apiUrl}/Authentication/Refresh?refreshToken=${refreshToken}`);
  }
}
